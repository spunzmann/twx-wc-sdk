import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import './ptcs-tab.js';
import './ptcs-tabs.js';
import 'ptcs-page-select/ptcs-page-select.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';

PTCS.TabSet = class extends PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))) {
    static get template() {
        return html`
    <style>
        :host {
            display: flex;
            flex-direction: column;

            min-width: 168px;
            min-height: 36px;

            box-sizing: border-box;
            overflow: hidden;
        }
        [part="tabs-header"] {
            flex: none;
        }
        [part="pages"] {
            flex: auto;
            margin: 16px;
        }

        [part="pages"].fixed {
            overflow: auto;
        }

        [part="tabs-header"] ptcs-tab:not([visible]) {
            display: none;
        }

        [part="divider"] {
            z-index: 12;
        }

        :host([disabled]) {
            pointer-events: none;
        }

        /* to override content-box definition in IDE mode (IE case) we have to generate rule with higher priority */
        ptcs-tabs, ptcs-tab {
            box-sizing: border-box;
        }
    </style>

    <ptcs-tabs part="tabs-header" partmap="* tabs-header-*"  orientation="horizontal"
               selected="{{selected}}" disabled\$="[[disabled]]" name-items="[[items]]">
        <template is="dom-repeat" items="[[items]]">
            <ptcs-tab part="tabs-tab" label-content="[[_text(item)]]" tab-number\$="[[_displayIndex(index)]]"
			visible\$="[[_visible(item, index)]]" disabled\$="[[_or(item.disabled, disabled)]]">
              <ptcs-label part="tabs-tab-label" label="[[_text(item)]]" selected\$="[[_isTabSelected(index, selected)]]"
			  disabled\$="[[_or(item.disabled, disabled)]]" max-width="[[tabNameMaxWidth]]"></ptcs-label>
            </ptcs-tab>
        </template>
    </ptcs-tabs>
    <div part="divider" partmap="*, divider-*"></div>
    <ptcs-page-select id="pages" part="pages" selected="[[selected]]" disabled\$="[[disabled]]">
        <slot></slot>
    </ptcs-page-select>
`;
    }

    static get is() {
        return 'ptcs-tab-set';
    }

    static get properties() {
        return {
            selected: {
                type:               Number,
                value:              0,
                notify:             true,
                reflectToAttribute: true,
                observer:           '_selectTab'
            },

            defaultTabNumber: {
                type:     Number,
                value:    1,
                notify:   true,
                observer: '_defaultTabNumber'
            },

            items: {
                type:     Array,
                value:    () => [],
                observer: '_items'
            },

            tabHeight: {
                type:               Number,
                reflectToAttribute: true,
                observer:           '_heightUpdated'
            },

            selectedTabValue: {
                type:     String,
                notify:   true,
                observer: '_selectedTabValue'
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true,
                observer:           '_disabled'
            },

            selectedTabName: {
                type:     String,
                notify:   true,
                observer: '_selectedTabName'
            },

            tabNameMaxWidth: {
                type: Number
            },

            _noVisibleTabs: {
                type:     Boolean,
                value:    false,
                readOnly: true
            },

            _resizeObserver: { // To keep track of size change
                type: ResizeObserver
            }

        };
    }

    ready() {
        super.ready();

        this._resizeObserver = new ResizeObserver(entries => {
            const el = this.shadowRoot.querySelector('ptcs-tabs');
            if (el && el.items && el.selected > 0) {
                el._scrollToTab(el.items[el.selected]);
            }
        });

        this.addEventListener('selected-changed', () => {
            // Verify if ptcs-tab-set contains nested ptcs-tab-set(s). Vaadin overflow computation may need refresh
            const nestedTabsets = this.querySelectorAll('ptcs-tab-set');
            nestedTabsets.forEach((tabset) => {
                const el = tabset.shadowRoot.querySelector('ptcs-tabs');
                if (el && el._updateOverflow && typeof el._updateOverflow === 'function') {
                    el._updateOverflow();
                }
            });
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this._resizeObserver.observe(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._resizeObserver.unobserve(this);
    }

    /**
 * this function is in use in ptcs-tab@tab-number attribute.itab-number is 1-based.
 * The same one-based indexis used in the slots: ptcs-mb-container@sub-widget
 * @param index
 * @returns {*}
 * @private
 */
    _displayIndex(index) {
        return index + 1;
    }

    _isTabSelected(index, selected) {
        return (selected === index);
    }

    _text(item) {
        return item.name || String(item);
    }

    _makeNextVisibleTabBeSelected(index) {
        var itemsLength = this.items.length;

        for (var i = 0; i < itemsLength; i++) {
            index = (index + 1) % itemsLength;

            if (!(this.items[index].visible === false)) {
                this.selected = index;
                break;
            }
        }

        if (i === itemsLength) {
            // visible tab was not found
            this._set_noVisibleTabs(true);
            this.selected = -1; // don't show any tab page as well
        }
    }

    _visible(item, index) {
        let tabIsVisible = !(item.visible === false);

        if (!tabIsVisible && this.selected === index) {
            this._makeNextVisibleTabBeSelected(index);
        } else if (tabIsVisible && this._noVisibleTabs) {
            this._set_noVisibleTabs(false);
            this.selected = index;
        }

        return tabIsVisible;
    }

    _heightUpdated(height) {
        if (height && height > 0) {
            this.$.pages.classList.add('fixed');
            this.$.pages.style.height = height + 'px';
        } else {
            this.$.pages.classList.remove('fixed');
            this.$.pages.style.height = null;
        }
    }

    _disabled(newValue) {
        for (let i = 0; i < this.items.length; i++) {
            this.set('items.' + i + '.disabled', newValue);
        }
    }

    _selectedTabValue(value) {
        this.selected = this._findSelectedIndex('value', value);
    }

    _selectedTabName(name) {
        this.selected = this._findSelectedIndex('name', name);
    }

    _findSelectedIndex(key, val) {
        var selectedIndex = -1;

        if (this.items.length > 0) {
            this.items.map((item, index) => {
                if (item[key] === val) {
                    selectedIndex = index;
                }
            });
        }
        return selectedIndex;
    }

    _selectTab(selected, prevSelected) {
        if (selected === prevSelected) {
            return;
        }

        if (0 <= selected && selected < this.items.length) {
            this.selectedTabName = this.items[selected].name;
            this.selectedTabValue = this.items[selected].value;
        }
    }

    _or(a, b) {
        return a || b;
    }

    /**
 * one-based index for the default tab selection. when modified - it also updates current tab selection
 */
    _defaultTabNumber(newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }

        this.selected = newValue - 1;
    }

    _items(items) {
        if (items && items.length) {
            if (this.selected > items.length - 1) {
                this.selected = items.length - 1;
            }
            this._selectTab(this.selected);
        }
    }
};

customElements.define(PTCS.TabSet.is, PTCS.TabSet);

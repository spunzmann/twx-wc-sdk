import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import 'ptcs-hbar/ptcs-hbar.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-list/ptcs-list.js';
import 'ptcs-icon/ptcs-icon.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';

PTCS.Dropdown = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)), ['open', 'closed']))) {
    static get template() {
        return html`
    <style>
      :host {
        display: inline-flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
      }

      :host([value-hide]) {
          width: auto;
      }

      [part=label] {
        flex: 0 0 auto;

        flex-shrink: 0;
      }

      [part=label][hidden] {
        display: none;
      }

      [part=select-box] {
        flex-grow: 1;
        box-sizing: border-box;
      }

      /* #select[part~=select-box] - added specifity for IE/Edge to be stronger than theme styling */
      :host([display-mode=small]) #select[part~=select-box] {
        min-height: unset;
        padding: 8px;
        border-style: hidden;
        background-color: transparent;
      }

      :host(:not([label=""])) [part="label"] {
        display: block;
        padding-bottom: 4px;
      }

      /* value element */
      ptcs-list-item[part=list-item] {
        height: 100%;
        width: calc(100% - 18px);
      }

      [part=item-value] {
        grid-row: 1;
        grid-column: 2;
        -ms-grid-row: 1;
        -ms-grid-column: 2;
        align-self: center;
        overflow: hidden;
        max-width: 100%;
      }

      ptcs-label[variant=list-item] {
        max-width: 100%;
      }

      :host([alignment=left]) [part=item-value] {
        justify-self: start;
      }
      :host([alignment=center]) [part=item-value] {
        justify-self: center;
      }
      :host([alignment=right]) [part=item-value] {
        justify-self: end;
      }

      /* value first child - responsible for alignment */
      div[part=list-item] {
        max-width: 100%;
        height: 100%;
        display: flex;

        justify-content: flex-start; /* flex-start / center / flex-end */
        align-items: center; /* vertical alignment */
      }

      .img-dropdown {
        max-width: 100%;
      }

      /* CSS selector for ptcs-tabs dropdown implementation */
      ptcs-list-item[hidden]{
        display: none;
      }

      ptcs-list-item {
        display: grid;
        display: -ms-grid;

        grid-template-columns: auto minmax(0, 1fr);
        grid-template-rows: 1fr auto;

        -ms-grid-columns: auto 1fr;
        -ms-grid-rows: 1fr auto;

        overflow: hidden;
      }

      /* For IE and Edge that don't support align-self: center; or justify-self */
      .center-item-value {
        grid-column: 2;
        grid-row: 1;
        -ms-grid-column: 2;
        -ms-grid-row: 1;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
      }
      :host([alignment=left]) .center-item-value {
        -ms-grid-column-align: start;
      }
      :host([alignment=center]) .center-item-value {
        -ms-grid-column-align: center;
      }
      :host([alignment=right]) .center-item-value {
        -ms-grid-column-align: end;
      }

    </style>

    <ptcs-label id="label" part="label" label="[[label]]" hidden\$="[[_hide_label(label)]]"
	multi-line="" horizontal-alignment="[[labelAlignment]]" disable-tooltip></ptcs-label>

    <ptcs-hbar id="select" part="select-box" stretch="" display-mode\$="[[displayMode]]">
      <ptcs-list-item part="list-item" disabled="[[disabled]]" partmap="* list-item-*"
	  label="[[_value]]" item-meta="[[itemMeta]]" alignment="[[alignment]]" hint="[[hintText]]" hidden$="[[valueHide]]"></ptcs-list-item>
    </ptcs-hbar>

    <ptcs-list part="list" partmap="* list-*" items="[[items]]" disabled="[[disabled]]"
	multi-select="[[multiSelect]]" selected="{{selected}}" selected-indexes="{{selectedIndexes}}" selected-items={{selectedItems}}
	selected-value="{{selectedValue}}" selector="[[selector]]" value-selector="[[valueSelector]]"
	state-selector="[[stateSelector]]" treat-value-as-string="[[treatValueAsString]]" meta-selector="[[metaSelector]]"
	alignment="[[alignment]]" auto-select-first-row="[[autoSelectFirstRow]]" initial-count="[[initialCount]]"
    row-height="[[rowHeight]]" allow-no-item-selection="[[clearSelectionItem]]"
    filter="[[filter]]" hint-text="[[filterHintText]]" tabindex\$="[[tabindex]]"
    clear-selection-label="[[clearSelectionLabel]]" item-meta="[[itemMeta]]"
    select-all-label="[[selectAllLabel]]" clear-selected-items-label="[[clearSelectedItemsLabel]]">
    </ptcs-list>`;
    }

    constructor() {
        super();
        this.maxListWidth = 330;
        this.topMarginList = 8;
    }

    static get is() {
        return 'ptcs-dropdown';
    }

    static get properties() {
        return {
            displayMode: {
                type:     String,
                value:    'default',
                observer: '_displayModeChanged'
            },

            items: {
                type:  Array,
                value: () => []
            },

            selectedItems: {
                type:   Array,
                value:  () => [],
                notify: true
            },

            hintText: {
                type:               String,
                value:              '',
                reflectToAttribute: true
            },

            // Should the 'filter' option of the list be activated?
            filter: {
                value: false
            },

            // Hint text of the *filter* (the dropdown has a separate one)
            filterHintText: {
                type:  String,
                value: 'Filter'
            },

            clearSelectionLabel: {
                type:               String,
                value:              '',
                reflectToAttribute: true
            },

            clearSelectionItem: {
                type:  Boolean,
                value: false
            },

            itemMeta: {
                type:  Object,
                value: {type: 'text'}
            },

            _itemType: {
                type:     String,
                computed: '_computeItemType(itemMeta.type, selectedIndexes.length)'
            },

            initialCount: {
                type: Number
            },

            _value: {
                type:     String,
                computed: '_computeValue(hintText, selectedIndexes.length, selectedIndexes.0)',
                notify:   true
            },

            _list: {
                type: Object
            },

            _listBody: {
                type: Object
            },

            _listId: {
                type: String
            },

            label: {
                type:               String,
                value:              '',
                reflectToAttribute: true,
                defaultValue:       ''
            },

            labelAlignment: { // 'left', 'center', 'right'
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            alignment: { // 'left', 'center', 'right'
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            valueHide: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true,
                observer:           '_reflect_disabled_to_small_button'
            },

            mode: { // "closed", "open"
                type:     String,
                value:    'closed',
                observer: '_mode'
            },

            multiSelect: {
                type:  Boolean, // undefined, "single", "multiple"
                value: false
            },

            selectedIndexes: {
                type:   Array,
                notify: true,
                value:  () => []
            },

            selected: {
                type:   Number,
                notify: true
            },

            selectedValue: {
                type:   String,
                notify: true
            },

            selector: {
                value: null
            },

            valueSelector: {
                value: null
            },

            stateSelector: {
                value: null
            },

            treatValueAsString: {
                type:  Boolean,
                value: true
            },

            metaSelector: {
                value: null
            },

            autoSelectFirstRow: {
                type:  Boolean,
                value: false
            },

            reDrawList: {
                type:  Boolean,
                value: false
            },

            rowHeight: {
                type:  String,
                value: '34'
            },

            maxListHeight: {
                type: Number
            },

            selectAllLabel: {
                type:  String,
                value: 'Select All'
            },

            clearSelectedItemsLabel: {
                type:  String,
                value: 'Clear Selected Items'
            },

            allLabel: {
                type:  String,
                value: 'All'
            },

            selectedLabel: {
                type:  String,
                value: 'Selected'
            }
        };
    }

    static get observers() {
        return [
            '_recompute_dimension(items.splices)',
            '_updateSelectedStateForSmallButton(displayMode, mode)'
        ];
    }

    ready() {
        super.ready();
        this.addEventListener('click', () => this._onClick());
        this.tooltipFunc = this._monitorTooltip.bind(this);
        this._trackFocus(this, this.$.select);
        this.addEventListener('keydown', ev => {
            switch (ev.key) {
                case ' ':
                case 'ArrowDown':
                case 'Enter':
                    this.click();
                    ev.preventDefault();
            }
        });
    }

    disconnectedCallback() {
        // Remove the dropdown list
        if (!this.reDrawList) {
            document.body.removeChild(this._list);
            this.reDrawList = true;
        }
        super.disconnectedCallback();
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.reDrawList) {
            document.body.appendChild(this._list);
            this.reDrawList = false;
        }
    }

    _displayModeChanged(displayMode) {
        let el = this.shadowRoot.getElementById('icon');
        if (el) {
            this.$.select.removeChild(el);
        }

        if (displayMode === 'small') {
            el = document.createElement('ptcs-button');
            el.setAttribute('mode', 'icon');
            el.setAttribute('icon', 'chevron-right');
            el.setAttribute('variant', 'small');
        } else {
            // 'default'
            el = document.createElement('ptcs-icon');
            el.setAttribute('icon', 'chevron-right');
        }

        el.setAttribute('part', 'icon');
        el.setAttribute('partmap', '* icon-*');
        el.setAttribute('id', 'icon');

        this.$.select.appendChild(el);

        switch (el.tagName) {
            case 'PTCS-BUTTON': el.shadowRoot.querySelector('ptcs-icon').style.transform = 'rotate(90deg)'; break;
            case 'PTCS-ICON': el.style.transform = 'rotate(90deg)'; break;
        }
    }

    _reflect_disabled_to_small_button(disabled) {
        let el = this.shadowRoot.getElementById('icon');
        if (el) {
            el.disabled = disabled;
        }
    }

    _updateSelectedStateForSmallButton(displayMode, mode) {
        let el = this.shadowRoot.getElementById('icon');

        if (!el) {
            return;
        }

        if (displayMode === 'small' && mode === 'open') {
            el.setAttribute('selected', '');
        } else {
            el.removeAttribute('selected');
        }
    }

    _computeItemType(type, selectedIndexes_length) {
        if (selectedIndexes_length !== 1) {
            return 'text';
        }

        return type;
    }

    _areStringEquals(itemType, expectedType) {
        return itemType === expectedType;
    }

    _truthy(e) {
        return e === true || e === 'true';
    }

    _computeValue(hintText, selectedIndexes_length, selectedIndexes_0) {
        if (!selectedIndexes_length) {
            // Nothing is selected
            return hintText || '';
        }
        /*eslint-disable no-nested-ternary*/
        return selectedIndexes_length === 1
            ? this._list._label(this.items[selectedIndexes_0], this.selector)
            : selectedIndexes_length !== this.items.length ? selectedIndexes_length + ' ' + this.selectedLabel
                : this.allLabel + ' ' + this.selectedLabel;
        /*eslint-enable no-nested-ternary*/
    }

    _hide_label(label) {
        return !label;
    }

    _mode(mode) {
        if (mode === 'open') {
            this.setAttribute('open', '');
            this.removeAttribute('closed');
            this._listBody.maxHeight = '';
            this._showList();
        } else {
            this.setAttribute('closed', '');
            this.removeAttribute('open');
            // Close popup - and leave
            this._initList();
        }
    }

    _getFirstSubFocusable(cntr) {
        for (let el = cntr.firstChild; el; el = el.nextSibling) {
            if (el.tabIndex >= 0) {
                const br = el.getBoundingClientRect();
                if (br.width || br.height) {
                    return el;
                }
            }
            let el2 = this._getFirstSubFocusable(el);
            if (el2) {
                return el2;
            }
        }
        return null;
    }


    _showList() {
        // Default list dimensions according to visual design - width: 330px, height: 571px
        // The max-height depends on if the list shows a filter and/or a multi-select
        // select-all option. A proper support for that would be complex. Subtracting 34px
        // for each such option is _hopefully_ a acceptable fallback for now. Subtracting
        // 24px from max-with is mainly for handling scrollbars
        const _list = this._list;
        const box = this.$.select.getBoundingClientRect();
        const above = box.top;
        const below = window.innerHeight - box.bottom;
        const extra = 4 + this.topMarginList + (_list.multiSelect ? 34 : 0) + (_list.filter && !_list.hideFilter ? 34 : 0);
        const maxHeight = Math.min(Math.max(above, below) - extra, this.maxListHeight > 0 ? this.maxListHeight : 571);
        const maxWidth = Math.min(window.innerWidth - 24, Math.max(330, box.width));

        this._listBody.style.maxHeight = `${maxHeight}px`;

        _list.style.maxWidth = `${maxWidth}px`;
        _list.style.minWidth = `${Math.min(maxWidth, this.offsetWidth)}px`;
        _list.style.visibility = 'hidden'; // prevent list from displaying before it's ready
        _list.style.display = 'block'; // replace 'none' by 'block' - it becomes all dimensions to be normal
        _list.style.width = '';

        // Need to wait a few animation frames for the list to stabilize (100ms ~ 6 animation frames)
        setTimeout(() => {
            this._list.style.visibility = ''; // show list in proper place

            const dim = this._get_dimension();
            this._set_list_position(dim); // set list position

            if (this.mode === 'open') {
                if (!this._close_ev) {
                    // Close the dropdown if the user clicks anywhere outside of it
                    this._close_ev = () => {
                        if (document.activeElement === this._list) {
                            this.focus();
                        }
                        this.mode = 'closed';
                    };
                    window.addEventListener('resize', this._close_ev);
                    document.addEventListener('mousedown', this._close_ev);
                }
                if (!this._keydown_ev) {
                    // Close the dropdown if the user presses TAB, ENTER or ESC
                    this._keydown_ev = ev => {
                        switch (ev.key) {
                            case 'Enter':
                            case 'Escape':
                                ev.preventDefault();
                                this.mode = 'closed';
                                this.focus();
                                break;
                            case 'Tab': {
                                const root = this._list.shadowRoot;
                                const elem = ev.shiftKey
                                    ? this._getFirstSubFocusable(root)
                                    : root.querySelector('[part=list-items-container]');
                                if (root.activeElement === elem) {
                                    this.mode = 'closed';
                                    this.focus();
                                    ev.preventDefault();
                                }
                            }
                        }
                    };

                    this._list.addEventListener('keydown', this._keydown_ev);
                }
                // Close single selection lists if user makes a selection
                if (!this._list.multiSelect && !this._singleSelect_ev) {
                    this._singleSelect_ev = () => {
                        this.mode = 'closed';
                        this.focus();
                    };
                    this._list.addEventListener('selected-changed', this._singleSelect_ev);
                }

                if (this.selected >= 0) {
                    this._list.scrollToIndex(this.selected);
                }

                this._list.focus();
            }

            // Keep track of list position
            this.track_position(dim);
        }, 100);
    }

    _initList() {
        if (!this._list) {
            var list = this.shadowRoot.querySelector('ptcs-list');
            this._list = document.body.appendChild(list);
            // It is a bit smelly to access internal parts in ptcs-list, but ...
            this._listBody = this._list.shadowRoot.querySelector('[part=list-items-container]');
            console.assert(this._listBody);
        }

        if (this._close_ev) {
            document.removeEventListener('mousedown', this._close_ev);
            window.removeEventListener('resize', this._close_ev);
            this._close_ev = null;
        }
        if (this._keydown_ev) {
            this._list.removeEventListener('keydown', this._keydown_ev);
            this._keydown_ev = null;
        }
        if (this._singleSelect_ev) {
            this._list.removeEventListener('selected-changed', this._singleSelect_ev);
            this._singleSelect_ev = null;
        }

        this._list.style.display = 'none';
        this._list.style.width = '';
        this._list.style.top = '';
        this._list.style.left = '';
    }

    _createDropDownList() {

        this._initList();

        this.setExternalComponentId();

        // update css rules of the list
        this._list.style.position = 'absolute';
        this._list.style.zIndex = '99996';
        this._list.style.boxSizing = 'border-box';
        this._list.style.cursor = 'pointer';

        // add 2 css rules for just created list. put these rules as a first <style> child so later added rules were able
        // to override them
        let style = document.createElement('style');
        style.appendChild(document.createTextNode('[part=list-container] { background: #ffffff; box-sizing: border-box; '));
        style.appendChild(document.createTextNode('[part=list-item] { box-sizing: border-box; padding-left: 8px; padding-right: 8px; }'));
        this._list.shadowRoot.insertBefore(style, this._list.shadowRoot.firstChild);

        let filterElt = this._list.shadowRoot.querySelector('[part=filter]');

        if (filterElt) {
            filterElt.addEventListener('click', (e) => {
                e.cancelBubble = true;
            });
        }

        this._list.addEventListener('click', (e) => {
            if (!this.multiSelect) {
                this.mode = 'closed';
            }
        });

        this._list.addEventListener('mousedown', (e) => {
            e.cancelBubble = true;
        });
    }

    _recompute_dimension() {
        // create list only once
        if (!this._list) {
            this._createDropDownList();
        }
    }

    _get_dimension() {
        return {
            // Get window dimension
            windowWidth:  window.innerWidth,
            windowHeight: window.innerHeight,
            // Get current scroll offset
            scrollDx:     document.documentElement.scrollLeft + document.body.scrollLeft,
            scrollDy:     document.documentElement.scrollTop + document.body.scrollTop,
            // Where is the dropdown box?
            box:          this.$.select.getBoundingClientRect()
        };
    }

    _diff_dimension(r1, r2) {
        if (r1.windowWidth !== r2.windowWidth || r1.windowHeight !== r2.windowHeight) {
            return true;
        }
        if (r1.scrollDx !== r2.scrollDx || r1.scrollDy !== r2.scrollDy) {
            return true;
        }
        if (r1.box.width !== r2.box.width || r1.box.bottom !== r2.box.bottom || r1.box.left !== r2.box.left) {
            return true;
        }

        return false;
    }

    _set_list_position(r) {
        const dw = (!this._list.style.width && PTCS.isFirefox) ? PTCS.getVerticalScrollbarWidth(this._listBody) : 0;
        const bbList = this._list.getBoundingClientRect();
        const smallModeAllignemt = this.displayMode === 'small' ? 8 : 0;
        let x;
        if (r.windowWidth - r.box.left - bbList.width > 0) {
            x = r.box.left;
        } else if (r.windowWidth > r.box.right && r.box.right - smallModeAllignemt - bbList.width > 0) {
            x = r.box.right - smallModeAllignemt - bbList.width;
        } else if (r.windowWidth - bbList.width - dw - 24 > 0) {
            x = r.windowWidth - bbList.width - dw - 24;
        } else {
            x = 2;
        }
        let y = r.box.bottom + this.topMarginList;
        if (y + bbList.height >= r.windowHeight) {
            // Show popup list above dropdown instead
            y = Math.max(r.box.top - this.topMarginList - bbList.height, 2);
        }

        // Set list position
        this._list.style.left = `${r.scrollDx + x}px`;
        this._list.style.top = `${r.scrollDy + y}px`;

        // Freeze list width?
        if (!this._list.style.width) {
            // adding 0.1px, fixing minor delta calculation between list and v-scroller
            this._list.style.width = `${bbList.width + dw + 0.1}px`;
        }
    }

    _isHidden() {
        return !(this.offsetWidth || this.offsetHeight || this.getClientRects().length);
    }

    // Keep track of list position, if the droplist box is moved or the view is scrolled
    track_position(rOld) {
        if (this.mode === 'open') {
            if (this._isHidden()) {
                this.mode = 'closed';
            } else {
                const rNew = this._get_dimension();
                if (this._diff_dimension(rOld, rNew)) {
                    if (rNew.box.bottom < 0 || rNew.box.top > rNew.windowHeight) {
                        // The dropdown anchor has been scrolled out of sight. Close the popup
                        this.mode = 'closed';
                        return;
                    }
                    this._set_list_position(rNew);
                }

                // Take a fresh look at things in 0.2 seconds
                setTimeout(() => this.track_position(rNew), 200);
            }
        }
    }

    _onClick() {
        if (this.disabled || !this.items || this.items.length === 0) {
            return;
        }

        this.mode = (this.mode === 'open' ? 'closed' : 'open');
    }

    _monitorTooltip() { // Implements ptcs-dropdown's tooltip behavior on label truncation
        const el = this.shadowRoot.querySelector('[part=item-value]').querySelector('ptcs-label');
        if (el && el.isTruncated()) { // Truncated label to be used as tooltip?
            return el.label;
        }
        return ''; // No label truncation
    }

    getExternalComponentId() {
        return this._listId;
    }

    /*
     * Sets an id for external component
     */
    setExternalComponentId(id) {
        if (id) {
            this._listId = id;
        } else if (!this._listId) {
            this._listId = 'ptcs-dropdown-list-' + performance.now().toString().replace('.', '');
        }

        this._list.setAttribute('id', this._listId);
    }
};

customElements.define(PTCS.Dropdown.is, PTCS.Dropdown);

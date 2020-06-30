import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-list/ptcs-list.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-button/ptcs-button.js';


PTCS.ListShuttle = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {
    static get template() {
        return html`
        <style>
            :host {
                position: relative;
                width: 100%;
                height: 100%;
                box-sizing: border-box;

                display: inline-flex;
                justify-content: space-between;
                align-items: stretch;
            }

            #root {
                flex: 1 1 auto;

                display: grid;
                display: -ms-grid;
            }

            :host(:not([vertical])) #root {
                grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                grid-template-rows: auto minmax(0, 1fr) 50px auto;

                -ms-grid-columns: 1fr 1fr;
                -ms-grid-rows: auto 1fr 50px auto;
            }

            :host([vertical]) #root {
                grid-template-columns: minmax(0, 1fr);
                grid-template-rows: auto minmax(0, 1fr) auto minmax(0, 1fr) auto;

                -ms-grid-columns: 1fr;
                -ms-grid-rows: auto 1fr auto 1fr auto;
            }

            :host(:not([vertical])) [part~=head] {
                grid-column: 1 / 3;
                grid-row: 1;

                -ms-grid-column: 1;
                -ms-grid-column-span: 2;
                -ms-grid-row: 1;
            }

            :host([vertical]) [part~=head] {
                grid-column: 1;
                grid-row: 1;

                -ms-grid-column: 1;
                -ms-grid-row: 1;
            }

            :host(:not([vertical])) [part~=source-list-container] {
                grid-column: 1;
                grid-row: 2 / 4;

                -ms-grid-column: 1;
                -ms-grid-row: 2;
                -ms-grid-row-span: 2;
            }

            :host([vertical]) [part~=source-list-container] {
                grid-column: 1;
                grid-row: 2;

                -ms-grid-column: 1;
                -ms-grid-row: 2;
            }

            :host(:not([vertical])) [part~=target-list-container] {
                grid-column: 2;
                grid-row: 2;

                -ms-grid-column: 2;
                -ms-grid-row: 2;
            }

            :host([vertical]) [part~=target-list-container] {
                grid-column: 1;
                grid-row: 4;

                -ms-grid-column: 1;
                -ms-grid-row: 4;
            }

            :host(:not([vertical])) [part~=source-buttons] {
                grid-column: 1;
                grid-row: 4;

                -ms-grid-column: 1;
                -ms-grid-row: 4;
            }

            :host([vertical]) [part~=source-buttons] {
                grid-column: 1;
                grid-row: 3;

                -ms-grid-column: 1;
                -ms-grid-row: 3;
            }

            :host(:not([vertical])) [part~=target-buttons] {
                grid-column: 2;
                grid-row: 3 / 5;

                -ms-grid-column: 2;
                -ms-grid-row: 3;
                -ms-grid-row-span: 2;
            }

            :host([vertical]) [part~=target-buttons] {
                grid-column: 1;
                grid-row: 5;

                -ms-grid-column: 1;
                -ms-grid-row: 5;
            }

            [part=label] {
                width: 100%;
            }

            [part~=source-list-container],
            [part~=target-list-container] {
                position: relative;
            }

            [part~=source-list],
            [part~=target-list] {
                width: 100%;
                height: 100%;
            }

            [part~=target-buttons] {
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;
            }

            [part~=move-buttons] {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
            }

            /* Below style is needed for Edge/IE. The reason is that MB adds some styles that override
             * :host { ... box-sizing: border-box ...} for ptcs-button. These MB styles are applied in Edge/IE since
             * the component is not hidden by shadow root. */
            ptcs-button[part~=button] {
                box-sizing: border-box;
            }
        </style>

        <div id="root">
        <div part="head" hidden\$="[[_isEmpty(label)]]">
            <ptcs-label part="label" label="[[label]]" multi-line
                        horizontal-alignment="[[labelAlignment]]" variant="[[labelType]]"></ptcs-label>
        </div>
        <div part="source-list-container">
            <ptcs-list id="srclist" part="source-list" label="[[sourceLabel]]"
                       label-alignment="[[sourceLabelAlignment]]" label-type="[[sourceLabelType]]"
                       items="[[items]]" selector="[[selector]]" disabled="[[disabled]]"
                       filter="[[_filter]]" filter-string="{{sourceFilter}}" hide-filter="[[hideFilter]]"
                       multi-select="[[!singleSelect]]" on-selected-indexes-changed="_srcSelectionChanged"
                       partmap="* source-list-*" tabindex\$="[[_delegatedFocus]]"></ptcs-list>
        </div>
        <div part="source-buttons buttons">
            <ptcs-button part="add-button button" variant="primary"
                         label="[[addLabel]]" tabindex\$="[[_delegatedFocus]]"
                         disabled="[[_btnDisabled(disabled, _selectionSrc)]]" on-click="_addClick"></ptcs-button>
        </div>
        <div part="target-list-container">
            <ptcs-list id="dstlist" part="target-list" label="[[targetLabel]]"
                       label-alignment="[[targetLabelAlignment]]" label-type="[[targetLabelType]]"
                       items="[[selectedItems]]" selector="[[selector]]" disabled="[[disabled]]"
                       multi-select="[[!singleSelect]]" on-selected-indexes-changed="_dstSelectionChanged"
                       partmap="* target-list-*" tabindex\$="[[_delegatedFocus]]"></ptcs-list>
        </div>
        <div part="target-buttons buttons">
            <ptcs-button part="remove-button button" variant="primary" id="rembtn"
                         label="[[removeLabel]]" tabindex\$="[[_delegatedFocus]]"
                         disabled="[[_btnDisabled(disabled, _selectionDst)]]" on-click="_removeClick"></ptcs-button>
            <div part="move-buttons">
            <ptcs-button part="up-button button" variant="tertiary" id="upbtn"
                         label="[[labelUp]]" icon="page:move-item-up" tabindex\$="[[_delegatedFocus]]"
                         disabled="[[_btnDisabled(disabled, _canMoveUp)]]" on-click="_upClick"></ptcs-button>
            <ptcs-button part="down-button button" variant="tertiary" id="dnbtn"
                         label="[[labelDown]]" icon="page:move-item-down" tabindex\$="[[_delegatedFocus]]"
                         disabled="[[_btnDisabled(disabled, _canMoveDn)]]" on-click="_downClick"></ptcs-button>
            <div>
        </div>
    </div>`;
    }

    static get is() {
        return 'ptcs-list-shuttle';
    }

    static get properties() {
        return {
            disabled: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // Select value from item[]
            selector: {
                type: String
            },

            // List input
            items: {
                type:  Array,
                value: () => []
            },

            // List input
            selectedItems: {
                type:   Array,
                value:  () => [],
                notify: true
            },

            _defaultselectedItems: {
                type:  Array,
                value: () => []
            },

            _old: {
                type: Object
            },

            // Map: label => item[index]
            _label2item: {
                type:  Object,
                value: () => {}
            },

            singleSelect: {
                type:  Boolean,
                value: false
            },

            _selectionSrc: {
                type: Boolean
            },

            _selectionDst: {
                type: Boolean
            },

            _canMoveUp: {
                type:  Boolean,
                value: false
            },

            _canMoveDn: {
                type:  Boolean,
                value: false
            },

            hideFilter: {
                type: Boolean
            },

            _filterSet: {
                type:  Set,
                value: () => new Set()
            },

            _filter: {
                type:     Function,
                computed: '_computeFilter(hideFilter, _filterSet)'
            },

            sourceFilter: {
                type:   String,
                value:  '',
                notify: true
            },

            _resizeObserver: {
                type: ResizeObserver
            },

            vertical: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // Labels
            label: {
                type:  String,
                value: ''
            },

            labelType: {
                type:  String,
                value: 'sub-header'
            },

            labelAlignment: {
                type:  String,
                value: 'left'
            },

            sourceLabel: {
                type:  String,
                value: 'Source'
            },

            sourceLabelType: {
                type:  String,
                value: 'label'
            },

            sourceLabelAlignment: {
                type:  String,
                value: 'left'
            },

            targetLabel: {
                type:  String,
                value: 'Target'
            },

            targetLabelType: {
                type:  String,
                value: 'label'
            },

            targetLabelAlignment: {
                type:  String,
                value: 'left'
            },

            addLabel: {
                type:  String,
                value: 'Add'
            },

            removeLabel: {
                type:     String,
                value:    'Remove',
                observer: '_alignButtons'
            },

            labelUp: {
                type:     String,
                value:    'Up',
                observer: '_alignButtons'
            },

            labelDown: {
                type:     String,
                value:    'Down',
                observer: '_alignButtons'
            },

            collapsedBtns: {
                type:               Boolean,
                reflectToAttribute: true
            },

            _delegatedFocus: {
                type:  String,
                value: null
            }
        };
    }

    static get observers() {
        return ['_itemsChanged(items, selectedItems, selector)'];
    }

    ready() {
        super.ready();
        this._resizeObserver = new ResizeObserver(entries => {
            const bw = Number(ShadyCSS.getComputedStyleValue(this, '--ptcs-list-shuttle--break-width') || 530);
            const w = entries[0].contentRect.width;
            if (w > 0) {
                this.vertical = (w + 2) < bw;
            }
            this._alignButtons();
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

    _btnDisabled(disabled, canDoAction) {
        return disabled || !canDoAction;
    }

    _isEmpty(label) {
        if (!label || label === '') {
            return true;
        }

        return false;
    }

    _computeFilter(hideFilter, _filterSet) {
        if (hideFilter) {
            return () => {
                return (item, index) => !_filterSet.has(this.items[index]);
            };
        }
        // eslint-disable-next-line no-unused-vars
        return (filterString, filterFunc) => {
            return (item, index) => !_filterSet.has(this.items[index]) && filterFunc(item, index);
        };

    }


    // Algoritm:
    // - replace all items in selectedItems with the item in items that have the same label
    // - if an item doesn't exist, unmap it from selectedItems, but put it back again next time,
    // - in case the item has been added to items (a changed selectItems can come before a changed items)
    _itemsChanged(items, selectedItems, selector) {
        if (!(items instanceof Array)) {
            return;
        }
        if (!(selectedItems instanceof Array)) {
            return;
        }

        if (selectedItems === items) {
            // Both lists point at the same physical array---make a copy to prevent the data in 'items'
            // from changing as well when we start manipulating the selectedItems...
            selectedItems = this.selectedItems = PTCS.clone(selectedItems);
        }

        // Add items that was unmapped in a prior call
        if (this._old && this._old.selectedItems === selectedItems && this._old._unmapped.length) {
            this._old._unmapped.forEach(x => this.splice('selectedItems', x.index, 0, x.item));
        }
        this._old = {selectedItems, _unmapped: []};

        if (this._defaultselectedItems !== selectedItems) {
            this._defaultselectedItems = selectedItems.slice(0);
        }

        if (selectedItems.length === 0 && this._filterSet.size === 0) {
            return;
        }

        if (!selector) {
            return;
        }

        const getLabel = PTCS.makeSelector(selector);

        // Recompute labels?
        if (this._old.items !== items) {
            this._old.items = items;
            this._label2item = {};
            items.forEach(item => {
                this._label2item[getLabel(item)] = item;
            });
        }

        // Map objects in this.selectedItmns to objects in this.items
        this._filterSet = new Set();

        const remap = [];
        const unmap = [];
        selectedItems.forEach((item, index) => {
            const itemSrc = this._label2item[getLabel(item)];
            if (itemSrc !== item) {
                if (itemSrc) {
                    remap.unshift({index, itemSrc});
                    this._filterSet.add(itemSrc);
                } else {
                    console.warn('Unkown item in selectedItems: ' + getLabel(item));
                    unmap.unshift(index);
                    this._old._unmapped.push({item, index});
                }
            } else {
                this._filterSet.add(item);
            }
        });
        remap.forEach(x => this.splice('selectedItems', x.index, 1, x.itemSrc));
        unmap.forEach(i => this.splice('selectedItems', i, 1));

        this.$.srclist.reFilter();
    }

    _addClick() {
        const a = [];
        this.$.srclist.selectedIndexes.sort((x, y) => {
            return x < y ? -1 : 1;
        }).forEach(ix => {
            this._filterSet.add(this.items[ix]);
            a.push(this.items[ix]);
        });
        this.splice('selectedItems', this.selectedItems.length, 0, ...a);
        this.$.srclist._unselectAll();
        this.$.srclist.reFilter();

        if (this.singleSelect) {
            this.$.dstlist._selectItem(this.selectedItems.length - 1, true);
        }
    }

    _removeClick() {
        const si = this._dstSelectionSeg();
        const item = si.length ? this.selectedItems[si[0][0]] : null;
        for (let i = si.length - 1; i >= 0; i--) {
            const [from, to] = si[i];
            for (let j = from; j <= to; j++) {
                this._filterSet.delete(this.selectedItems[j]);
            }
            this.splice('selectedItems', from, to - from + 1);
        }
        this.$.dstlist._unselectAll();
        this.$.srclist.reFilter();
        if (this.singleSelect && item) {
            this.$.srclist._selectItem(this.$.srclist.items.findIndex(x => x === item), true);
        }
    }

    _dstSelectionSeg() {
        let r = [];
        const a = this.$.dstlist.selectedIndexes.sort((x, y) => {
            return x < y ? -1 : 1;
        });
        for (let i = 0; i < a.length;) {
            let i2 = i + 1;
            while (i2 < a.length && a[i2 - 1] + 1 === a[i2]) {
                i2++;
            }
            r.push([a[i], a[i2 - 1]]);
            i = i2;
            if (i > 100) {
                break;
            }
        }
        return r;
    }

    _upClick() {
        const si = [];
        this._dstSelectionSeg().forEach(seg => {
            if (seg[0] > 0) {
                this.splice('selectedItems', seg[0] - 1, 0, ...this.splice('selectedItems', seg[0], seg[1] - seg[0] + 1));
                for (let j = seg[0]; j <= seg[1]; j++) {
                    si.unshift(j - 1);
                }
            }
        });
        si.forEach(ix => this.$.dstlist._selectItem(ix, true, true));
    }

    _downClick() {
        const si = [];
        this._dstSelectionSeg().forEach(seg => {
            if (seg[1] < this.selectedItems.length - 1) {
                this.splice('selectedItems', seg[0] + 1, 0, ...this.splice('selectedItems', seg[0], seg[1] - seg[0] + 1));
                for (let j = seg[0]; j <= seg[1]; j++) {
                    si.unshift(j + 1);
                }
            }
        });
        si.forEach(ix => this.$.dstlist._selectItem(ix, true, true));
    }

    _srcSelectionChanged() {
        this._selectionSrc = this.$.srclist.selectedIndexes.length > 0;
    }

    _dstSelectionChanged() {
        const segList = this._dstSelectionSeg();
        this.setProperties({
            _selectionDst: this.$.dstlist.selectedIndexes.length > 0,
            _canMoveUp:    segList.find(seg => seg[0] > 0),
            _canMoveDn:    segList.find(seg => seg[1] < this.selectedItems.length - 1)
        });
    }

    _resetToDefault() {
        this.selectedItems = this._defaultselectedItems.slice(0);
    }

    // Align the the target list buttons
    _alignButtons(arg) {
        // Something may have affected the styling of the three buttons under the target list
        const e1 = this.$.rembtn;
        const e2 = this.$.upbtn;
        const e3 = this.$.dnbtn;
        if (!e1 || !e2 || !e3) {
            return;
        }

        // Reset styles
        e1.style.width = '';
        e2.style.width = '';
        e3.style.width = '';

        // Get new dimensions
        const b1 = e1.getBoundingClientRect();
        const b2 = e2.getBoundingClientRect();
        const collapsedBtns = b1.bottom < b2.top;
        const w1 = collapsedBtns ? b1.width : 0;
        const w2 = b2.width;
        const w3 = e3.getBoundingClientRect().width;
        const w = Math.max(w1, w2, w3);
        const ws = `${w}px`;

        if (collapsedBtns && w > w1) {
            e1.style.width = ws;
        }
        if (w > w2) {
            e2.style.width = ws;
        }
        if (w > w3) {
            e3.style.width = ws;
        }

        // Delay updating the state attribute until now
        this.collapsedBtns = collapsedBtns;
    }
};

customElements.define(PTCS.ListShuttle.is, PTCS.ListShuttle);

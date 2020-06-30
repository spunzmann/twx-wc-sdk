import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import {setTooltipByFocus} from 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-textfield/ptcs-textfield.js';
import 'ptcs-checkbox/ptcs-checkbox.js';
import 'ptcs-link/ptcs-link.js';
import 'ptcs-v-scroller/ptcs-v-scroller.js';
import 'ptcs-icons/page-icons.js';
import './ptcs-list-item.js';

PTCS.List = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {
    static get template() {
        return html`
        <style>
          :host {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: stretch;
            min-width: 34px;
            min-height: 34px;
            box-sizing: border-box;
            overflow: hidden;
          }

          [part=label][hidden] {
            display: none;
          }

          [part=label] {
            display: block;
            padding-bottom: 4px;
            flex-shrink: 0;
            min-height: unset;
            min-width: unset;
          }

          [part=list] {
            position: relative;
          }

          [part=item-checkbox] {
            grid-column: 1;
            grid-row: 1;
            -ms-grid-column: 1;
            -ms-grid-row: 1;

            align-self: center;
            font-size: inherit;
            min-height: unset;
          }

          [part=list-item][hidden] {
              display: none;
          }

          :host(:not([multi-select])) [part=item-checkbox] {
            display: none;
          }

          :host(:not([multi-select])) [part=multi-select] {
            display: none;
          }

          [part=multi-select][hidden] {
            display: none;
          }

          [part=multi-select] {
            display: flex;
            justify-content: space-between;
            align-items: center;

            flex: 0 0 auto;
          }

          [part=link] {
            flex: 1 1 auto;
          }

          [part=item-meta] {
            grid-column: 2;
            grid-row: 2;
            -ms-grid-column: 2;
            -ms-grid-row: 2;

            justify-content: stretch;
            align-content: center;
          }

          [part=item-meta][hidden] {
            display: none;
          }

          :host(:not([disabled])) [part=list-item]:not([disabled]):hover {
            cursor: pointer;
          }

          [part=filter] {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;

            flex: 0 0 auto;
          }

          [part=filter][hidden] {
            display: none !important;
          }

          [part=filter-field] {
            flex: 1 1 auto;
          }

          :host(:not([disabled])) [part=icon-close] {
            cursor: pointer;
          }

          [part=list-container] {
            flex: 1 1 auto;
            box-sizing: border-box;
            overflow: hidden;

            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: stretch;
          }

          [part=list-items-container] {
            flex: 1 1 auto;
            box-sizing: border-box;
          }

          /* Do not change the following selector as it could have side-effects e.g. on label of item for resetting single selection list */
          div[part=item-value] {
            grid-column: 2;
            grid-row: 1;

            -ms-grid-column: 2;
            -ms-grid-row: 1;

            display: flex;

            justify-content: flex-start;
            align-items: center;

            overflow: hidden;
          }

          [part=item-value] {
            max-width: 100%;
          }

          [part=list-item] {
            min-height: var(--ptcs-list-item--height, 34px);
            width: 100%;
            box-sizing: border-box;
          }

          ptcs-list-item {
            display: grid;
            display: -ms-grid;

            grid-template-columns: auto 1fr;
            grid-template-rows: 1fr auto;

            -ms-grid-columns: auto 1fr;
            -ms-grid-rows: 1fr auto;
          }

          /* Hide meta row? */
          ptcs-list-item[label-meta=''] {
            grid-template-rows: 1fr;
            -ms-grid-rows: 1fr;
          }

          .unselect-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            align-content: stretch;
          }

          .unselect-item > [part=item-value] {
            flex: 1 1 auto;
            position: relative;
          }

          /* For IE and Edge that don't support align-self: center; */
          .center-checkbox {
            grid-column: 1;
            grid-row: 1;
            -ms-grid-column: 1;
            -ms-grid-row: 1;

            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
          }

          .center-checkbox [part=item-checkbox] {
            width: 34px;
          }

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

          /* The border settings from the Theme Engine should only affect the list item separator */
          /* NOTE: This should have been handled by the Theme Engine, but we don't want this to show up un the Style Tab */
          [part=list-item]:first-child {
            border-top: none !important;
          }
          [part=list-item] {
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
          }
        </style>

        <ptcs-label part="label" hidden\$="[[!label]]" label="[[label]]"
                    horizontal-alignment="[[labelAlignment]]" variant="[[labelType]]"></ptcs-label>

        <div part="list-container">
          <!-- filter list -->
          <div part="filter" hidden\$="[[_filterHidden(filter, hideFilter)]]" stretch="">
              <ptcs-textfield part="filter-field" icon="page:filter" text="{{filterString}}"
              hint-text="[[hintText]]" disabled="[[disabled]]" tabindex\$="[[_delegatedFocus]]" partmap="* filter-field-*"></ptcs-textfield>
          </div>

          <!-- select all / clear selections -->
          <div part="multi-select" hidden\$="[[!_chunkerLength2]]">
            <ptcs-link part="link" variant="secondary" label="[[_multiSelectLabel(selectedIndexes.length, _chunkerLength)]]"
            disabled="[[disabled]]" on-click="_clickMultiSelect" tabindex\$="[[_delegatedFocus]]" partmap="* link-*"></ptcs-link>
          </div>

          <!-- the list items -->
          <ptcs-v-scroller part="list-items-container" id="chunker" num-items="[[_chunkerLength2]]" on-dblclick="_dblClick"
            tabindex\$="[[_delegatedFocus]]"></ptcs-v-scroller>
        </div>`;
    }

    static get is() {
        return 'ptcs-list';
    }

    static get properties() {
        return {
            label: {
                type:  String,
                value: ''
            },

            // {type: 'text' | 'image' | 'checkbox'| 'html' | 'function' }; }
            // {type: 'link', target: link @target attribute}
            // Default: {type: 'text'}
            itemMeta: {
                type: Object
            },

            labelAlignment: { // 'left', 'center', 'right'
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            labelType: { // 'header', 'sub-header', 'label', 'body'
                type:  String,
                value: 'label'
            },

            alignment: { // 'left', 'center', 'right'
                type:               String,
                value:              'left',
                reflectToAttribute: true,
                observer:           '_alignmentChanged'
            },

            // Items supplied by the client. Read-only
            items: {
                type:  Array,
                value: () => []
            },

            selectedItems: {
                type:   Array,
                value:  () => [],
                notify: true
            },

            // Array of indexes to filtered items
            _itemsIndexFiltered: {
                type:  Array,
                value: () => []
            },

            // Number of items visible in chunker
            _chunkerLength: {
                type:     Number,
                value:    0,
                observer: '_chunkerLengthChanged'
            },

            // Slowly tracks _chunkerLength, to avoid unnessecary v-scroller refreshs
            _chunkerLength2: {
                type:  Number,
                value: 0
            },

            // A Boolean (filter on/off) or a JS array filter function
            filter: {
                value: false
            },

            // Filter string entered in filter textfield
            filterString: {
                type:   String,
                value:  '',
                notify: true
            },

            // Current JS array filter function
            _filter: {
                type:     Function,
                computed: '_computeFilter(filter, filterString)',
                observer: '_filterChanged'
            },

            // Allows the filter textfield to be hidden even when there is an active filter
            hideFilter: {
                type: Boolean
            },

            // Selection
            multiSelect: {
                type:               Boolean, // undefined, "single", "multiple"
                reflectToAttribute: true,
                observer:           '_multiSelectChanged'
            },

            // Indexes of selected items
            selectedIndexes: {
                type:   Array,
                notify: true,
                value:  () => []
            },

            // Set of selected items, if multiSelect
            _selectSet: {
                type:  Set,
                value: null
            },

            // Value of selected item, if single selection mode
            selectedValue: {
                type:               String,
                reflectToAttribute: true,
                notify:             true,
                observer:           '_selectedValueChanged'
            },

            // Index of selected object, if single selection mode
            selected: {
                type:     Number,
                notify:   true,
                observer: '_selectedChanged',
                value:    -1
            },

            // _selected = +selected (=> make sure it is a number)
            _selected: {
                type: Number
            },

            // Select label from item
            selector: {
                value:    null,
                observer: '_selectorChanged'
            },

            // Select value from item (defaults to selector)
            valueSelector: {
                value: null
            },

            // Select enabled / disabled mode from item
            stateSelector: {
                value:    null,
                observer: '_stateSelectorChanged'
            },

            // Select meta label from item
            metaSelector: {
                value:    null,
                observer: '_metaSelectorChanged'
            },

            treatValueAsString: {
                type:  Boolean,
                value: true
            },

            disabled: {
                type:               Boolean,
                reflectToAttribute: true,
                observer:           '_disabledChanged'
            },

            autoSelectFirstRow: {
                type:     Boolean,
                value:    false,
                observer: '_autoSelectFirstRowChanged'
            },

            multiLine: {
                type:     Boolean,
                value:    false,
                observer: '_multiLineChanged'
            },

            rowHeight: {
                type:     String,
                value:    '34',
                observer: '_rowHeightChanged'
            },

            allowNoItemSelection: {
                type:     Boolean,
                observer: '_allowNoItemSelectionChanged'
            },

            hintText: {
                type:  String,
                value: 'Filter'
            },

            clearSelectionLabel: {
                type:     String,
                observer: '_clearSelectionLabelChanged'
            },

            selectAllLabel: {
                type:  String,
                value: 'Select All'
            },

            clearSelectedItemsLabel: {
                type:  String,
                value: 'Clear Selected Items'
            },

            _delegatedFocus: {
                type:  String,
                value: null
            }
        };
    }

    static get observers() {
        return [
            '_itemsChanged(items.*)',
            '_selectedIndexesChanged(selectedIndexes.*)',
            '_itemMetaChanged(itemMeta.*)',
            '_valueSelectorChanged(valueSelector, treatValueAsString, selector)'
        ];
    }

    constructor(...arg) {
        super(arg);
        // Default values, sometimes needed during initialization
        this._label = item => item || '';
        this._meta = () => '';
        this._value = () => undefined;
        this._disabled = () => false;
        this._hidden = () => false;
    }

    ready() {
        super.ready();
        this.$.chunker.createItemElement = (index, el) => this._createListItem(index, el);

        // Hideous - but what to do?
        this.__isReady = true;
        // Initialize now, when all pieces finally has been pulled together
        if (this.selectedValue) {
            this._selectedValueChanged(this.selectedValue);
        } else if (this.selected >= 0) {
            this._selectedChanged(this.selected);
        } else if (this.autoSelectFirstRow) {
            this._autoSelectFirstRowChanged(this.autoSelectFirstRow);
        }
    }

    isSelectedIndex(index) {
        return this._selectSet ? this._selectSet.has(this.items[index]) : index === this._selected;
    }

    isSelectedItem(item) {
        return this._selectSet ? this._selectSet.has(item) : this.items[this._selected] === item;
    }

    scrollToIndex(index) {
        if (this.__scrollActivated) {
            return;
        }
        this.__scrollActivated = true;
        requestAnimationFrame(() => {
            this.__scrollActivated = false;
            const ixView = this._itemIndexToViewIndex(index);
            if (ixView >= 0) {
                this.$.chunker.scrollTo(ixView);
            }
        });
    }

    reFilter(force) {
        if (this._filter || force) {
            this._filterChanged(this._filter);
        }
    }

    // Private functions
    _createUnselectItem(el) {
        // Create
        if (!el || !el.classList.contains('unselect-item')) {
            el = document.createElement('div');
            el.setAttribute('class', 'unselect-item');
            el.setAttribute('part', 'list-item');
            el.setAttribute('index', '-1');
            el.addEventListener('click', ev => this._clickUnselect(ev));

            const elValue = document.createElement('div');
            elValue.setAttribute('part', 'item-value');

            const elLabel = document.createElement('ptcs-label');
            elLabel.setAttribute('variant', 'list-item');
            elLabel.style.width = '100%';

            elValue.appendChild(elLabel);
            el.appendChild(elValue);

            el.tooltipFunc = () => {
                if (typeof elLabel.tooltipFunc === 'function') {
                    return elLabel.tooltipFunc();
                }

                return '';
            };

        }

        // Update
        el.firstChild.firstChild.setProperties({
            multiLine:           this.multiLine,
            label:               this.clearSelectionLabel || 'None',
            horizontalAlignment: this.alignment
        });

        return el;
    }

    _clearSelectionLabelChanged() {
        this._refreshChunker();
    }

    _createListItem(index, el) {
        if (this.allowNoItemSelection) {
            if (index === 0) {
                return this._createUnselectItem(el);
            }
            // Adjust index
            --index;
        }

        const ix = this._filter ? this._itemsIndexFiltered[index] : index;
        const item = this.items[ix];

        // Create
        if (!el || el.tagName !== 'PTCS-LIST-ITEM') {
            el = document.createElement('ptcs-list-item');
            el.setAttribute('part', 'list-item');
            el.setAttribute('partmap', '* list-item-*');
            el.addEventListener('selected-changed', ev => this._onItemSelectedChanged(el, ev.detail.value));
            el.itemMeta = this.itemMeta;
        }

        // Update
        el.setAttribute('index', ix);
        el.setProperties({
            label:       this._label(item),
            labelMeta:   this._meta(item) || false,
            selected:    this.isSelectedIndex(ix),
            disabled:    this.disabled || this._disabled(item),
            hidden:      this._hidden(item),
            multiSelect: this.multiSelect,
            multiLine:   this.multiLine,
            alignment:   this.alignment
        });

        return el;
    }

    // Translate item index to scroller index
    _itemIndexToViewIndex(index) {
        if (this._filter) {
            // Remap index to filtered list
            index = this._itemsIndexFiltered.findIndex(i => i === index);
        }
        return this.allowNoItemSelection ? 1 + index : index;
    }

    // item[index] has changed. Reflect the change in the virtual scroller
    _refreshIndex(index) {
        if (this.__refreshChunkerOn) {
            return;
        }
        const ixView = this._itemIndexToViewIndex(index);
        if (ixView >= 0) {
            this.$.chunker.refresh(ixView);
        }
    }

    // Hide filter?
    _filterHidden(filter, hideFilter) {
        // If filter is falsy, then hide the list filter field - unless filter is a string
        return (!filter && filter !== '') || hideFilter;
    }

    _itemsChanged(cr) {
        if (cr.path === 'items') {
            // A new list of items
            if (this.__isReady) {
                if (this.selectedValue && !this.multiSelect) {
                    const currentSelectedValue = this.selectedValue;
                    this.selected = -1; // reset the selected index first since the items list was changed

                    // if the new list has the same value select it again
                    this.selected = this.items.findIndex(item => this._value(item) === currentSelectedValue);

                    if (this.selected === -1) {
                        this.selectedValue = undefined;
                    }
                } else {
                    this._unselectAll();
                    this._autoSelectFirstRowChanged(this.autoSelectFirstRow);
                }
            }
        } else if (cr.path === 'items.splices') {
            // Added / removed items
            if (cr.value.indexSplices) {
                cr.value.indexSplices.forEach(item => {
                    if (item.removed && item.removed.length) {
                        this._removeItems(item.index, item.index + item.removed.length, item.removed);
                    }
                    if (item.addedCount && item.addedCount) {
                        this._insertItems(item.index, item.index + item.addedCount, item.object);
                    }
                });
            }
        } else if (cr.path !== 'items.length') {
            const m = /items\.(\d+)\..*/g.exec(cr.path);
            if (m) {
                this._refreshIndex(+m[1]);
            } else {
                return; // Ignore change
            }
        }

        this.reFilter(true);
        this._refreshChunker();
    }

    _removeItems(start, end, removedItems) {
        this._selectedWork(() => {
            const num = end - start;
            // Update selected
            let selected;
            if (this._selected < start || this._selected >= end) {
                // Re-map selected
                selected = this._selected < start ? this._selected : this._selected - num;
            } else {
                // Filter out selected
                selected = -1;
            }
            // Update _selectSet
            if (this._selectSet) {
                removedItems.forEach(item => this._selectSet.delete(item));
            }
            this.setProperties({
                selected,
                selectedValue:   selected >= 0 ? this._value(this.items[selected]) : undefined,
                // eslint-disable-next-line no-confusing-arrow
                selectedIndexes: this.selectedIndexes.filter(ix => (ix < start || ix >= end)).map(ix => (ix < start ? ix : ix - num))
            });
        });
    }

    _insertItems(start, end) {
        this._selectedWork(() => {
            const num = end - start;
            const selected = this._selected >= start ? this._selected + num : this._selected;
            this.setProperties({
                selected,
                selectedValue:   selected >= 0 ? this._value(this.items[selected]) : undefined,
                // eslint-disable-next-line no-confusing-arrow
                selectedIndexes: this.selectedIndexes.map(ix => (ix >= start ? ix + num : ix))
            });
        });
    }

    _itemMetaChanged(cr) {
        const list = this.$.chunker.querySelectorAll('ptcs-list-item');
        if (cr.path === 'itemMeta') {
            for (let i = list.length - 1; i >= 0; i--) {
                list[i].itemMeta = cr.value;
            }
        } else {
            for (let i = list.length - 1; i >= 0; i--) {
                list[i]._itemMetaChanged(cr);
            }
        }
    }

    _refreshChunker() {
        if (this.__refreshChunkerOn) {
            return;
        }
        this.__refreshChunkerOn = true;
        requestAnimationFrame(() => {
            this._selectedWork(() => this.$.chunker.refresh());
            this.__refreshChunkerOn = false;
        });
    }

    // Manipulate selection data and block all selection callbacks
    _selectedWork(doWork) {
        if (!this.__protectSelectedWork) {
            this.__protectSelectedWork = true;
            try {
                doWork();
            } catch (err) {
                console.error(err);
            } finally {
                this.__protectSelectedWork = undefined;
            }
        }
    }

    // The ptcs-list-item has changed its selection state (perhaps a user click?)
    _onItemSelectedChanged(el, selected) {
        const index = +el.getAttribute('index');
        if (this.isSelectedIndex(index) === (!!selected)) {
            return; // No change
        }

        // TODO: this will invoke _selectedIndexChanged, which will refresh the selected item.
        // However, the item already reflects the proper state, so this is a wasteful operation.
        // Managing the state change ourselves is complex, so _for now_ this is acceptable.
        if (this.multiSelect) {
            this.$.chunker.focusedItemIndex = this._itemIndexToViewIndex(index);
            if (selected) {
                this.push('selectedIndexes', index);
            } else {
                const i = this.selectedIndexes.findIndex(ix => ix === index);
                if (i >= 0) {
                    this.splice('selectedIndexes', i, 1);
                }
            }
        } else {
            this.selectedIndexes = selected ? [index] : [];
        }

        // Re-check tooltip
        // This function will almost always be caused by a user click, so we should
        // not have to worry about performance
        setTooltipByFocus(); // Clear cached entry
        setTooltipByFocus(el); // Retry with element
    }

    _selectIndex(selected) {
        // Unselect / select all affected items
        console.assert(this.__protectSelectedWork);
        const sel = this.$.chunker.querySelectorAll('ptcs-list-item[selected]');
        for (let i = sel.length - 1; i >= 0; i--) {
            const index = +sel[i].getAttribute('index');
            if (index !== selected) {
                sel[i].removeAttribute('selected');
            }
        }
        if (selected >= 0) {
            this._refreshIndex(selected);
            this.scrollToIndex(selected);
        }
    }

    _chunkerLengthChanged(_chunkerLength) {
        if (!this._waitOnChunkerLength) {
            this._waitOnChunkerLength = true;
            requestAnimationFrame(() => {
                this._waitOnChunkerLength = false;
                if (!this.allowNoItemSelection) {
                    this._chunkerLength2 = this._chunkerLength;
                } else {
                    // Add an "Unselect" item first, if there are any items to unselect
                    this._chunkerLength2 = this._chunkerLength ? 1 + this._chunkerLength : 0;
                }
            });
        }
    }

    // Someone or something changed selectedIndexes
    _selectedIndexesChanged(cr) {
        if (!this.__isReady) {
            return;
        }
        this._selectedWork(() => {
            if (cr.path === 'selectedIndexes') {
                // The whole array has been replaced
                this._reflectSelectedIndexes(cr.value);
            } else if (cr.path === 'selectedIndexes.splices') {
                // Added / removed selection indexes
                if (!this.multiSelect) {
                    this._reflectSelectedIndexes(this.selectedIndexes);
                } else if (cr.value.indexSplices) {
                    let noRefilter = !!this._filter;

                    cr.value.indexSplices.forEach(item => {
                        if (item.removed && item.removed.length) {
                            item.removed.forEach(index => {
                                this._selectSet.delete(this.items[index]);
                                this._refreshIndex(index);
                                if (noRefilter && !this._filter(this.items[index], index)) {
                                    // Unselected item doesn't match filter. Must refilter
                                    noRefilter = false;
                                }
                            });
                        }
                        if (item.addedCount && item.addedCount) {
                            for (let i = 0; i < item.addedCount; i++) {
                                const index = item.object[item.index + i];
                                this._selectSet.add(this.items[index]);
                                this._refreshIndex(index);
                            }
                        }
                    });

                    if (!noRefilter) {
                        this.reFilter();
                    }
                }
            }
        });

        // Create a new selectedItems object
        this.selectedItems = [...this.selectedIndexes].sort((a, b) => a - b).map(index => this.items[index]);
    }

    _changeSingleSelect(xsel) {
        if (this._filter && xsel >= 0 && xsel !== this._selected && !this._filter(this.items[xsel], xsel)) {
            this.reFilter();
            this._refreshChunker();
        } else {
            this._selectIndex(this._selected);
        }
    }


    _reflectSelectedIndexes(selectedIndexes) {
        // TODO: Maybe an unselected item no longer matches the filter?
        console.assert(this.__protectSelectedWork);
        if (this.multiSelect) {
            this._selectSet.clear();
            selectedIndexes.forEach(index => {
                const item = this.items[index];
                if (item) {
                    this._selectSet.add(item);
                }
            });
            this._refreshChunker();
        } else {
            const xsel = this._selected;
            if (selectedIndexes.length > 0) {
                this.setProperties({
                    selected:      selectedIndexes[0],
                    selectedValue: this._value(this.items[selectedIndexes[0]])
                });
            } else {
                this.setProperties({
                    selected:      -1,
                    selectedValue: undefined
                });
            }
            this._changeSingleSelect(xsel);
        }
    }

    // Someone or something changed selectedValue
    _selectedValueChanged(selectedValue, prevValue) {
        if (!this.__isReady || this.items.length === 0 || prevValue === selectedValue) {
            return;
        }

        this._selectedWork(() => {
            if (this.multiSelect) {
                // TODO: Maybe an unselected item no longer matches the filter?
                this._selectSet.clear();
                if (this._filter) {
                    this.selectedIndexes = this._itemsIndexFiltered.filter(index => this._value(this.items[index]) === selectedValue);
                } else {
                    const si = [];
                    this.items.forEach((item, index) => {
                        if (this._value(item) === selectedValue) {
                            si.push(index);
                        }
                    });
                    this.selectedIndexes = si;
                }
                this.selectedIndexes.forEach(index => this._selectSet.add(this.items[index]));
                this._refreshChunker();
            } else {
                const xsel = this._selected;
                const selected = this.items.findIndex(item => this._value(item) === selectedValue);
                this.setProperties({
                    selected,
                    selectedIndexes: selected >= 0 ? [selected] : []
                });
                this._changeSingleSelect(xsel);
            }
        });
    }

    // Something changed selected
    _selectedChanged(selected, old) {
        // Ugly validation of input
        switch (selected) {
            case undefined:
            case '':
            case false:
            case true:
            case null:
                this._selected = -1;
                break;

            default: {
                const _selected = +selected;
                this._selected = _selected >= 0 ? _selected : -1;
            }
        }

        if (!this.__isReady || this.items.length === 0) {
            return;
        }

        this._selectedWork(() => {
            const numSelected = this.selectedIndexes.length;
            if (this._selected >= 0) {
                const item = this.items[this._selected];
                if (this._selectSet) {
                    this._selectSet.clear();
                    this._selectSet.add(item);
                }
                this.setProperties({
                    selectedValue:   this._value(item),
                    selectedIndexes: [this._selected]
                });
                this.scrollToIndex(this._selected);
            } else {
                if (this._selectSet) {
                    this._selectSet.clear();
                }
                this.setProperties({
                    selectedValue:   undefined,
                    selectedIndexes: []
                });
            }

            if (numSelected > 1 && this.multiSelect) {
                // TODO: Any refiltering needed?
                this._refreshChunker();
            } else {
                this._refreshIndex(this._selected);
                // Unselect old?
                if (old >= 0 && old !== selected) {
                    const ix = +old;
                    if (this._filter && !this._filter(this.items[ix], ix)) {
                        this.reFilter();
                        this._refreshChunker();
                    } else {
                        this._refreshIndex(ix);
                    }
                }
            }
        });

        // Change keyboard focus indicator
        if (0 <= this._selected && this._selected < this.items.length) {
            this.$.chunker.focusedItemIndex = this._itemIndexToViewIndex(this._selected);
        }
    }

    // Public function
    _selectItem(index, selectOnly, noscroll) {
        const item = this.items[index];
        if (!item) {
            return;
        }
        const selected = this.isSelectedIndex(index);

        if (selected) {
            if (selectOnly) {
                return; // Item is already selected
            }
            // Unselect the item
            if (this.multiSelect) {
                const ix = this.selectedIndexes.findIndex(i => i === index);
                if (ix >= 0) {
                    this.splice('selectedIndexes', index, 1);
                }
            } else {
                this.selectedIndexes = [];
            }
        } else if (this.multiSelect) {
            this.push('selectedIndexes', index);
        } else {
            this.selected = index;
        }

        if (selectOnly && !selected && !noscroll) {
            this.scrollToIndex(index);
        }
    }

    _multiSelectChanged(multiSelect) {
        this._selectSet = multiSelect ? new Set() : null;

        // Transfer selected items between modes
        if (multiSelect) {
            if (this._selected >= 0) {
                this.selectedIndexes = [this._selected];
                this.reFilter();
            }
        } else if (this.selectedIndexes && this.selectedIndexes.length > 1) {
            this.selected = this.selectedIndexes[0];
            this.reFilter();
        }
        this._refreshChunker();
    }

    // Selectors: pulls information from the items
    _selectorChanged(selector) {
        let _label;

        if (!selector) {
            _label = item => item;
        } else if (typeof selector === 'string') {
            _label = item => item[selector];
        } else if (selector.constructor && selector.call && selector.apply) {
            _label = selector; // item => selector(item);
        } else {
            console.error('Invalid ptcs-list label selector', selector);
            _label = item => item;
        }

        if (!this.itemMeta || (this.itemMeta.type !== 'link' && this.itemMeta.type !== 'function')) {
            this._label = item => {
                const retLabel = item ? _label(item) : '';
                if (retLabel === undefined || retLabel === null) {
                    return '';
                }
                return typeof retLabel !== 'string' ? retLabel.toString() : retLabel;
            };
        } else {
            this._label = item => {
                const retLabel = item ? _label(item) : '';
                return (retLabel === undefined || retLabel === null) ? '' : retLabel;
            };
        }

        this._refreshChunker();
    }

    _valueSelectorChanged(valueSelector, treatValueAsString, selector) {
        // Use label selector as default
        if (!valueSelector) {
            valueSelector = selector;
        }

        // Create selector function
        let _value;
        if (!valueSelector) {
            _value = item => item;
        } else if (typeof valueSelector === 'string') {
            _value = item => item[valueSelector];
        } else if (valueSelector.constructor && valueSelector.call && valueSelector.apply) {
            _value = valueSelector;
        } else {
            console.error('Invalid ptcs-list value selector', valueSelector);
            _value = item => item; // Fallback
        }

        if (treatValueAsString) {
            this._value = item => {
                const retValue = item ? _value(item) : '';
                if (retValue === undefined || retValue === null) {
                    return '';
                }
                return typeof retValue === 'string' ? retValue : retValue.toString();
            };
        } else {
            this._value = item => {
                return item ? _value(item) : undefined;
            };
        }
    }

    _stateSelectorChanged(stateSelector) {
        if (typeof stateSelector === 'string') {
            const _checkState = (stateToCheck) => {
                return item => {
                    if (!item) {
                        return false;
                    }
                    const state = item[stateSelector];
                    if (typeof state !== 'string') {
                        return false;
                    }
                    return state.toLowerCase() === stateToCheck;
                };
            };

            this._disabled = _checkState('disabled');
            this._hidden = _checkState('hidden');

        } else if (typeof stateSelector === 'function') {
            const _checkState = (stateToCheck) => {
                return item => {
                    if (!item) {
                        return false;
                    }
                    const state = stateSelector(item);
                    if (typeof state !== 'string') {
                        return false;
                    }
                    return state.toLowerCase() === stateToCheck;
                };
            };

            this._disabled = _checkState('disabled');
            this._hidden = _checkState('hidden');
        } else {
            this._disabled = () => false;
            this._hidden = () => false;
        }

        this._refreshChunker();
    }

    _metaSelectorChanged(metaSelector) {
        if (!metaSelector) {
            this._meta = () => '';
        } else {
            let _meta;
            if (typeof metaSelector === 'string') {
                _meta = item => item[metaSelector];
            } else if (metaSelector.constructor && metaSelector.call && metaSelector.apply) {
                _meta = metaSelector; // item => metaSelector(item);
            } else {
                console.error('Invalid ptcs-list metaSelector', metaSelector);
                _meta = () => '';
            }

            this._meta = item => {
                const retMeta = item ? _meta(item) : '';
                if (retMeta === undefined || retMeta === null) {
                    return '';
                }

                return typeof retMeta !== 'string' ? retMeta.toString() : retMeta;
            };
        }

        this._refreshChunker();
    }


    // Filtering
    _computeFilter(filter, filterString) {
        if (filter === undefined || filter === null || filter === 0) {
            return null;
        }
        const q = (filterString || '').replace(/\s/g, '').toLowerCase();
        if (!q) {
            return filter.constructor && filter.call && filter.apply ? filter(filterString, () => true) : null;
        }
        const f = item => this._filterMatch(item, q);

        return filter.constructor && filter.call && filter.apply ? filter(filterString, f) : f;
    }

    _filterMatch(item, fs) {
        if (this.isSelectedItem(item)) {
            return true;
        }

        const label = this._label(item);
        if (typeof label === 'string' && label.replace(/\s/g, '').toLowerCase().indexOf(fs) >= 0) {
            return true;
        }

        const meta = this._meta(item);
        if (typeof meta === 'string' && meta.replace(/\s/g, '').toLowerCase().indexOf(fs) >= 0) {
            return true;
        }

        return false;
    }

    _filterChanged(_filter) {
        if (_filter) {
            // Collect indexes to filtered items
            const filtered = [];
            for (let n = this.items.length, i = 0; i < n; i++) {
                if (_filter(this.items[i], i)) {
                    filtered.push(i);
                }
            }
            this._itemsIndexFiltered = filtered;
            this._chunkerLength = filtered.length;
        } else {
            this._chunkerLength = this.items.length;
            this._itemsIndexFiltered = [];
        }
        this._refreshChunker();
    }

    _rowHeightChanged(rowHeight) {
        const m = /^ *([0-9]+\.?[0-9]*)([a-zA-Z]*) *$/g.exec(rowHeight || '');

        if (!m) {
            this.updateStyles({'--ptcs-list-item--height': '34px'});
        } else {
            this.updateStyles({'--ptcs-list-item--height': m[1] + (m[2] || 'px')});
        }
    }

    _multiSelectLabel(numSel, numAll) {
        // Anything to select or unselect?
        if (!numAll) {
            return '';
        }

        // Only search list if anything is selected
        return numSel
            ? this.clearSelectedItemsLabel // At least one item is selected
            : this.selectAllLabel; // No displayed items are selected
    }

    _clickMultiSelect() {
        if (this.disabled || !this.items.length) {
            return;
        }
        if (this.selectedIndexes.length) {
            this._unselectAll();
        } else {
            this._selectAll();
        }

    }

    _clickUnselect() {
        if (this.disabled) {
            return;
        }
        this._unselectAll();
    }

    _selIx(ev, cb) {
        for (let el = ev.srcElement; el; el = el.parentNode) {
            const ix = el.getAttribute ? el.getAttribute('index') : null;

            if (ix) {
                const m = / *(-?[0-9]+) */g.exec(ix);

                if (m) {
                    cb(el, Number(m[1]));
                    break;
                }
            }
        }
    }

    _dblClick(ev) {
        if (this.disabled) {
            return;
        }

        this._selIx(ev, (el, ix) => {
            if (ix >= 0) {
                this.dispatchEvent(new CustomEvent('DoubleClicked', {
                    bubbles:  true,
                    composed: true,
                    detail:   {key: ix}
                }));
            }
        });
    }

    _unselectAll() {
        if (!this.selectedIndexes || this.selectedIndexes.length === 0) {
            // No selections
            return; // Important: don't touch selectedIndexes if it has not been initialized
        }

        this.selectedIndexes = [];
    }

    _selectAll() {
        if (this.items.length === 0 || !this.multiSelect) {
            return; // Nothing to select or invalid use
        }

        // Select all items
        this.selectedIndexes = this._filter ? this._itemsIndexFiltered.map(i => i) : this.items.map((_, index) => index);
    }

    _disabledChanged() {
        this._refreshChunker();
    }

    _multiLineChanged() {
        this._refreshChunker();
    }

    _alignmentChanged() {
        this._refreshChunker();
    }

    _allowNoItemSelectionChanged() {
        this._chunkerLengthChanged(this._chunkerLength);
        this._refreshChunker();
    }

    _autoSelectFirstRowChanged(autoSelectFirstRow) {
        if (!this.__isReady) {
            return;
        }
        if (!this.multiSelect && this.selectedIndexes && this.items && this.items.length) {
            if (autoSelectFirstRow && this.selectedIndexes.length === 0) {
                this.selected = 0;
            } else if (!autoSelectFirstRow && this.selectedIndexes.length === 1) {
                this.selected = -1;
            }
        }
    }
};

customElements.define(PTCS.List.is, PTCS.List);

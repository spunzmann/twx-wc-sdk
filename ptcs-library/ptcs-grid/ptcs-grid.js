import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import {PTCS} from 'ptcs-library/library.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-textfield/ptcs-textfield.js';
import 'ptcs-checkbox/ptcs-checkbox.js';
import 'ptcs-link/ptcs-link.js';
import 'ptcs-icon/ptcs-icon.js';
import 'ptcs-v-scroller/ptcs-v-scroller.js';

// Icon for grouping
(() => {
    const _hdr = `w="18" h="18" viewBox="0 0 34 34" stroke="none" stroke-width="1" transform="translate(8 ${PTCS.isIE ? 6 : 8})"`;
    const iconset = document.createElement('iron-iconset-svg');
    iconset.setAttribute('name', 'grid');
    iconset.setAttribute('size', '24');
    iconset.innerHTML = `<svg>
<defs>
<g id="chevron-left" ${_hdr}>
<polygon part="img" transform="translate(9.5, 9.726667) rotate(-270) translate(-6.5, -9.726667)"
points="13.385 4.16916667 6.5 11.0391667 -0.385 4.16916667 -2.5 6.28416667 6.5 15.2841667 15.5 6.28416667"/>
</g>
</defs>
</svg>`;
    document.head.appendChild(iconset);
})();


PTCS.Grid = class extends PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))) {
    static get template() {
        return html`
        <style>
          :host {
            min-width: 34px;
            min-height: 34px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: stretch;
          }

          :host([dragging-mode]) {
             user-select: none;
          }

          #chunker {
            flex: 1 1 auto;
          }

          ptcs-icon {
              color: gray;
          }
        </style>

        <style>

        [part=label] {
            min-height: 36px;
        }

        .row {
            position: relative;
            display: grid;
            grid-template-columns: var(--ptcs-grid-columns);
        }

        .row[selected] {
            background: #eaf6ff;
        }

        .row .cell {
            overflow: hidden;
        }

        [part=header] {
            flex: 0 0 auto;
            overflow: hidden;
        }

        [part=header][hidden] {
            display: none !important;
        }

        [part=header] .cell {
            font-weight: bold;
            background: #36454f; /* #262b2f; */
            color: #f0f0f0;
        }

        [part=header]:not([nosort]) .cell {
            cursor: pointer;
        }

        .cell {
            display: flex;
            padding: 8px;
            border: solid 1px #f0f0f0;
        }

        .cell[halign=center] {
            justify-content: center;
        }

        .cell[halign=right] {
            justify-content: flex-end;
        }

        .cell[valign=center] {
            align-items: center;
        }

        .cell[valign=bottom] {
            align-items: flex-end;
        }

        .cell.group-cell {
            grid-column: 1 / 100;
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;

            background: #f7f7f7;
            cursor: pointer;
            border: solid 1px #ffffff;
        }

        .cell.group-cell:hover {
            background: #f0f0f0;
        }

        .cell.group-cell [variant=body] {
            margin-left: 20px;
        }

        .group-cell ptcs-icon {
            transform: rotate(180deg)
        }

        .group-cell[open] ptcs-icon {
            transform: rotate(-90deg)
        }

        .resize-container {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            pointer-events: none;
        }

        .resize-cell {
            position: relative;
            overflow: visible !important;
            background: transparent !important;
            box-sizing: content-box;
        }

        .resize-cell:not(:last-of-type) .resize {
            position: absolute;
            right: -12px;
            top: 0;
            bottom: 0;
            width: 24px;
            cursor: ew-resize;
            z-index: 10;
            pointer-events: auto;
        }

        .resize-cell:not(:last-of-type) .resize::before {
            content: " ";
            position: absolute;
            top: 25%;
            bottom: 25%;
            left: 9px;
            width: 6px;
        }

        .resize-cell:not(:last-of-type):hover .resize::before {
            border-left: solid 1px #f0f0f0;
            border-right: solid 1px #f0f0f0;
        }
        </style>

        <ptcs-label part="label" hidden\$="[[!label]]" label="[[label]]"
            horizontal-alignment="[[labelAlignment]]" variant="[[labelType]]"></ptcs-label>
        <div class="row" id="header" part="header" ondragstart="return false" nosort\$="[[_nosort(sort)]]" hidden\$="[[hideHeader]]">
          <div class="resize-container row">
            <template is="dom-repeat" items="{{_columns}}">
                <div class="resize-cell cell">
                    <div class="resize" index="[[index]]" on-mousedown="_onResizeStart"></div>
                </div>
            </template>
          </div>
          <template is="dom-repeat" items="{{_columns}}">
            <div class="cell" on-click="_onColumnClick" index="[[index]]" halign\$="[[item.halign]]" valign\$="[[item.valign]]">
                <span>[[item.label]]</span>
                <ptcs-icon icon\$="[[_sortIcon(_sortedColumn, _sortOrder, index)]]" hidden\$="[[_hideSortIcon(item.compare, sort)]]"></ptcs-icon>
            </div>
          </template>
        </div>
        <ptcs-v-scroller id="chunker" num-items="[[_chunkerLength]]"></ptcs-v-scroller>
      `;
    }

    static get is() {
        return 'ptcs-grid';
    }

    static get properties() {
        return {
            disabled: {
                type:               Boolean,
                reflectToAttribute: true,
                observer:           '_disabledChanged'
            },

            label: {
                type:  String,
                value: ''
            },

            labelAlignment: { // 'left', 'center', 'right'
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            labelType: { // 'header', 'sub-header', 'label', 'body'
                type:  String,
                value: 'header'
            },

            hideHeader: {
                type: Boolean
            },

            columns: {
                type:  Array,
                value: () => []
            },

            // Remapped columns (normalized + [potential] select column + [potential] extra properties)
            _columns: {
                type:  Array,
                value: () => []
            },

            _colWidths: {
                type:  Array,
                value: () => []
            },

            sort: {
                type: Function
            },

            _sortedColumn: {
                type: Number
            },

            _sortOrder: {
                type: Number
            },

            _sort: {
                type:     Function,
                computed: '_computeSort(sort, _sortedColumn, _sortOrder)'
            },

            // Array of column numbers
            grouping: {
                type: Object
            },

            _grouping: {
                type:     Array,
                computed: '_computeGrouping(grouping)'
            },

            _groupedData: {
                type: Array
            },

            // Items supplied by the client. Read-only
            items: {
                type:  Array,
                value: () => []
            },

            // this.items projected via filter and / or sort
            _projection: {
                type:     Array, // of indices in this.items
                observer: '_refreshChunker'
            },

            // Number of items visible in chunker
            _chunkerLength: {
                type:  Number,
                value: 0
            },

            filter: {
                type: Function
                //observer: '_filterChanged'
            },

            selectMethod: {
                type: String // 'none' | 'single' | 'multiple'
            },

            selected: {
                type: Number
            },

            _selectedSet: {
                type:  Set,
                value: () => new Set()
            },

            _radioId: {
                type:  String,
                value: () => performance.now().toString().replace('.', '')
            },

            draggingMode: {
                type:               Boolean,
                reflectToAttribute: true
            },

            __old: {
                type:  Object,
                value: () => {
                    return {};
                }
            }
        };
    }

    static get observers() {
        return [
            '_columnsChanged(selectMethod, columns)',
            '_columnsDetailChanged(columns.*)',
            '_itemsChanged(items.*)',
            '_projectionChanged(items, filter, _sort, _grouping)'
        ];
    }

    ready() {
        super.ready();
        this.$.chunker.createItemElement = (index, el) => this._createGridRow(index, el);
        this.$.chunker.addEventListener('scroll', () => {
            this.$.header.scrollLeft = this.$.chunker.scrollLeft;
        });

        // TODO: Piggyback on resize-observer in scroller instead
        this._resizeObserver = new ResizeObserver(() => {
            this.$.header.style.width = this.$.chunker.clientWidth + 'px';
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this._resizeObserver.observe(this.$.chunker);
    }

    disconnectedCallback() {
        this._resizeObserver.unobserve(this.$.chunker);
        super.disconnectedCallback();
    }


    _nosort(sort) {
        return !!sort;
    }

    _sortIcon(_sortedColumn, _sortOrder, index) {
        if (_sortedColumn !== index) {
            return 'page:reorder';
        }
        return _sortOrder > 0 ? 'page:reorder-ascending' : 'page:reorder-descending';
    }

    _hideSortIcon(compare, sort) {
        return !compare || sort;
    }

    absoluteIndex(index) {
        return this._projection ? this._projection[index] : index;
    }

    _selIx(el, cb) {
        for (; el; el = el.parentNode) {
            if (el.index >= 0) {
                cb(el.index);
                break;
            }
        }
    }

    _createGridRow(index, el) {
        // TODO: Why do we need the extra test on FireFox and Edge?
        if (!el || el.children.length !== this._columns.length) {
            el = document.createElement('div');
            el.setAttribute('class', 'row');
            el.setAttribute('part', 'grid-row');

            this._columns.forEach(column => {
                const sub = document.createElement('div');
                sub.setAttribute('class', 'cell');
                if (column.halign) {
                    sub.setAttribute('halign', column.halign);
                }
                if (column.valign) {
                    sub.setAttribute('valign', column.valign);
                }
                column.create(sub);
                el.appendChild(sub);
            });
        }

        el.index = index;
        const item = this.items[this._groupedData ? index : this.absoluteIndex(index)];
        const children = el.children;
        this._columns.forEach((column, colix) => {
            const child = children[colix];
            if (child) {
                column.update(column.select(item, index), index, child);
            } else {
                console.error('MISSING CHILD FOR ' + index + ':' + colix);
            }
        });

        return el;
    }

    _createGroupRow(index, el) {
        const item = this._groupedData[index];

        if (typeof item === 'number') {
            return this._createGridRow(item, el && !el.classList.contains('group-row') ? el : null);
        }

        if (!el || !el.classList.contains('group-row')) {
            el = document.createElement('div');
            el.setAttribute('class', 'row group-row');
            el.setAttribute('part', 'grid-row');

            const groupCell = document.createElement('div');
            groupCell.setAttribute('class', 'cell group-cell');
            const toggle = document.createElement('ptcs-icon');
            toggle.size = 'small';
            toggle.iconSet = '#iron-icon';
            toggle.icon = 'grid:chevron-left';
            groupCell.appendChild(toggle);
            const label = document.createElement('ptcs-label');
            label.variant = 'label';
            groupCell.appendChild(label);
            const count = document.createElement('ptcs-label');
            count.variant = 'body';
            groupCell.appendChild(count);

            el.appendChild(groupCell);

            el.addEventListener('click', ev => {
                this._selIx(ev.target, index0 => {
                    const item0 = this._groupedData[index0];
                    if (item0.isOpen) {
                        // Close item
                        const close = (item1, index1) => {
                            // Recursively close sub-items
                            item1.group.forEach((item2, index2) => {
                                if (typeof item2 !== 'number' && item2.isOpen) {
                                    close(item2, index1 + index2 + 1);
                                }
                            });
                            this._groupedData.splice(index1 + 1, item1.group.length);
                            item1.isOpen = false;
                        };
                        close(item0, index0);
                    } else {
                        // Open item
                        this._groupedData.splice(index0 + 1, 0, ...item0.group);
                        item0.isOpen = true;
                    }
                    this._chunkerLength = this._groupedData.length;
                    this._refreshChunker();
                });
            });
        }

        el.index = index;
        const groupCell = el.firstElementChild;
        if (item.isOpen) {
            groupCell.setAttribute('open', '');
        } else {
            groupCell.removeAttribute('open');
        }
        groupCell.style.paddingLeft = `${34 * item.level}px`;
        groupCell.firstElementChild.nextElementSibling.label = `${item.value}`;
        groupCell.firstElementChild.nextElementSibling.nextElementSibling.label = ` (${item.size || item.group.length})`;
        return el;
    }

    _columnsChanged(selectMethod, columns) {
        if (!columns || !columns.length) {
            this._colums = [];
            return;
        }

        const dfltCreate = el => el.appendChild(document.createElement('div'));
        const dfltUpdate = (value, row, el) => {
            el.firstElementChild.textContent = value;
        };
        const dfltSelect = item => item;

        const _createSelector = selector => {
            switch (typeof selector) {
                case 'string':
                    return item => item[selector];
                case 'function':
                    return selector;
            }
            return dfltSelect;
        };

        // Normalize column properties
        const _columns = columns.map(column => {
            return {
                label:    column.label,
                create:   column.create ? column.create : dfltCreate,
                update:   column.update ? column.update : dfltUpdate,
                select:   _createSelector(column.selector),
                compare:  column.compare,
                grouping: column.grouping,
                width:    column.width,
                halign:   column.halign,
                valign:   column.valign
            };
        });

        // Additional select column?
        if (selectMethod === 'single') {
            this._addSingleSelectColumn(_columns);
        } else if (selectMethod === 'multiple') {
            this._addMultiSelectColumn(_columns);
        }

        // Column widths
        const _colWidths = [];
        _columns.forEach(column => {
            if (column.width) {
                _colWidths.push(`${column.width}`);
            } else {
                _colWidths.push('minmax(0, 1fr)');
            }
        });

        this.setProperties({_columns, _sortedColumn: -1, _sortOrder: 0, _colWidths});
        this.style.setProperty('--ptcs-grid-columns', _colWidths.join(' '));
        this.$.chunker.rebuild();
    }

    _addSingleSelectColumn(_columns) {
        const that = this;

        // this === the radio button
        function checkedChanged(ev) {
            const elRow = ev.target.parentNode.parentNode;
            if (ev.detail.value) {
                elRow.setAttribute('selected', '');
                that.selected = that.absoluteIndex(elRow.index);
            } else {
                elRow.removeAttribute('selected');
            }
        }

        _columns.unshift({
            label:  'S',
            create: el => {
                const radio = document.createElement('ptcs-radio');
                radio.preventAutoSelect = true;
                radio.radiogroup = this._radioId;
                radio.label = '';
                el.appendChild(radio);
                radio.addEventListener('checked-changed', checkedChanged);
            },
            update: (value, row, el) => {
                el.firstElementChild.checked = value;
            },
            select: item => {
                return this.selected >= 0 && item === this.items[this.selected];
            },
            width:  '34px',
            //halign:   'center',
            valign: 'center'
        });
    }

    _multiSelect(index, select) {
        const item = this.items[this.absoluteIndex(index)];
        if (select) {
            if (!this._selectedSet.has(item)) {
                this._selectedSet.add(item);
                console.log('ADDED ' + index + ' TO SELECTED SET');
            }
        } else if (this._selectedSet.has(item)) {
            this._selectedSet.delete(item);
            console.log('REMOVE ' + index + ' FROM SELECTED SET');
        }
    }

    _addMultiSelectColumn(_columns) {
        const that = this;

        // this === the checkbox
        function checkedChanged(ev) {
            const elRow = ev.target.parentNode.parentNode;
            that._multiSelect(elRow.index, ev.detail.value);
            if (ev.detail.value) {
                elRow.setAttribute('selected', '');
            } else {
                elRow.removeAttribute('selected');
            }
        }

        _columns.unshift({
            label:  'M',
            create: el => {
                const checkbox = document.createElement('ptcs-checkbox');
                el.appendChild(checkbox);
                checkbox.addEventListener('checked-changed', checkedChanged);
            },
            update: (value, row, el) => {
                el.firstElementChild.checked = value;
            },
            select: item => this._selectedSet.has(item),
            width:  '34px',
            //halign: 'center',
            valign: 'center'
        });
    }

    _columnsDetailChanged(cr) {
        console.log(`_columnsDetailChanged(${cr.path})`);
    }

    _itemsChanged(cr) {
        const m = /items\.([0-9]+).*/g.exec(cr.path);

        if (m) {
            console.log(`UPDATE item ${m[1]}`);
            this._refreshChunker();
        } else if (cr.path === 'items') {
            // A new list of items
            this._selectedSet.clear();

            console.log('WHAT TO DO ABOUT _projection?');
            /*
            if (this.filter) {
                this._filterChanged(this.filter);
            } else if (this._sortOrder && this._sortedColumn >= 0) {
              this._sortChanged(this._sortedColumn, this._sortOrder);
            } else {
                this.setProperties({_projection: null, _chunkerLength: this.items.length});
            }
            */

            //this._unselectAll();
            //this._autoSelectFirstRowChanged(this.autoSelectFirstRow);
        } else if (cr.path === 'items.splices') {
            console.warn('ptcs-grid: items were spliced!');
            // Added / removed items
        } else {
            return; // Ignore change
        }
    }

    // Create sort function
    _computeSort(sort, _sortedColumn, _sortOrder) {
        if (typeof sort === 'function') {
            return sort;
        }

        if (_sortOrder && _sortedColumn >= 0) {
            const select = this._columns[_sortedColumn].select;
            const compare = this._columns[_sortedColumn].compare;

            return _sortOrder < 0
                ? (a, b) => compare(select(a), select(b))
                : (a, b) => -compare(select(a), select(b));
        }

        return null;
    }

    // Convert grouping string to array of column numbers
    _computeGrouping(grouping) {
        if (typeof grouping === 'string') {
            // Convert string to array of numbers (column indices)
            const r = grouping.split(' ').filter(colNo => colNo !== '' && !isNaN(+colNo)).map(colNo => +colNo);
            if (r.length > 0) {
                // Remove duplicates
                return r.filter((colNo, index) => r.findIndex(x => x === colNo) === index);
            }
        }

        return null;
    }

    _projectionChanged(items, filter, _sort, _grouping) {
        let _projection = this._projection;

        // Filter
        if (this.__old.filter !== filter) {
            this.__old.filter = filter;

            if (filter) {
                _projection = [];
                for (let num = items.length, i = 0; i < num; i++) {
                    if (filter(items[i])) {
                        _projection.push(i);
                    }
                }
            } else {
                _projection = null;
            }
        }

        // Sort
        let reSort = false;
        if (_sort !== this.__old._sort || _projection !== this._projection) {
            this.__old._sort = _sort;
            if (_sort) {
                if (!_projection) {
                    _projection = items.map((item, index) => index);
                }

                _projection.sort((a, b) => _sort(items[a], items[b]));

                reSort = true;
            } else if (!filter) {
                _projection = null;
            }
        }

        // Grouping
        if (_grouping !== this.__old._grouping || (_grouping && (_projection !== this._projection || reSort))) {
            this.__old._grouping = _grouping;
            this._groupingChanged(_grouping, _projection);
            this.$.chunker.rebuild();
        } else {
            this.setProperties({_projection, _chunkerLength: _projection ? _projection.length : items.length});
            this._refreshChunker();
        }
    }

    _groupingChanged(_grouping, _projection) {
        // Sanitize grouping columns (make sure they correspond to actual columns)
        const computeColumns = () => {
            let min = 0;
            let max = this._columns.length - 1;

            if (this.selectMethod === 'single' || this.selectMethod === 'multiple') {
                // Adjust column range for the extra selection column
                ++min; ++max;
            }

            return _grouping.filter(colNo => min <= colNo && colNo <= max);
        };
        const gc = _grouping ? computeColumns() : null;

        // No grouping?
        if (!gc || gc.length <= 0) {
            this.$.chunker.createItemElement = (index, el) => this._createGridRow(index, el);
            this.setProperties({
                _groupedData:   null,
                _chunkerLength: _projection ? _projection.length : this.items.length
            });
            return;
        }

        const getValueFunc = level => {
            const column = this._columns[gc[level]];
            return column.grouping || column.select;
        };

        // group list into grouping using process - and mark groups with level
        const group = (list, process, level = 0) => {
            const grouping = [];
            const groupMap = new Map();

            function add(value, obj) {
                let a = groupMap.get(value);
                if (a) {
                    a.push(obj);
                } else {
                    a = [obj];
                    groupMap.set(value, a);
                    grouping.push({value, group: a, level});
                }
            }

            list.forEach((d, i) => process(d, i, add));
            return grouping;
        };

        // Create sub-groups
        const subgroup = (list, level = 1) => {
            list.forEach(g => {
                const gv = getValueFunc(level);
                g.size = g.group.length;
                g.group = group(g.group, (itemIx, index, add) => add(gv(this.items[itemIx], index), itemIx), level);
                if (level + 1 < gc.length) {
                    subgroup(g.group, level + 1);
                }
            });
        };

        // First grouping level
        const gv = getValueFunc(0);
        const r = _projection
            ? group(_projection, (projIx, index, add) => add(gv(this.items[projIx], index), projIx))
            : group(this.items, (item, index, add) => add(gv(item, index), index));

        // Subgrouping?
        if (gc.length > 1) {
            subgroup(r);
        }

        this.setProperties({_groupedData: r, _chunkerLength: r.length});
        this.$.chunker.createItemElement = (index, el) => this._createGroupRow(index, el);
    }

    _onColumnClick(ev) {
        if (this.sort) {
            // Client manages the sorting
            return;
        }
        this._selIx(ev.target, index => {
            if (!this._columns[index].compare) {
                // Not sortable
                return;
            }
            if (index === this._sortedColumn) {
                // Toggle sort order for column
                this._sortOrder = this._sortOrder < 0 ? 1 : -1;
            } else {
                // Select a new sort column
                this.setProperties({_sortedColumn: index, _sortOrder: -1});
            }
        });
    }

    _refreshChunker() {
        if (this.__refreshChunkerOn) {
            return;
        }
        this.__refreshChunkerOn = true;
        requestAnimationFrame(() => {
            this.$.chunker.refresh();
            this.__refreshChunkerOn = false;
        });
    }

    _trackMouse(setValue) {
        let mmv = ev => setValue(ev);

        this.draggingMode = true;
        let mup = () => {
            window.removeEventListener('mousemove', mmv);
            window.removeEventListener('mouseup', mup);
            this.draggingMode = false;
        };

        window.addEventListener('mousemove', mmv);
        window.addEventListener('mouseup', mup);
    }

    _onResizeStart(ev) {
        if (this.disabled) {
            return;
        }
        const index = ev.target.index;
        if (isNaN(index)) {
            return;
        }
        const left = ev.target.parentNode;
        const right = left.nextElementSibling;
        if (!right) {
            return;
        }

        const w1 = left.getBoundingClientRect().width;
        const w2 = right.getBoundingClientRect().width;
        if (w1 < 34 || w2 < 34) {
            console.error('Too narrow to handle');
            return;
        }

        // Track mouse movements until mouse button is released
        const x0 = ev.clientX;
        this._trackMouse(e => {
            const dw = e.clientX - x0;
            const _w1 = w1 + dw;
            const _w2 = w2 - dw;
            if (_w1 <= 34 || _w2 < 34) {
                return;
            }
            this.set(`_colWidths.${index}`, `${_w1}px`);
            this.set(`_colWidths.${index + 1}`, `${_w2}px`);
            this.style.setProperty('--ptcs-grid-columns', this._colWidths.join(' '));
        });
    }
};

customElements.define(PTCS.Grid.is, PTCS.Grid);

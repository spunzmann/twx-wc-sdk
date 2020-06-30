import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

import {select} from 'd3-selection';
import {stack, area, line, curveLinear, curveBasis, curveBundle,
    curveCardinal, curveCatmullRom, curveMonotoneX, curveMonotoneY,
    curveNatural, curveStepBefore, curveStepAfter, curveStep,
    stackOrderNone, stackOrderReverse, stackOrderAppearance,
    stackOrderAscending, stackOrderDescending, stackOrderInsideOut,
    stackOffsetNone, stackOffsetExpand, stackOffsetDiverging,
    stackOffsetSilhouette, stackOffsetWiggle} from 'd3-shape';

/* Don't need a warning to make sure I have not confused "=>" with ">=" or "<=" */
/* eslint-disable no-confusing-arrow */
const __xv = item => item[0];
const __yv = item => item[1];

PTCS.ChartCoreLine = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))))) {

    static get template() {
        return html`
        <style>
        :host {
            display: block;
            width: 100%;
            height: 100%;
            --ptcs-tooltip-start-delay: 100;
        }

        /* sparkView causes marker=none and [stacked] hides the lines in theming (display: none) so that nothing is shown */
        :host([stacked][marker=none]) [part=line]{
            display: block;
        }

        svg {
            position: relative;
            z-index: 10;
            width: 100%;
            height: 100%;
        }

        /* Add an extra chart level, so we have exclusive access to the influencing class attribute */
        #chart {
            position: relative;
            width: 100%;
            height: 100%;
        }

        #markers {
            pointer-events: none;
        }

        :host([hide-markers]) #markers {
            display: none;
        }

        :host([hide-lines]) #lines {
            display: none;
        }

        :host(:not([show-areas])) #areas {
            display: none;
        }

        [part=marker] {
            display: none;
            position: absolute;
        }

        :host([marker]) [part=marker] {
            display: block;
        }

        :host([marker=none]) [part=marker] {
            display: none;
        }

        .pick-marker {
            display: block;
        }

        :host([hover-pick]) .pick-marker:not(:hover) {
            display: none;
        }

        #values {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            pointer-events: none;
            user-select: none;
            z-index: 12;
            overflow: hidden;
        }

        ptcs-label[part=value] {
            position: absolute;
            left: 0;
            top: 0;
        }

        [part=drag-rect] {
            display: none;
        }

        [part=selected] {
            pointer-events: none;
        }

        :host(:not(:focus)) [part=focus] {
            display: none;
        }

        [part=focus] {
            pointer-events: none;
        }

        [part=hover] {
            display: none;
            pointer-events: none;
        }

        /* FILTERING */
        #chart.filter .marker-legend {
            opacity: 0;
        }

        #chart.filter.L1 .marker-legend[legend=L1] {
            opacity: 1;
        }

        #chart.filter.L2 .marker-legend[legend=L2] {
            opacity: 1;
        }

        #chart.filter.L3 .marker-legend[legend=L3] {
            opacity: 1;
        }

        #chart.filter.L4 .marker-legend[legend=L4] {
            opacity: 1;
        }

        #chart.filter.L5 .marker-legend[legend=L5] {
            opacity: 1;
        }

        #chart.filter.L6 .marker-legend[legend=L6] {
            opacity: 1;
        }

        #chart.filter.L7 .marker-legend[legend=L7] {
            opacity: 1;
        }

        #chart.filter.L8 .marker-legend[legend=L8] {
            opacity: 1;
        }

        #chart.filter.L9 .marker-legend[legend=L9] {
            opacity: 1;
        }

        #chart.filter.L10 .marker-legend[legend=L10] {
            opacity: 1;
        }

        #chart.filter.L11 .marker-legend[legend=L11] {
            opacity: 1;
        }

        #chart.filter.L12 .marker-legend[legend=L12] {
            opacity: 1;
        }

        #chart.filter.L13 .marker-legend[legend=L13] {
            opacity: 1;
        }

        #chart.filter.L14 .marker-legend[legend=L14] {
            opacity: 1;
        }

        #chart.filter.L15 .marker-legend[legend=L15] {
            opacity: 1;
        }

        #chart.filter.L16 .marker-legend[legend=L16] {
            opacity: 1;
        }

        #chart.filter.L17 .marker-legend[legend=L17] {
            opacity: 1;
        }

        #chart.filter.L18 .marker-legend[legend=L18] {
            opacity: 1;
        }

        #chart.filter.L19 .marker-legend[legend=L19] {
            opacity: 1;
        }

        #chart.filter.L20 .marker-legend[legend=L20] {
            opacity: 1;
        }

        #chart.filter.L21 .marker-legend[legend=L21] {
            opacity: 1;
        }

        #chart.filter.L22 .marker-legend[legend=L22] {
            opacity: 1;
        }

        #chart.filter.L23 .marker-legend[legend=L23] {
            opacity: 1;
        }

        #chart.filter.L24 .marker-legend[legend=L24] {
            opacity: 1;
        }

        #chart.filter .value-legend {
            opacity: 0;
        }

        #chart.filter.L1 .value-legend[legend=L1] {
            opacity: 1;
        }

        #chart.filter.L2 .value-legend[legend=L2] {
            opacity: 1;
        }

        #chart.filter.L3 .value-legend[legend=L3] {
            opacity: 1;
        }

        #chart.filter.L4 .value-legend[legend=L4] {
            opacity: 1;
        }

        #chart.filter.L5 .value-legend[legend=L5] {
            opacity: 1;
        }

        #chart.filter.L6 .value-legend[legend=L6] {
            opacity: 1;
        }

        #chart.filter.L7 .value-legend[legend=L7] {
            opacity: 1;
        }

        #chart.filter.L8 .value-legend[legend=L8] {
            opacity: 1;
        }

        #chart.filter.L9 .value-legend[legend=L9] {
            opacity: 1;
        }

        #chart.filter.L10 .value-legend[legend=L10] {
            opacity: 1;
        }

        #chart.filter.L11 .value-legend[legend=L11] {
            opacity: 1;
        }

        #chart.filter.L12 .value-legend[legend=L12] {
            opacity: 1;
        }

        #chart.filter.L13 .value-legend[legend=L13] {
            opacity: 1;
        }

        #chart.filter.L14 .value-legend[legend=L14] {
            opacity: 1;
        }

        #chart.filter.L15 .value-legend[legend=L15] {
            opacity: 1;
        }

        #chart.filter.L16 .value-legend[legend=L16] {
            opacity: 1;
        }

        #chart.filter.L17 .value-legend[legend=L17] {
            opacity: 1;
        }

        #chart.filter.L18 .value-legend[legend=L18] {
            opacity: 1;
        }

        #chart.filter.L19 .value-legend[legend=L19] {
            opacity: 1;
        }

        #chart.filter.L20 .value-legend[legend=L20] {
            opacity: 1;
        }

        #chart.filter.L21 .value-legend[legend=L21] {
            opacity: 1;
        }

        #chart.filter.L22 .value-legend[legend=L22] {
            opacity: 1;
        }

        #chart.filter.L23 .value-legend[legend=L23] {
            opacity: 1;
        }

        #chart.filter.L24 .value-legend[legend=L24] {
            opacity: 1;
        }

        #chart.filter path[legend] {
            opacity: 0;
        }

        #chart.filter.L1 path[legend=L1] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L2 path[legend=L2] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L3 path[legend=L3] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L4 path[legend=L4] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L5 path[legend=L5] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L6 path[legend=L6] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L7 path[legend=L7] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L8 path[legend=L8] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L9 path[legend=L9] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L10 path[legend=L10] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L11 path[legend=L11] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L12 path[legend=L12] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L13 path[legend=L13] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L14 path[legend=L14] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L15 path[legend=L15] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L16 path[legend=L16] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L17 path[legend=L17] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L18 path[legend=L18] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L19 path[legend=L19] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L20 path[legend=L20] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L21 path[legend=L21] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L22 path[legend=L22] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L23 path[legend=L23] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #chart.filter.L24 path[legend=L24] {
            opacity: var(--ptcs-chart-area--opacity, 1);
        }

        #hoveraggr {
            pointer-events: none;
            visibility: hidden;
        }

        [part~=line] {
            fill: none;
        }

        [part~=area] {
            stroke: none;
        }
        </style>

        <div id="chart" class\$="[[_filter(filterLegend)]]" ondragstart="return false">
            <svg on-click="_clickOnChart" on-mousedown="_dragStart" on-mousemove="_moveOverChart">
                <defs>
                    <circle id="ptc-circle" cx="0" cy="0" r="8"/>
                    <rect id="ptc-square" x="-8" y="-8" width="16" height="16"/>
                    <rect id="ptc-diamond" x="-8" y="-8" width="16" height="16" transform="rotate(45)"/>
                    <polygon id="ptc-triangle" points="-9,6.364 0,-6.364 9,6.364"/>
                    <polygon id="ptc-plus" points="-9,3 -9,-3 -3,-3 -3,-9 3,-9, 3,-3, 9,-3 9,3 3,3 3,9 -3,9 -3,3"/>
                    <use id="ptc-cross" href="#plus" transform="rotate(45)"/>
                </defs>
                <g id="areas"></g>
                <g id="lines"></g>
                <g id="hoveraggr">
                    <rect id="hoverpoint" x="-4" y="-4" width="8" height="8" fill="none"/>
                    <path id="hoverxline" part="hover-line"/>
                    <path id="hoveryline" part="hover-line"/>
                </g>
                <g id="markers"></g>
                <g id="hover-markers"></g>
                <use id="focusmarker" part="focus"></use>
                <use id="selmarker" part="selected"></use>
                <rect id="dragrect" part="drag-rect"></rect>
            </svg>
            <div id="values" hidden\$="[[_hideValues(showValues)]]"></div>
        </div>`;
    }

    static get is() {
        return 'ptcs-chart-core-line';
    }

    static get properties() {
        return {
            // Recieved data
            data: {
                type: Array
            },

            // Massaged data
            _data: Array,

            // Legend data, for tooltip
            legend: Array,

            // Stack method. If assigned, enables stacking
            // auto || expand || diverging || silhouette || wiggle
            stackMethod: String,

            // Stack order: auto || reverse || appearance || ascending || descending || insideout
            stackOrder: String,

            // Stacked data, if stacking is enabled
            _stackedData: Array,

            stacked: {
                type:               Boolean,
                computed:           '_computeStacked(stackMethod)',
                reflectToAttribute: true
            },

            // xValue type: number || date || string
            xType: Object,

            // yValue type: number || date || string
            yType: Object,

            // Minimun x value in data
            xMin: {
                type:   Object,
                notify: true
            },

            // Maximum x value in data
            xMax: {
                type:   Object,
                notify: true
            },

            // Minimun y value in data
            yMin: {
                type:   Object,
                notify: true
            },

            // Maximum y value in data
            yMax: {
                type:   Object,
                notify: true
            },

            // Compare x values according to xType
            _xCmp: {
                type:     Function,
                computed: '_computeType(xType)'
            },

            // Compare y values according to yType
            _yCmp: {
                type:     Function,
                computed: '_computeType(yType)'
            },

            // Scale that maps x-positions to x-axis
            xScale: {
                type:     Function,
                observer: 'refresh'
            },

            // Scale that maps y-positions to y-axis
            yScale: {
                type:     Function,
                observer: 'refresh'
            },

            flipAxes: {
                type:     Boolean,
                observer: 'refresh'
            },

            // Legend filtering
            filterLegend: {
                type:     Array,
                observer: '_filterLegendChanged'
            },

            hideLines: {
                type:               Boolean,
                observer:           'refresh',
                reflectToAttribute: true
            },

            showAreas: {
                type:               Boolean,
                observer:           'refresh',
                reflectToAttribute: true
            },

            // linear || basis || bundle || cardinal || catmull-rom || monotone-x || monotone-y || natural || step
            curve: {
                type:     String,
                observer: 'refresh'
            },

            // when curve === bundle
            bundleBeta: {
                type:     Number,
                value:    0.5,
                observer: 'refresh'
            },

            // when curve === cardinal
            cardinalTension: {
                type:     Number,
                value:    0.5,
                observer: 'refresh'
            },

            // when curve === catmull-rom
            catmullRomAlpha: {
                type:     Number,
                value:    0.5,
                observer: 'refresh'
            },

            // when curve === step
            stepPosition: {
                type:     String, // center || before || after
                observer: 'refresh'
            },

            // none || square || circle || triangle || plus || cross
            marker: {
                type:               String,
                observer:           'refresh',
                reflectToAttribute: true
            },

            // small || medium || large || xlarge || <number>
            markerSize: {
                type:     String,
                observer: 'refresh'
            },

            showValues: {
                type:     String,
                observer: 'refresh'
            },

            // zoom by selecting two elements
            zoomSelect: {
                type: Boolean
            },

            // X-zoom by dragging the mouse over the chart
            zoomDragX: {
                type: Boolean
            },

            // Y-zoom by dragging the mouse over the chart
            zoomDragY: {
                type: Boolean
            },

            // cursor: auto (just mouse) || x (x-line) || y (y-line) || xy (cross)
            cursorType: {
                type:     String,
                observer: '_updateHoverline'
            },

            // target method: auto (over) || x (closests x) || y (closest y) || xy (closest) || none
            cursorTarget: {
                type: String,
            },

            // List of values that the cursorType / cursorTarget selects
            // [{valueIx, serieIx, x, y}, ...]
            _pickList: {
                type: Array
            },

            // Keep track of old pick list, to prevent unnecessary redraws
            _oldPickList: {
                type: Array
            },

            // Index to hovered item in _pickList (if any)
            hoverPick: {
                type:               Object,
                reflectToAttribute: true
            },

            // Currently selected item (for zooming)
            // {valueIx, serieIx, x, y}
            _selected: {
                type:     Object,
                value:    null,
                observer: '_selectedChanged'
            },

            // The value that has focus
            // {valueIx, serieIx, x, y}
            _focus: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_change(data, stackMethod, stackOrder, _xCmp, _yCmp)',
            '_dataChanged(data.*)',
            '_updateTooltips(_pickList, hoverPick)'
        ];
    }

    // Compare values of the various types
    static cmpNumber(a, b) {
        return a - b;
    }

    static cmpDate(a, b) {
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() - b.getTime();
        }
        return 0;
    }

    static arrayCmp(values) {
        const weigth = values.reduce((w, item, index) => {
            w[item] = index;
            return w;
        }, {});

        return (a, b) => {
            const av = weigth[a];
            const bv = weigth[b];
            if (av !== undefined) {
                if (bv !== undefined) {
                    return av - bv;
                }
                return 1;
            }
            return bv !== undefined ? -1 : 0;
        };
    }

    ready() {
        super.ready();

        // Keyboard navigation
        this.addEventListener('keydown', ev => this._keyDown(ev));

        // Must know when the mouse leaves the chart
        this.addEventListener('mouseout', ev => {
            this.setProperties({hoverPick: undefined, _pickList: []});
            this.$.hoveraggr.style.visibility = '';
            this.__onChart = false;
        });
    }

    _computeType(type) {
        if (type instanceof Array) {
            return PTCS.ChartCoreLine.arrayCmp(type);
        }
        if (type === 'date') {
            return PTCS.ChartCoreLine.cmpDate;
        }
        return PTCS.ChartCoreLine.cmpNumber;
    }

    _computeStacked(stackMethod) {
        return stackMethod ? !!PTCS.ChartCoreLine.stackOffset[stackMethod] : false;
    }

    _filterLegendChanged() {
        if (this._stackedData) {
            this._change(this.data, this.stackMethod, this.stackOrder, this._xCmp, this._yCmp);
        }
        if (this._focus && this.filterLegend instanceof Array && !this.filterLegend.includes(this._focus.serieIx)) {
            this._focus = undefined;
        }
    }

    _filter(filterLegend) {
        if (!(filterLegend instanceof Array)) {
            return '';
        }
        return 'filter ' + filterLegend.map(item => `L${item + 1}`).join(' ');
    }

    _isVisibleLegend(el) {
        const legend = el.getAttribute('legend');
        if (legend) {
            if (!(this.filterLegend instanceof Array)) {
                return true;
            }
            // Elements filtered by legend have an attribute named legend with value L1, L2, ...
            // The filterLegend array contains corresponding integer - 1 in an item when the element is visible
            const ix = Number(legend.substring(1)) - 1;
            return this.filterLegend.includes(ix);
        }
        return false;
    }

    _hideValues(showValues) {
        return showValues !== 'above' && showValues !== 'on' && showValues !== 'below';
    }

    __change(data, stackMethod, stackOrder, _xCmp, _yCmp) {
        if (!(data instanceof Array) || !_xCmp || !_yCmp) {
            return;
        }
        const stackOffset = PTCS.ChartCoreLine.stackOffset[stackMethod];

        let xMin, xMax, yMin, yMax, _stackedData;
        let _data;

        if (stackOffset) {
            const filterLegend = this.filterLegend;
            const d3stack = stack()
                .keys(__yv(data[0]).map((d, i) => i).filter((i) => !filterLegend || filterLegend.includes(i)))
                .value((d, key) => d[1][key])
                .offset(stackOffset);

            const order = PTCS.ChartCoreLine.stackOrder[stackOrder];
            if (order) {
                d3stack.order(order);
            }

            const x = data.map(__xv);
            const y = d3stack(data);

            xMin = x.reduce((r, v) => _xCmp(r, v) > 0 ? v : r, x[0]);
            xMax = x.reduce((r, v) => _xCmp(r, v) < 0 ? v : r, x[0]);

            if (y && y[0]) {
                yMin = y[0][0][0];
                yMax = y[0][0][1];
                y.forEach(a => {
                    a.forEach(item => {
                        if (_yCmp(yMin, item[0]) > 0) {
                            yMin = item[0];
                        }
                        if (_yCmp(yMax, item[1]) < 0) {
                            yMax = item[1];
                        }
                    });
                });
            }

            _stackedData = {x, y};
        } else {
            // Initialize with any valid values
            if (data && data[0]) {
                xMin = xMax = __xv(data[0]);
                yMin = yMax = __yv(data[0])[0];
            }

            _data = [];

            // Group data to series layout
            data.forEach(item => {
                const x = __xv(item);

                if (_xCmp(xMin, x) > 0) {
                    xMin = x;
                }
                if (_xCmp(xMax, x) < 0) {
                    xMax = x;
                }

                __yv(item).forEach((y, index) => {
                    if (_yCmp(yMin, y) > 0) {
                        yMin = y;
                    }
                    if (_yCmp(yMax, y) < 0) {
                        yMax = y;
                    }
                    if (_data[index]) {
                        _data[index].push([x, y]);
                    } else {
                        _data[index] = [[x, y]];
                    }
                });
            });
        }

        this.setProperties({_data, xMin, xMax, yMin, yMax, _stackedData});
        this.refresh();
    }

    _change(/*data, stackMethod, stackOrder, _xCmp, _yCmp*/) {
        if (this.__changeOn) {
            return;
        }
        this.__changeOn = true;
        requestAnimationFrame(() => {
            this.__changeOn = false;
            this.__change(this.data, this.stackMethod, this.stackOrder, this._xCmp, this._yCmp);
        });
    }

    _dataChanged(cr) {
        if (cr.path !== 'data' && cr.path !== 'data.length') {
            // Some internal data point has changed
            this.refreshData();
        }
        this._selected = null;
    }

    refreshData() {
        this._change(this.data, this.stackMethod, this.stackOrder, this._xCmp, this._yCmp);
    }

    refresh() {
        if (this.__refreshOn) {
            return;
        }
        this.__refreshOn = true;
        requestAnimationFrame(() => {
            this.__refreshOn = false;
            if (this._stackedData) {
                this.__refreshStacked();
            } else {
                this.__refresh();
            }
            // Reset/recompute things that are dependent on the marker locations
            this._traceSelected();
            this._traceFocus();
            this._closeTooltip();
            this._updateHoverline();
        });
    }

    _curve() {
        const f = PTCS.ChartCoreLine.curveMap[this.curve];
        if (f) {
            return f.call(this);
        }
        return curveLinear;
    }

    _getMarkerScale() {
        switch (this.markerSize) {
            case 'small':
                return 0.5;
            case undefined:
            case null:
            case '':
            case 'medium':
                return 1;
            case 'large':
                return 1.5;
            case 'xlarge':
                return 2;
            default:
                if (this.markerSize !== '') {
                    const v = +this.markerSize;
                    if (!isNaN(v) && v > 0) {
                        return v / 16;
                    }
                }
        }
        return 1;
    }

    _setMarkerPosFunc(xPos, yPos) {
        const scale = this._getMarkerScale();

        if (scale === 1) {
            return this.flipAxes
                ? d => `translate(${yPos(d[1])}px,${xPos(d[0])}px)`
                : d => `translate(${xPos(d[0])}px,${yPos(d[1])}px)`;
        }

        return this.flipAxes
            ? d => `translate(${yPos(d[1])}px,${xPos(d[0])}px) scale(${scale})`
            : d => `translate(${xPos(d[0])}px,${yPos(d[1])}px) scale(${scale})`;
    }

    _setMarkerPosStackedFunc(xOffs, yPos) {
        const scale = this._getMarkerScale();

        if (scale === 1) {
            return this.flipAxes
                ? (d, i) => `translate(${yPos(d[1])}px,${xOffs[i]}px)`
                : (d, i) => `translate(${xOffs[i]}px,${yPos(d[1])}px)`;
        }

        return this.flipAxes
            ? (d, i) => `translate(${yPos(d[1])}px,${xOffs[i]}px) scale(${scale})`
            : (d, i) => `translate(${xOffs[i]}px,${yPos(d[1])}px) scale(${scale})`;
    }

    __assignLabelPosFunc() {
        const xMax = this.clientWidth;
        const yMax = this.clientHeight;

        return (x, y, w, h) => {
            // Push label fully into view, if any part of it is visible
            if (x < 0) {
                if (x + w > 0) {
                    x = 0;
                }
            } else if (x + w >= xMax && x < xMax) {
                x = xMax - w;
            }
            if (y < 0) {
                if (y + h > 0) {
                    y = 0;
                }
            } else if (y + h >= yMax && y < yMax) {
                y = yMax - h;
            }
            // Generate transform expression
            return `translate(${x}px,${y}px)`;
        };
    }

    _setLabelPosFunc(xPos, yPos) {
        const hasMarker = (this.marker && this.marker !== 'none');
        const dy = 8 * this._getMarkerScale();
        const f = this.__assignLabelPosFunc();

        if (this.showValues === 'above' && hasMarker) {
            return this.flipAxes
                ? (d, w, h) => f(yPos(d[1]) - w / 2, xPos(d[0]) - dy - h, w, h)
                : (d, w, h) => f(xPos(d[0]) - w / 2, yPos(d[1]) - dy - h, w, h);
        }

        if (this.showValues === 'below' && hasMarker) {
            return this.flipAxes
                ? (d, w, h) => f(yPos(d[1]) - w / 2, xPos(d[0]) + dy, w, h)
                : (d, w, h) => f(xPos(d[0]) - w / 2, yPos(d[1]) + dy, w, h);
        }

        return this.flipAxes
            ? (d, w, h) => f(yPos(d[1]) - w / 2, xPos(d[0]) - h / 2, w, h)
            : (d, w, h) => f(xPos(d[0]) - w / 2, yPos(d[1]) - h / 2, w, h);
    }

    _setLabelPosStackedFunc(xOffs, yPos, min, max) {
        const hasMarker = (this.marker && this.marker !== 'none');
        const dy = 8 * this._getMarkerScale();
        const f = this.__assignLabelPosFunc();

        if (this.showValues === 'above' && hasMarker) {
            return this.flipAxes
                ? (d, i, w, h) => f(yPos(d[1]) - w / 2, xOffs[i] - dy - h, w, h)
                : (d, i, w, h) => f(xOffs[i] - w / 2, yPos(d[1]) - dy - h, w, h);
        }

        if (this.showValues === 'below' && hasMarker) {
            return this.flipAxes
                ? (d, i, w, h) => f(yPos(d[1]) - w / 2, xOffs[i] + dy, w, h)
                : (d, i, w, h) => f(xOffs[i] - w / 2, yPos(d[1]) + dy, w, h);
        }

        return this.flipAxes
            ? (d, i, w, h) => f(yPos(d[1]) - w / 2, xOffs[i] - h / 2, w, h)
            : (d, i, w, h) => f(xOffs[i] - w / 2, yPos(d[1]) - h / 2, w, h);
    }

    __filterStackedData() {
        const xScale = this.xScale;
        const maxX = this.flipAxes ? this.clientHeight : this.clientWidth;
        const maxPoints = maxX / 3;
        const xOrg = this._stackedData.x;
        const yOrg = this._stackedData.y;

        // Index to first x-point that is included in current zoom viewport
        const x1 = xOrg.findIndex(d => xScale(d) !== undefined);

        // Index to last x-point that is included in current zoom viewport
        const x2 = (() => { // findIndex backwards
            for (let i = xOrg.length - 1; i >= 0; i--) {
                if (xScale(xOrg[i]) !== undefined) {
                    return i;
                }
            }
            return -1;
        })();

        // Default values if no filtering / sampling is needed
        let x = xOrg;
        let y = yOrg;

        if (x1 > 0 || x2 < xOrg.length - 1) {
            // Zoom filtering
            x = xOrg.filter((d, i) => (x1 <= i && i <= x2));
            if (x.length > maxPoints) {
                // Add sampling to zooming
                x = PTCS.sampleArray(x, maxPoints);
            }
            y = [];
            yOrg.forEach(line2 => {
                let _line = line2.filter((d, i) => (x1 <= i && i <= x2));

                if (maxPoints < _line.length) {
                    // Add sampling
                    _line = PTCS.sampleArray(_line, maxPoints);
                }
                if (_line.length > 0) {
                    _line.key = line2.key;
                    _line.index = line2.index;
                    y.push(_line);
                }
            });
        } else if (x.length > maxPoints) {
            // Sample down data set
            x = PTCS.sampleArray(x, maxPoints);
            y = [];
            yOrg.forEach(line2 => {
                console.assert(line2.length === xOrg.length);
                const _line = PTCS.sampleArray(line2, maxPoints);
                if (_line.length > 0) {
                    _line.key = line2.key;
                    _line.index = line2.index;
                    y.push(_line);
                }
            });
        }

        // Index mapping function: new x-index => org x-index
        const xIndex = (() => {
            if (x.length === x2 - x1 + 1) {
                // No sampling was applied to data. Straigthforward map
                return x1 > 0 ? (d, i) => i + x1 : (d, i) => i;
            }
            // Sampling was applied to data. Complex rule to determine original x-index
            const xMap = [];
            let ix = 0;
            for (let i = x1; i <= x2; i++) {
                if (xOrg[i] === x[ix]) {
                    xMap[ix++] = i;
                }
            }
            console.assert(ix === x.length); // All values should have been mapped
            return (d, i) => xMap[i];
        })();

        return {x, y, xIndex};
    }

    // Showing values is _very_ expensive, so they might need to be sampled down _significantly_
    __sampleStackedValues(y) {
        const num = y.reduce((sum, serie) => sum + serie.length, 0);
        const wxh = this.clientWidth * this.clientHeight; // Chart area in px x px
        const max = wxh / (2 * 18 * 64); // Divide by twice the estimated area of a value label
        if (num <= max) {
            return {_yValues: y, vIndex: i => i}; // Keep all values
        }

        // num * k = max
        const k = max / num;
        const iMap = PTCS.sampleArray(y[0].map((d, i) => i), y[0].length * k);
        const r = [];
        y.forEach(serie => {
            const maxPoints = serie.length * k;
            if (maxPoints > 0) {
                const sample = PTCS.sampleArray(serie, maxPoints);
                sample.index = serie.index;
                sample.key = serie.key;
                r.push(sample);
            }
        });
        return {_yValues: r, vIndex: i => iMap[i]};
    }

    __refreshStacked() {
        const xScale = this.xScale;
        const yScale = this.yScale;
        const filterLegend = this.filterLegend;

        if (!this._stackedData || !xScale || !yScale) {
            return;
        }

        const deltaX = xScale.bandwidth ? xScale.bandwidth() / 2 : 0;
        const deltaY = yScale.bandwidth ? yScale.bandwidth() / 2 : 0;
        const xPos = deltaX ? value => xScale(value) + deltaX : xScale;
        const yPos = deltaY ? value => yScale(value) + deltaY : yScale;
        let legend;
        if (filterLegend) {
            legend = (d, i) => `L${filterLegend[i] + 1}`;
        } else {
            legend = (d, i) => `L${i + 1}`;
        }

        const serieIx = (d, i) => i;
        const {x, y, xIndex} = this.__filterStackedData();
        const xOffs = x.map(_x => xPos(_x));

        // Create data for hover-markers
        this.__pickData = y.map(serie => {
            const _serie = serie.map((d, i) => [xOffs[i], yPos(d[1]), xIndex(d, i)]);
            _serie.serieIx = serie.index;
            return _serie;
        });

        if (this.showAreas) {
            const d3area = this.flipAxes
                ? area().x0(d => yPos(d[0])).x1(d => yPos(d[1])).y((d, i) => xOffs[i])
                : area().x((d, i) => xOffs[i]).y0(d => yPos(d[0])).y1(d => yPos(d[1]));

            d3area.curve(this._curve());

            const join = select(this.$.areas)
                .selectAll('path')
                .data(y);

            // Enter
            join.enter()
                .append('path')
                .attr('part', 'area')
                .attr('legend', legend)
                .attr('d', d3area);

            // Update
            join
                .attr('legend', legend)
                .attr('d', d3area);

            // Exit
            join.exit().remove();
        }

        // Lines
        if (!this.hideLines) {
            const d3line = this.flipAxes
                ? line().x(d => yPos(d[1])).y((d, i) => xOffs[i])
                : line().x((d, i) => xOffs[i]).y(d => yPos(d[1]));

            d3line.curve(this._curve());

            const join = select(this.$.lines)
                .selectAll('path')
                .data(y);

            // Enter
            join.enter()
                .append('path')
                .attr('part', 'line')
                .attr('legend', legend)
                .attr('d', d3line);

            // Update
            join
                .attr('legend', legend)
                .attr('d', d3line);

            // Exit
            join.exit().remove();
        }

        // Markers
        if (this.marker && this.marker !== 'none') {
            const marker = `#ptc-${this.marker}`;
            const setPos = this._setMarkerPosStackedFunc(xOffs, yPos);

            const join = select(this.$.markers)
                .selectAll('.marker-legend')
                .data(y);

            // Exit
            join.exit().remove();

            // Update
            join
                .property('_index', serieIx)
                .attr('legend', legend);

            // Enter
            join.enter()
                .append('g')
                .attr('class', 'marker-legend')
                .property('_index', serieIx)
                .attr('legend', legend)
                .selectAll('[part=marker]')
                .data(d => d)
                .enter()
                .append('use')
                .attr('part', 'marker')
                .attr('href', marker)
                .property('_index', xIndex)
                .style('transform', setPos);

            // update / enter / exit for children
            const children = join
                .selectAll('[part=marker]')
                .data(d => d);

            children.exit().remove();

            children
                .attr('legend', legend)
                .attr('href', marker)
                .property('_index', xIndex)
                .style('transform', setPos);

            children.enter()
                .append('use')
                .attr('part', 'marker')
                .attr('href', marker)
                .property('_index', xIndex)
                .style('transform', setPos);
        }

        if (!this._hideValues(this.showValues)) {
            const {_yValues, vIndex} = this.__sampleStackedValues(y);
            const data = this.data;
            const setPos = this._setLabelPosStackedFunc(xOffs, yPos);

            // Note: don't convert processLabel to ES6 function - the this context is assigned by d3
            // eslint-disable-next-line no-inner-declarations
            function processLabel(d, i) {
                const valueIx = vIndex(i);

                //this.label = `${d[1] - d[0]}`;
                const v = data[xIndex(d, valueIx)];
                if (v !== undefined) {
                    this.label = `${__yv(v)[this.parentNode.__serieIx]}`;
                } else {
                    this.label = '';
                }

                this.style.transform = setPos(d, valueIx, this.clientWidth, this.clientHeight);
            }

            const join = select(this.$.values)
                .selectAll('.value-legend')
                .data(_yValues);

            // Exit
            join.exit().remove();

            // Update
            join.attr('legend', legend).property('__serieIx', d => d.index);

            // Enter
            join.enter()
                .append('div')
                .attr('class', 'value-legend')
                .attr('legend', legend)
                .property('__serieIx', d => d.index)
                .selectAll('[part=value]')
                .data(d => d)
                .enter()
                .append('ptcs-label')
                .attr('variant', 'label')
                .attr('part', 'value')
                .property('horizontalAlignment', 'center')
                .each(processLabel);

            // update / enter / exit for children
            const children = join
                .selectAll('[part=value]')
                .data(d => d);

            children.exit().remove();

            children
                .each(processLabel);

            children.enter()
                .append('ptcs-label')
                .attr('part', 'value')
                .property('horizontalAlignment', 'center')
                .each(processLabel);
        }
    }

    // Remove unmapped points and "sample" the x-axis if it is huge
    __filterData() {
        const xScale = this.xScale;
        const yScale = this.yScale;
        const deltaX = xScale.bandwidth ? xScale.bandwidth() / 2 : 0;
        const deltaY = yScale.bandwidth ? yScale.bandwidth() / 2 : 0;
        const maxX = (this.flipAxes ? this.clientHeight : this.clientWidth) + 1; // +1 for rounding errors
        const maxPoints = maxX / 3;
        const _data = [];

        // Compute x and y values and exclude all point that are unmapped
        this._data.forEach((serie, six) => {
            let _serie = [];
            serie.forEach((point, pix) => {
                const x = xScale(point[0]);
                if (x !== undefined && 0 <= x && x <= maxX) {
                    const y = yScale(point[1]);
                    if (y !== undefined) {
                        _serie.push([x + deltaX, y + deltaY, pix, point[1]]);
                    }
                }
            });

            // Do we need to sample the serie?
            if (maxPoints < _serie.length) {
                _serie = PTCS.sampleArray(_serie, maxPoints, (a, b) => a[3] - b[3]);
            }

            // Any remaining data to show?
            if (_serie.length) {
                _serie.serieIx = six;
                _data.push(_serie);
            }
        });

        return _data;
    }

    // Showing values is _very_ expensive, so they might need to be sampled down _significantly_
    __sampleValues(_data) {
        const num = _data.reduce((sum, serie) => sum + serie.length, 0);
        const wxh = this.clientWidth * this.clientHeight; // Chart area in px x px
        const max = wxh / (2 * 18 * 64); // Divide by twice the estimated area of a value label
        if (num <= max) {
            return _data; // Keep all values
        }

        // num * k = max
        const k = max / num;
        const r = [];
        _data.forEach(serie => {
            const maxPoints = serie.length * k;
            if (maxPoints > 0) {
                r.push(PTCS.sampleArray(serie, maxPoints));
            }
        });

        return r;
    }


    __refresh() {
        if (!(this._data instanceof Array) || !this.xScale || !this.yScale) {
            return;
        }

        const xPos = value => value;
        const yPos = value => value;
        const legend = (d, i) => `L${i + 1}`;
        const serieIx = d => d.serieIx;
        const subData = d => d;
        const pointIx = d => d[2];

        // Filter out non-mapped positions
        const _data = this.__filterData();

        this.__pickData = _data;

        // Areas
        if (this.showAreas) {
            // Find the origin line (bottom or top of the areas)
            const deltaY = this.yScale.bandwidth ? this.yScale.bandwidth() / 2 : 0;
            const yPos0 = this.yScale(0) + deltaY;
            const d3area = this.flipAxes
                ? area().x0(yPos0).x1(d => yPos(d[1])).y(d => xPos(d[0]))
                : area().x(d => xPos(d[0])).y0(yPos0).y1(d => yPos(d[1]));

            d3area.curve(this._curve());

            const join = select(this.$.areas)
                .selectAll('path')
                .data(_data);

            // Enter
            join.enter()
                .append('path')
                .attr('part', 'area')
                .attr('legend', legend)
                .attr('d', d3area);

            // Update
            join
                .attr('legend', legend)
                .attr('d', d3area);

            // Exit
            join.exit().remove();
        }

        // Lines
        if (!this.hideLines) {
            const d3line = this.flipAxes
                ? line().x(d => yPos(d[1])).y(d => xPos(d[0])).curve(this._curve())
                : line().x(d => xPos(d[0])).y(d => yPos(d[1])).curve(this._curve());

            const join = select(this.$.lines)
                .selectAll('path')
                .data(_data);

            // Enter
            join.enter()
                .append('path')
                .attr('part', 'line')
                .attr('legend', legend)
                .attr('d', d3line);

            // Update
            join // .transition()
                .attr('legend', legend)
                .attr('d', d3line);

            // Exit
            join.exit().remove();
        }

        // Markers
        if (this.marker && this.marker !== 'none') {
            const marker = `#ptc-${this.marker}`;
            const setPos = this._setMarkerPosFunc(xPos, yPos);

            const join = select(this.$.markers)
                .selectAll('.marker-legend')
                .data(_data);

            // Exit
            join.exit().remove();

            // Update
            join
                .attr('legend', legend)
                .property('_index', serieIx);

            // Enter
            join.enter()
                .append('g')
                .attr('class', 'marker-legend')
                .attr('legend', legend)
                .property('_index', serieIx)
                .selectAll('[part=marker]')
                .data(subData)
                .enter()
                .append('use')
                .attr('part', 'marker')
                .attr('href', marker)
                .property('_index', pointIx)
                .style('transform', setPos);

            // update / enter / exit for children
            const children = join
                .selectAll('[part=marker]')
                .data(subData);

            children.exit().remove();

            children
                .attr('legend', legend)
                .attr('href', marker)
                .property('_index', pointIx)
                .style('transform', setPos);

            children.enter()
                .append('use')
                .attr('part', 'marker')
                .attr('href', marker)
                .property('_index', pointIx)
                .style('transform', setPos);
        }

        // Values
        if (!this._hideValues(this.showValues)) {
            const _dataValues = this.__sampleValues(_data);
            const setPos = this._setLabelPosFunc(xPos, yPos);

            // eslint-disable-next-line no-inner-declarations
            function processLabel(d) {
                // Note: don't convert to ES5 function - the this context is assigned by d3
                this.label = d[3];
                this.style.transform = setPos(d, this.clientWidth, this.clientHeight);
            }

            const join = select(this.$.values)
                .selectAll('.value-legend')
                .data(_dataValues);

            // Exit
            join.exit().remove();

            // Update
            join.attr('legend', legend);

            // Enter
            join.enter()
                .append('div')
                .attr('class', 'value-legend')
                .attr('legend', legend)
                .selectAll('[part=value]')
                .data(subData)
                .enter()
                .append('ptcs-label')
                .attr('variant', 'label')
                .attr('part', 'value')
                .property('horizontalAlignment', 'center')
                .each(processLabel);

            // update / enter / exit for children
            const children = join
                .selectAll('[part=value]')
                .data(subData);

            children.exit().remove();

            children
                .each(processLabel);

            children.enter()
                .append('ptcs-label')
                .attr('part', 'value')
                .property('horizontalAlignment', 'center')
                .each(processLabel);
        }
    }

    // Return function that selects pickList items based on mouse position
    _hoverSelectFunc(x, y, list) {
        const xPos = this.flipAxes ? y : x;
        const yPos = this.flipAxes ? x : y;
        const rec = (item, serieIx) => ({valueIx: item[2], serieIx, x: item[0], y: item[1]});

        // target method: auto (over) || x (closests x) || y (closest y) || xy (closest)
        switch (this.cursorTarget) {
            case 'x': {
                let d0;
                return (item, serieIx) => {
                    const d = (item[0] - xPos) * (item[0] - xPos);
                    if (d0 === d) {
                        list.push(rec(item, serieIx));
                    } else if (!(d0 < d)) {
                        list.length = 0;
                        list.push(rec(item, serieIx));
                        d0 = d;
                    }
                };
            }
            case 'y': {
                let d0;
                return (item, serieIx) => {
                    const d = (item[1] - yPos) * (item[1] - yPos);
                    if (d0 === d) {
                        list.push(rec(item, serieIx));
                    } else if (!(d0 < d)) {
                        list.length = 0;
                        list.push(rec(item, serieIx));
                        d0 = d;
                    }
                };
            }
            case 'xy': {
                let d0;
                return (item, serieIx) => {
                    const d = (item[0] - xPos) * (item[0] - xPos) + (item[1] - yPos) * (item[1] - yPos);
                    if (!(d0 < d)) {
                        list[0] = rec(item, serieIx);
                        d0 = d;
                    }
                };
            }
            default: {
                const delta = 8 * this._getMarkerScale(); // Half the dimension of a marker. (Unscaled size is 16px)
                if (!this.cursorTarget || this.cursorTarget === 'auto') {
                    const [x1, x2] = [xPos - delta, xPos + delta];
                    const [y1, y2] = [yPos - delta, yPos + delta];

                    switch (this.cursorType) {
                        case 'x': {
                            return (item, serieIx) => {
                                if (x1 <= item[0] && item[0] <= x2) {
                                    list.push(rec(item, serieIx));
                                }
                            };
                        }
                        case 'y': {
                            return (item, serieIx) => {
                                if (y1 <= item[1] && item[1] <= y2) {
                                    list.push(rec(item, serieIx));
                                }
                            };
                        }
                        default: {
                            return (item, serieIx) => {
                                if (x1 <= item[0] && item[0] <= x2 && y1 <= item[1] && item[1] <= y2) {
                                    list.push(rec(item, serieIx));
                                }
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    _hoverPick(x, y) {
        if (!this.__pickData) {
            return;
        }

        function eqList(list1, list2) {
            if (!(list1 instanceof Array) || !(list2 instanceof Array)) {
                return false;
            }
            if (list1.length !== list2.length) {
                return false;
            }
            for (let i = 0; i < list1.length; i++) {
                const a = list1[i];
                const b = list2[i];
                if (a.valueIx !== b.valueIx || a.serieIx !== b.serieIx || a.x !== b.x || a.y !== b.y) {
                    return false;
                }
            }
            return true;
        }

        const list = [];
        const hoverSelect = this._hoverSelectFunc(x, y, list);
        if (!hoverSelect) {
            return;
        }
        this.__pickData.forEach(serie => serie.forEach(item => hoverSelect(item, serie.serieIx)));
        list.sort((a, b) => {
            if (a.valueIx !== b.valueIx) {
                return a.valueIx < b.valueIx ? -1 : 1;
            }
            if (a.serieIx !== b.serieIx) {
                return a.serieIx < b.serieIx ? -1 : 1;
            }
            return 0;
        });

        if (!eqList(list, this._pickList)) {
            this._pickList = list;
        }
    }

    _updatePickView(_pickList) {
        if (_pickList === this._oldPickList) {
            return;
        }
        this._oldPickList = _pickList;

        const marker = `#ptc-${(this.marker && this.marker !== 'none') ? this.marker : 'circle'}`;
        const scale = `scale(${this._getMarkerScale()})`;
        const legend = d => `L${d.serieIx + 1}`;
        const index = (d, i) => i;
        const setPos = this.flipAxes
            ? d => `translate(${d.y}px,${d.x}px) ${scale}`
            : d => `translate(${d.x}px,${d.y}px) ${scale}`;

        const join = select(this.$['hover-markers'])
            .selectAll('.pick-marker')
            .data(_pickList);

        // Enter
        join.enter()
            .append('g')
            .attr('class', 'marker-legend pick-marker')
            .attr('legend', legend)
            .style('display', '')
            .append('use')
            .attr('part', 'marker hover-marker')
            .property('_pickIndex', index)
            .attr('href', marker)
            .style('transform', setPos);

        // Update
        join.attr('legend', legend)
            .style('display', '')
            .select('use')
            .property('_pickIndex', index)
            .attr('href', marker)
            .style('transform', setPos);

        // Exit
        join.exit().style('display', 'none');
    }

    _updateTooltips(_pickList, hoverPick) {
        // Create picked markers first
        this._updatePickView(_pickList);

        // Then process the tooltip (when we have the markers)
        this._closeTooltip();
        if (!(_pickList instanceof Array) || _pickList.length <= 0) {
            return;
        }

        // Mouse hovers over single marker?
        if (hoverPick >= 0) {
            const p = _pickList[hoverPick];
            const el = this.shadowRoot.querySelector(`#hover-markers .pick-marker:nth-child(${hoverPick + 1})`);
            if (p && el) {
                if (this._isVisibleLegend(el)) {
                    this._openTooltip(el, p.valueIx, p.serieIx);
                }
            }
            return;
        }

        // Show all tooltips
        const arg = {hidePointer: true, shiftY: 16, shiftX: 32};
        const tooltips = this._pickList.map(d => this._tooltipText(d.valueIx, d.serieIx));
        this.__tooltipEl = this.$.hoverpoint;
        this._tooltipEnter(this.__tooltipEl, undefined, undefined, tooltips, arg);
    }

    // The mouse moves over the chart...
    _moveOverChart(ev) {
        const b = this.$.chart.getBoundingClientRect();
        const x = ev.clientX - b.left;
        const y = ev.clientY - b.top;

        // Track mouse motion with hoverlines
        this.$.hoverpoint.style.transform = `translate(${x}px,${y}px)`;
        if (this.flipAxes) {
            this.$.hoverxline.style.transform = `translate(0,${y}px)`;
            this.$.hoveryline.style.transform = `translate(${x}px,0)`;
        } else {
            this.$.hoverxline.style.transform = `translate(${x}px,0)`;
            this.$.hoveryline.style.transform = `translate(0px,${y}px)`;
        }
        this.$.hoveraggr.style.visibility = 'visible';

        // Debounce generation of hover pick list
        this.__hoverPickX = x;
        this.__hoverPickY = y;
        this.__onChart = true;
        if (!this.__hoverPick) {
            this.__hoverPick = true;
            requestAnimationFrame(() => {
                this.__hoverPick = false;
                if (this.__onChart) {
                    this._hoverPick(this.__hoverPickX, this.__hoverPickY);
                }
            });
        }

        // Hovering over hover-anchor?
        this.hoverPick = ev.target._pickIndex;
    }

    // Generate tooltip text for a data point
    _tooltipText(valueIx, serieIx) {
        const _legend = index => {
            if (this.legend && this.legend[index]) {
                return this.legend[index].label || this.legend[index];
            }
            return `Serie ${index + 1}`;
        };

        const v = this.data[valueIx];
        if (v === undefined) {
            return null;
        }
        return `${__xv(v)}, ${_legend(serieIx)}: ${__yv(v)[serieIx]}`;
    }

    // Show tooltip for a single data point
    _openTooltip(el, valueIx, serieIx, x, y) {
        if (el === this.__tooltipEl) {
            // No change
            return;
        }
        this._closeTooltip();
        // Open tooltip for marker
        if (el) {
            const tooltip = this._tooltipText(valueIx, serieIx);
            if (tooltip) {
                this.__tooltipEl = el;
                this._tooltipEnter(this.__tooltipEl, x, y, tooltip);
            }
        }
    }

    _closeTooltip() {
        if (this.__tooltipEl) {
            this._tooltipLeave(this.__tooltipEl);
            this.__tooltipEl = null;
        }
    }

    _clickOnChart(ev) {
        const _pickIndex = ev.target._pickIndex;
        if (this._pickList instanceof Array &&
            this._pickList[_pickIndex] &&
            (!(this.filterLegend instanceof Array) ||
            this.filterLegend instanceof Array &&
            this.filterLegend.includes(this._pickList[_pickIndex].serieIx))) {
            let point = this._pickList[_pickIndex];
            // _pickList and focus format are not compatible when axes are flipped
            if (this.flipAxes) {
                point = {valueIx: point.valueIx, serieIx: point.serieIx, x: point.y, y: point.x};
            }
            this._selectPoint(point);
        } else {
            this._selectPoint();
            // No marker was selected, handle region click
            this._clickRegion(ev.target);
        }
    }

    _clickRegion(el) {
        if (this.showAreas && this._isVisibleLegend(el)) {
            // Area was clicked
            const serieIx = Number(el.getAttribute('legend').substring(1)) - 1;
            const seriesData = [];
            if (!this.stackMethod || this.stackMethod === 'none') {
                // linechart, runchart, stepchart, areachart, scatterchart
                for (let i = 0; i < this._data[serieIx].length; i++) {
                    const v = this.data[i];
                    seriesData.push({serieIx: serieIx, valueIx: i, x: __xv(v), y: __yv(v)[serieIx]});
                }
            } else {
                // Stacking is enabled: wiggle, expand, diverging, silhouette
                for (let i = 0; i < this.data.length; i++) {
                    const v = this.data[i];
                    seriesData.push({serieIx: serieIx, valueIx: i, x: __xv(v), y: __yv(v)[serieIx]});
                }
            }
            this.dispatchEvent(new CustomEvent('series-click', {
                bubbles:  true,
                composed: true,
                detail:   seriesData
            }));
        }
    }

    _selectPoint(_selected) {
        const _old = this._selected;
        if (!_selected || (_old && _old.valueIx === _selected.valueIx && _old.serieIx === _selected.serieIx)) {
            this._selected = null;
            return;
        }
        this._selected = this.zoomSelect ? _selected : null;

        const {serieIx, valueIx} = _selected;
        const v = this.data[valueIx];
        const markerData = {serieIx, valueIx, x: __xv(v), y: __yv(v)[serieIx]};

        this._focusOn(_selected, true);

        this.dispatchEvent(new CustomEvent('series-click', {
            bubbles:  true,
            composed: true,
            detail:   markerData
        }));

        // Has a range been selected?
        if (!this.zoomSelect || !_old) {
            return;
        }

        // Report selected range
        const d = 8 * this._getMarkerScale(); // Half of the size
        const x1 = Math.min(_old.x - d, _selected.x - d);
        const y1 = Math.min(_old.y - d, _selected.y - d);
        const x2 = Math.max(_old.x + d, _selected.x + d);
        const y2 = Math.max(_old.y + d, _selected.y + d);

        // Clear selection and report range
        this._selected = null;

        this.dispatchEvent(new CustomEvent('selection', {
            bubbles:  true,
            composed: true,
            detail:   {x: x1, y: y1, w: x2 - x1, h: y2 - y1}
        }));
    }

    _selectedChanged(_selected) {
        const el = this.$.selmarker;
        if (!el) {
            return;
        }
        if (!_selected) {
            el.style.display = 'none';
            return;
        }

        // Selected body 2px thinner than the marker, which is 16px when unscaled
        const scale = (this._getMarkerScale() * 16 - 4) / 16;
        // Use same shape as existing marker, if any. Otherwise use circle
        const marker = (this.marker && this.marker !== 'none') ? this.marker : 'circle';

        el.setAttribute('href', `#ptc-${marker}`);
        el.style.transform = `translate(${_selected.x}px,${_selected.y}px) scale(${scale})`;
        el.style.display = 'block';
    }

    _traceSelected() {
        if (this._selected) {
            this._selected = this._pickData(this._selected.valueIx, this._selected.serieIx);
        }
    }

    // Dimension of chart or axis orientation may have changed
    _updateHoverline() {
        const b = this.$.chart.getBoundingClientRect();
        if (this.flipAxes) {
            this.$.hoverxline.setAttribute('d', `M0 0 L${b.width} 0`);
            this.$.hoveryline.setAttribute('d', `M0 0 L0 ${b.height}`);
        } else {
            this.$.hoverxline.setAttribute('d', `M0 0 L0 ${b.height}`);
            this.$.hoveryline.setAttribute('d', `M0 0 L${b.width} 0`);
        }
        switch (this.cursorType) {
            case 'x':
                this.$.hoverxline.style.visibility = '';
                this.$.hoveryline.style.visibility = 'hidden';
                break;
            case 'y':
                this.$.hoverxline.style.visibility = 'hidden';
                this.$.hoveryline.style.visibility = '';
                break;
            case 'xy':
                this.$.hoverxline.style.visibility = '';
                this.$.hoveryline.style.visibility = '';
                break;
            default:
                this.$.hoverxline.style.visibility = 'hidden';
                this.$.hoveryline.style.visibility = 'hidden';
        }
    }

    _dragStart(ev) {
        if ((!this.zoomDragX && !this.zoomDragY) || this.disabled) {
            return;
        }
        const x = ev.clientX;
        const y = ev.clientY;

        this._movedMouse = 0;
        const mmv = ev1 => this._mouseDrag(ev1, x, y);

        this.dragging = true;
        const mup = () => {
            this.dragging = false;
            window.removeEventListener('mousemove', mmv);
            window.removeEventListener('mouseup', mup);
            this._mouseUp();
        };

        window.addEventListener('mousemove', mmv);
        window.addEventListener('mouseup', mup);
    }

    _mouseDrag(ev, x0, y0) {
        const cntr = this.$.chart.getBoundingClientRect();
        const el = this.$.dragrect;
        const [dragX, dragY] = this.flipAxes
            ? [this.zoomDragY, this.zoomDragX]
            : [this.zoomDragX, this.zoomDragY];

        el.setAttribute('x', dragX ? Math.min(x0, ev.clientX) - cntr.left : 0);
        el.setAttribute('y', dragY ? Math.min(y0, ev.clientY) - cntr.top : 0);
        el.setAttribute('width', dragX ? Math.abs(x0 - ev.clientX) : cntr.width);
        el.setAttribute('height', dragY ? Math.abs(y0 - ev.clientY) : cntr.height);
        if (!this._movedMouse) {
            this._movedMouse = Date.now();
            el.style.display = 'block';
        }
    }

    _mouseUp() {
        const el = this.$.dragrect;
        el.style.display = '';
        if (!this._movedMouse) {
            return;
        }

        const x = +el.getAttribute('x');
        const y = +el.getAttribute('y');
        const w = +el.getAttribute('width');
        const h = +el.getAttribute('height');

        const [dragX, dragY] = this.flipAxes
            ? [this.zoomDragY, this.zoomDragX]
            : [this.zoomDragX, this.zoomDragY];

        if ((!dragX || w < 3) && (!dragY || h < 3)) {
            // Dragged less than 3px. Ignore
            return;
        }
        if (Date.now() - this._movedMouse < 150) {
            // Only dragged for 150ms. Ignore
            return;
        }

        // Clear selection and report range
        this._selected = null;

        this.dispatchEvent(new CustomEvent('selection', {
            bubbles:  true,
            composed: true,
            detail:   {x, y, w, h}
        }));
    }

    _focusOn(_focus, scroll) {
        const el = this.$.focusmarker;
        if (!el) {
            return;
        }
        this._focus = _focus;
        if (!_focus) {
            el.style.display = 'none';
            return;
        }

        // Use same shape as existing marker, if any. Otherwise use circle
        const marker = (this.marker && this.marker !== 'none') ? this.marker : 'circle';

        // Focus border is 2px wide and 1px away from the marker, which is 16px when unscaled
        const scale = (this._getMarkerScale() * 16 + 4) / 16;

        el.setAttribute('href', `#ptc-${marker}`);
        el.style.transform = `translate(${_focus.x}px,${_focus.y}px) scale(${scale})`;
        el.style.display = '';
        if (scroll) {
            el.scrollIntoViewIfNeeded();
        }
    }

    _pickData(valueIx, serieIx) {
        if (!this.xScale || !this.yScale) {
            return null;
        }
        let point;
        if (this._stackedData) {
            if (this._stackedData.y[serieIx] && this._stackedData.y[serieIx][valueIx]) {
                point = [
                    this._stackedData.x[valueIx],
                    this._stackedData.y[serieIx][valueIx][1]
                ];
            }
        } else {
            const serie = this._data[serieIx];
            point = serie ? serie[valueIx] : null;
        }
        if (point && point[0] !== undefined && point[1] !== undefined) {
            const deltaX = this.xScale.bandwidth ? this.xScale.bandwidth() / 2 : 0;
            const deltaY = this.yScale.bandwidth ? this.yScale.bandwidth() / 2 : 0;
            const x = this.xScale(point[0]) + deltaX;
            const y = this.yScale(point[1]) + deltaY;
            if (!isNaN(x) && !isNaN(y)) {
                return this.flipAxes ? {x: y, y: x, valueIx, serieIx} : {x, y, valueIx, serieIx};
            }
        }
        return null;
    }

    _pickDataEx(valueIx, serieIx) {
        let p = this._pickData(valueIx, serieIx);
        if (p) {
            return p;
        }
        if (valueIx === 0) {
            while (++valueIx < this.data.length) {
                p = this._pickData(valueIx, serieIx);
                if (p) {
                    return p;
                }
            }
        } else {
            while (valueIx-- > 0) {
                p = this._pickData(valueIx, serieIx);
                if (p) {
                    return p;
                }
            }
        }
        return null;
    }

    _checkFilteredSeries(current, next, limit) {
        if (!(this.filterLegend instanceof Array)) {
            return next;
        }
        if (this.filterLegend.includes(next)) {
            return next;
        }

        const nextEQLimit = next === limit;
        const currentBIGnext = current > next;
        let operation = nextEQLimit === currentBIGnext ? 1 : -1;

        let condition;
        if (nextEQLimit) {
            condition = (test) => test !== current;
        } else if (currentBIGnext) {
            condition = (test) => test >= limit;
        } else {
            condition = (test) => limit >= test;
        }

        let testSeries = next;
        while (condition(testSeries)) {
            testSeries = testSeries + operation;
            if (this.filterLegend.includes(testSeries)) {
                return testSeries;
            }
        }
        return current !== next ? current : -1;
    }

    _initTrackFocus() {
        // Handle focus ourself
        this._trackFocus(this, () => null);
    }

    // Update focus
    _traceFocus() {
        if (this._focus) {
            this._focusOn(this._pickData(this._focus.valueIx, this._focus.serieIx));
        }
    }

    _notifyFocus() {
        // Make sure a chart item has focus, if possible
        if (!this._focus) {
            const initSeries = this._checkFilteredSeries(0, 0, __yv(this.data[0]).length - 1);
            this._focusOn(this._pickData(0, initSeries), true);
        }
        if (this._focus) {
            this._openTooltip(this.$.focusmarker, this._focus.valueIx, this._focus.serieIx);
        }
    }

    _notifyBlur() {
        this._closeTooltip();
    }

    _keyDown(ev) {
        if (!this._focus) {
            const initSeries = this._checkFilteredSeries(0, 0, __yv(this.data[0]).length - 1);
            this._focusOn(this._pickData(0, initSeries));
            if (!this._focus) {
                return;
            }
        }
        let focus = null;
        let nextSeries;
        switch (ev.key) {
            case 'ArrowLeft':
                focus = this._pickData(this._focus.valueIx - 1, this._focus.serieIx);
                break;
            case 'ArrowRight':
                focus = this._pickData(this._focus.valueIx + 1, this._focus.serieIx);
                break;
            case 'ArrowUp':
                nextSeries = this._checkFilteredSeries(this._focus.serieIx, this._focus.serieIx - 1, 0);
                focus = this._pickData(this._focus.valueIx, nextSeries);
                break;
            case 'ArrowDown':
                nextSeries = this._checkFilteredSeries(this._focus.serieIx,
                    this._focus.serieIx + 1,
                    __yv(this.data[this._focus.valueIx]).length - 1);
                focus = this._pickData(this._focus.valueIx, nextSeries);
                break;
            case 'PageUp':
                nextSeries = this._checkFilteredSeries(this._focus.serieIx, 0, 0);
                focus = this._pickData(this._focus.valueIx, nextSeries);
                break;
            case 'PageDown':
                nextSeries = this._checkFilteredSeries(this._focus.serieIx,
                    __yv(this.data[this._focus.valueIx]).length - 1,
                    __yv(this.data[this._focus.valueIx]).length - 1);
                focus = this._pickData(this._focus.valueIx, nextSeries);
                break;
            case 'Home':
                focus = this._pickDataEx(0, this._focus.serieIx);
                break;
            case 'End':
                focus = this._pickDataEx(this.data.length - 1, this._focus.serieIx);
                break;
            case 'Enter':
            case ' ':
                // Select focused item
                this._selectPoint(this._focus);
                break;
            default:
                // Not handled
                return;
        }

        // We consumed this keyboard event. Don't propagate
        ev.preventDefault();

        if (focus) {
            this._focusOn(focus, true);
            this._closeTooltip();
            this._openTooltip(this.$.focusmarker, focus.valueIx, focus.serieIx);
        }
    }
};


PTCS.ChartCoreLine.curveMap = {
    linear: function() {
        return curveLinear;
    },
    basis: function() {
        return curveBasis;
    },
    bundle: function() {
        return curveBundle.beta(this.bundleBeta);
    },
    cardinal: function() {
        return curveCardinal.tension(this.cardinalTension);
    },
    'catmull-rom': function() {
        return curveCatmullRom.alpha(this.catmullRomAlpha);
    },
    'monotone-x': function() {
        return curveMonotoneX;
    },
    'monotone-y': function() {
        return curveMonotoneY;
    },
    natural: function() {
        return curveNatural;
    },
    step: function() {
        if (this.stepPosition === 'before') {
            return curveStepBefore;
        }
        if (this.stepPosition === 'after') {
            return curveStepAfter;
        }
        return curveStep;
    }
};

PTCS.ChartCoreLine.stackOrder = {
    // Returns the given series order
    auto: stackOrderNone,

    // Returns the reverse of the given series order
    reverse: stackOrderReverse,

    // Returns a series order such that the earliest series
    // (according to the maximum value) is at the bottom.
    appearance: stackOrderAppearance,

    // Returns a series order such that the smallest series
    // (according to the sum of values) is at the bottom.
    ascending: stackOrderAscending,

    // Returns a series order such that the largest series
    // (according to the sum of values) is at the bottom.
    descending: stackOrderDescending,

    // Returns a series order such that the earliest series
    // (according to the maximum value) are on the inside and the later
    // series are on the outside. This order is recommended for
    // streamgraphs in conjunction with the wiggle offset.
    insideout: stackOrderInsideOut
};

PTCS.ChartCoreLine.stackOffset = {
    // Applies a zero baseline
    auto: stackOffsetNone,

    // Applies a zero baseline and normalizes the values for each point such that the
    // topline is always one
    expand: stackOffsetExpand,

    // Positive values are stacked above zero, negative values are stacked below zero,
    // and zero values are stacked at zero
    diverging: stackOffsetDiverging,

    // Shifts the baseline down such that the center of the streamgraph is always at zero
    silhouette: stackOffsetSilhouette,

    // Shifts the baseline so as to minimize the weighted wiggle of layers. This offset is
    // recommended for streamgraphs in conjunction with the inside-out order
    wiggle: stackOffsetWiggle
};


customElements.define(PTCS.ChartCoreLine.is, PTCS.ChartCoreLine);

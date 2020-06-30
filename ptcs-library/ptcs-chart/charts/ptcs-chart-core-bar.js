import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import {min, max} from 'd3-array';
import {select} from 'd3-selection';
import {scaleBand} from 'd3-scale';

/* Don't need a warning to make sure I have not confused "=>" with ">=" or "<=" */
/* eslint-disable no-confusing-arrow */

function __date2str(d) {
    const lz = n => n <= 9 ? '0' + n : n;
    const lzz = n => n <= 99 ? '0' + lz(n) : n;
    // eslint-disable-next-line max-len
    return `${d.getFullYear()}-${lz(d.getMonth() + 1)}-${lz(d.getDate())} ${lz(d.getHours())}:${lz(d.getMinutes())}:${lz(d.getSeconds())}.${lzz(d.getMilliseconds())}`;
}

export function __xv(item) {
    const x = item[0];
    if (typeof x === 'string') {
        return x;
    }
    if (x instanceof Date) {
        return __date2str(x);
    }
    return JSON.stringify(x);
}

export function __yv(item) {
    return item[1];
}

PTCS.ChartCoreBar = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))))) {
    static get template() {
        return html`
        <style>
        :host {
            width: 100%;
            height: 100%;
            display: block;
            position: relative;

            --tick-offs-r:  var(--tick-offs-neg, -6px);
            --tick-offs-r2: var(--tick-offs-pos, 6px);
            --ptcs-tooltip-start-delay: 100;
        }

        #bars {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: hidden;
        }

        .group-bar {
            position: absolute;
        }

        :host(:not([flip-axes])) .group-bar {
            top: 0;
            bottom: 0;
        }

        :host([flip-axes]) .group-bar {
            left: 0;
            right: 0;
        }

        .bar {
            position: absolute;
            box-sizing: border-box;
            transition: opacity 1000ms;
        }

        .value {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            user-select: none;
        }

        :host([rotate-values]) .value {
            transform: rotate(180deg);
            --rotate-values: 180deg;
            writing-mode: vertical-lr;
            text-orientation: sideways;
        }

        :host([rotate-values]) [part=value] {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        :host(:not([show])) .value {
            display: none;
        }

        :host([hide-values]) .value {
            visibility: hidden;
        }

        :host([show]:not([flip-axes])) .value {
            left: 0;
            right: 0;
            flex-direction: column;
        }

        :host([show]:not([flip-axes]):not([reverse-y-axis])) .value {
            bottom: 0;
        }

        :host([show]:not([flip-axes])[reverse-y-axis]) .value {
            top: 0;
        }

        :host([show][flip-axes]) .value {
            top: 0;
            bottom: 0;
            flex-direction: row;
        }

        :host([show][flip-axes]:not([reverse-y-axis])) .value {
            left: 0;
        }

        :host([show][flip-axes][reverse-y-axis]) .value {
            right: 0;
        }

        /* FILTERING */
        div.filter .bar {
            opacity: 0;
        }
        div.filter.L1 .bar[legend=L1] {
            opacity: 1;
        }
        div.filter.L2 .bar[legend=L2] {
            opacity: 1;
        }
        div.filter.L3 .bar[legend=L3] {
            opacity: 1;
        }
        div.filter.L4 .bar[legend=L4] {
            opacity: 1;
        }
        div.filter.L5 .bar[legend=L5] {
            opacity: 1;
        }
        div.filter.L6 .bar[legend=L6] {
            opacity: 1;
        }
        div.filter.L7 .bar[legend=L7] {
            opacity: 1;
        }
        div.filter.L8 .bar[legend=L8] {
            opacity: 1;
        }
        div.filter.L9 .bar[legend=L9] {
            opacity: 1;
        }
        div.filter.L10 .bar[legend=L10] {
            opacity: 1;
        }
        div.filter.L11 .bar[legend=L11] {
            opacity: 1;
        }
        div.filter.L12 .bar[legend=L12] {
            opacity: 1;
        }
        div.filter.L13 .bar[legend=L13] {
            opacity: 1;
        }
        div.filter.L14 .bar[legend=L14] {
            opacity: 1;
        }
        div.filter.L15 .bar[legend=L15] {
            opacity: 1;
        }
        div.filter.L16 .bar[legend=L16] {
            opacity: 1;
        }
        div.filter.L17 .bar[legend=L17] {
            opacity: 1;
        }
        div.filter.L18 .bar[legend=L18] {
            opacity: 1;
        }
        div.filter.L19 .bar[legend=L19] {
            opacity: 1;
        }
        div.filter.L20 .bar[legend=L20] {
            opacity: 1;
        }
        div.filter.L21 .bar[legend=L21] {
            opacity: 1;
        }
        div.filter.L22 .bar[legend=L22] {
            opacity: 1;
        }
        div.filter.L23 .bar[legend=L23] {
            opacity: 1;
        }
        div.filter.L24 .bar[legend=L24] {
            opacity: 1;
        }

        :host(:not([show=outside])) #aggr,
        :host(:not([stack-method])) #aggr,
        :host([stack-method='grouped']) #aggr {
            display: none;
        }

        #aggr {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
        }

        #aggr .value {
            position: absolute;
            display: flex;
            overflow: hidden;
            flex-direction: column;
            align-items: center;
            /*background: rgba(0, 0, 0, 0.3);*/
            box-sizing: border-box;
        }

        :host(:not([flip-axes])) #aggr .value {
            flex-direction: column;
        }

        :host(:not([flip-axes]):not([reverse-y-axis])) #aggr [part=value-pos] {
            justify-content: flex-end;
            top: 0;
        }

        :host(:not([flip-axes]):not([reverse-y-axis])) #aggr [part=value-neg] {
            justify-content: flex-start;
            bottom: 0;
        }

        :host(:not([flip-axes])[reverse-y-axis]) #aggr [part=value-pos] {
            justify-content: flex-start;
            bottom: 0;
        }

        :host(:not([flip-axes])[reverse-y-axis]) #aggr [part=value-neg] {
            justify-content: flex-end;
            top: 0;
        }

        :host([flip-axes]:not([reverse-y-axis])) #aggr [part=value-pos] {
            flex-direction: row;
            justify-content: flex-start;
            right: 0;
        }

        :host([flip-axes]:not([reverse-y-axis])) #aggr [part=value-neg] {
            flex-direction: row;
            justify-content: flex-end;
            left: 0;
        }

        :host([flip-axes][reverse-y-axis]) #aggr [part=value-pos] {
            flex-direction: row;
            justify-content: flex-end;
            left: 0;
        }

        :host([flip-axes][reverse-y-axis]) #aggr [part=value-neg] {
            flex-direction: row;
            justify-content: flex-start;
            right: 0;
        }

        :host([rotate-values]) #aggr [part=value-pos] {
            justify-content: center;
            align-items: flex-start;
        }

        :host([rotate-values][reverse-y-axis]) #aggr [part=value-pos] {
            align-items: flex-end;
        }

        :host([rotate-values]) #aggr [part=value-neg] {
            justify-content: center;
            align-items: flex-end;
        }

        :host([rotate-values][reverse-y-axis]) #aggr [part=value-neg] {
            align-items: flex-start;
        }

        [part=selected] {
            position: absolute;
            pointer-events: none;
            box-sizing: border-box;
        }

        [part=drag-rect] {
            position: absolute;
            pointer-events: none;
            display: none;
            z-index: 11;
        }
        </style>

        <div id="bars" class\$="[[_filterBar(filterLegend)]]"
             on-mousemove="_mouseTooltip" on-mouseout="_leaveBars" on-click="_clickOnBars"
             on-mousedown="_mouseDown"
             ondragstart="return false"
             ><div id="selected" part="selected"
             ><div id="dragrect" part="drag-rect"></div></div></div>
        <div id="aggr"></div>`;
    }

    static get is() {
        return 'ptcs-chart-core-bar';
    }

    static get properties() {
        return {
            // data = [{label, data}, ...] where data is value || [value || [start-value, end-value], ...]
            data: Array,

            // Allow data to be massaged
            _data: {
                type:     Array,
                computed: '_computeData(data.*)',
                observer: '_dataChanged'
            },

            // Legend data, for tooltip
            legend: Array,

            // Minimun x value in data
            xMin: {
                type:   Number,
                notify: true
            },

            // Maximum x value in data
            xMax: {
                type:   Number,
                notify: true
            },

            // Minimun y value in data
            yMin: {
                type:   Number,
                notify: true
            },

            // Maximum y value in data
            yMax: {
                type:   Number,
                notify: true
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
                type:               Boolean,
                observer:           '_flipAxesChanged',
                reflectToAttribute: true
            },

            // Stack bars? falsy || 'auto' || 'expand'
            stackMethod: {
                type:               Object,
                observer:           '_stackMethodChanged',
                reflectToAttribute: true
            },

            // _data arranged for stacked display, if this.stackMethod
            _stackedData: Array,

            rotateLabels: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            // Show values for each bar?
            showValues: String,

            show: {
                computed:           '_computeShow(showValues)',
                observer:           '_showChanged',
                reflectToAttribute: true
            },

            hideValues: {
                type:               Boolean,
                observer:           '_hideValuesChanged',
                reflectToAttribute: true
            },

            rotateValues: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            reverseXAxis: {
                type:               Boolean,
                reflectToAttribute: true
            },

            reverseYAxis: {
                type:               Boolean,
                reflectToAttribute: true
            },

            filterLegend: {
                type:     Array,
                observer: '_filterLegendChanged'
            },

            // Padding
            groupPadding: {
                type:     String,
                observer: 'refresh'
            },

            // zoom by selecting two elements
            zoomSelect: {
                type: Boolean,
            },

            // X-zoom by dragging the mouse over the chart
            zoomDragX: {
                type: Boolean
            },

            // Y-zoom by dragging the mouse over the chart
            zoomDragY: {
                type: Boolean
            },

            // {el, serieIx, valueIx}
            _selected: {
                type:     Object,
                value:    null,
                observer: '_selectedChanged'
            },

            yAxisNumberFormat: {
                type:   String,
                notify: true
            }
        };
    }

    ready() {
        super.ready();

        // Keyboard navigation
        this.addEventListener('keydown', ev => this._keyDown(ev));
    }

    _clearElement(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    _computeShow(showValues) {
        if (showValues === 'inside' || showValues === 'outside' || showValues === 'inside-end') {
            return showValues;
        }
        if (showValues === '' || showValues === true) {
            return 'inside';
        }
        return false;
    }

    _computeData(cr) {
        // TODO: A bit ugly. Can it be made better?
        if (this._data === cr.base) {
            this.refreshData();
        }

        // No data massage at this time
        return cr.base;
    }

    _dataChanged(_data) {
        this.refreshData();
    }

    _stacked() {
        if ((!this.stackMethod && this.stackMethod !== '') || this.stackMethod === 'grouped') {
            return false;
        }

        // Only stack the data if it has more than one group
        return this._data instanceof Array && this._data.find(d => __yv(d).length > 1);
    }

    _filterLegendChanged() {
        if (this._stacked()) {
            this._clearChart();
            this.refreshData();
        }
    }

    _stackMethodChanged(/*stackMethod*/) {
        this._clearChart();
        this._computeMinMax();

        this.yAxisNumberFormat = '';

        if (this._stacked()) {
            this._computeStackedData();
        }
        this.refreshData();
    }

    /*
    _stacked100Changed(stacked100) {
        this._computeMinMax();
        this._computeStackedData();
        if (stacked100) {
            this.stacked = true;
        }
        this.refresh();
    }
    */

    // TODO: assign visiblity on common root instead of on each element
    _hideValuesChanged(hideValues) {
        if (!hideValues) {
            const list = this.$.bars.querySelectorAll('.value');
            for (let i = list.length - 1; i >= 0; i--) {
                list[i].style.visibility = '';
            }
        }
    }

    _computeMinMax() {
        const data = this._data;
        if (!(data instanceof Array)) {
            // Not ready
            return;
        }

        if (this.stackMethod === 'expand') {
            // Stacked 100%
            return;
        }

        let yMin;
        let yMax;

        if (this._stacked()) {
            const reduceMin = (t, v) => {
                if (v instanceof Array) {
                    return v[0] < 0 ? Math.min(t, v[0]) : t;
                }
                return v < 0 ? t + v : t;
            };
            const reduceMax = (t, v) => {
                if (v instanceof Array) {
                    return v[1] > 0 ? Math.max(t, v[1]) : t;
                }
                return v > 0 ? t + v : t;
            };
            yMin = min(data.map(d => __yv(d).reduce(reduceMin, 0)));
            yMax = max(data.map(d => __yv(d).reduce(reduceMax, 0)));
        } else {
            data.forEach(d => __yv(d).forEach(v => {
                if (v instanceof Array) {
                    if (!(yMin <= v[0])) {
                        yMin = v[0];
                    }
                    if (!(yMax >= v[1])) {
                        yMax = v[1];
                    }
                } else if (v !== undefined && v !== null) {
                    if (!(yMin <= v)) {
                        yMin = v;
                    }
                    if (!(yMax >= v)) {
                        yMax = v;
                    }
                }
            }));
        }

        const [xMin, xMax] = data.length ? [__xv(data[0]), __xv(data[data.length - 1])] : [];

        this.setProperties({yMin, yMax, xMin, xMax});
    }

    _extractLegend() {
        const depth = max(this._data.map(d => __yv(d).length));
        const c = [];
        for (let i = 0; i < depth; i++) {
            c.push(`L${i + 1}`);
        }
        this._legend = c;
    }

    _computeStackedData() {
        if (!this._stacked() || !this._legend) {
            return;
        }

        const filteredLegend = this.filterLegend;
        const depth = this._legend.length;
        const r = [];
        const aggrPos = [];
        const aggrNeg = [];

        if (this.stackMethod === 'expand') {
            const sum = (t, v) => (t + Math.abs(v));
            let vMin = 0, vMax = 0;

            this._data.forEach((d, index) => {
                const label = __xv(d);
                const filteredData = __yv(d).filter((v, i) => !filteredLegend || filteredLegend.includes(i));
                const tot = filteredData.reduce(sum, 0);
                let vNeg = 0;
                let vPos = 0;
                let posSum = 0;
                let negSum = 0;
                let posDataPushed = false;
                let negDataPushed = false;

                for (let i = 0; i < depth; i++) {
                    if (filteredLegend && !filteredLegend.includes(i)) {
                        continue;
                    }
                    const legend = `L${i + 1}`;
                    const v = __yv(d)[i];
                    if (!(v instanceof Array)) {
                        if (v < 0) {
                            const v0 = vNeg;
                            vNeg += tot ? 100 * v / tot : 0;
                            negSum += v;
                            r.push([legend, label, vNeg, v0, v]);
                            negDataPushed = true;
                        } else {
                            const v0 = vPos;
                            vPos += tot ? 100 * v / tot : 0;
                            posSum += v;
                            r.push([legend, label, v0, vPos, v]);
                            posDataPushed = true;
                        }
                    }
                }

                if (vMin > vNeg) {
                    vMin = vNeg;
                }

                if (vMax < vPos) {
                    vMax = vPos;
                }

                if (posDataPushed) {
                    aggrPos.push([label, posSum, vPos]);
                }

                if (negDataPushed) {
                    aggrNeg.push([label, negSum, vNeg]);
                }

                this.yAxisNumberFormat = '#%';
            });

            if (vMin !== 0 || vMax !== 0) {
                this.setProperties({yMin: vMin, yMax: vMax});
            } else {
                this.setProperties({yMin: 0, yMax: 100});
            }
        } else {
            this._data.forEach(d => {
                const label = __xv(d);
                let vNeg = 0;
                let vPos = 0;
                let dataPushed = false;

                for (let i = 0; i < depth; i++) {
                    if (filteredLegend && !filteredLegend.includes(i)) {
                        continue;
                    }

                    const legend = `L${i + 1}`;
                    const v = __yv(d)[i];
                    if (v instanceof Array) {
                        r.push([legend, label, v[0], v[1], `${v[0]}..${v[1]}`]);
                    } else if (v < 0) {
                        const v0 = vNeg;
                        vNeg += v;
                        r.push([legend, label, vNeg, v0, v]);
                    } else {
                        const v0 = vPos;
                        vPos += v;
                        r.push([legend, label, v0, vPos, v]);
                    }

                    dataPushed = true;
                }

                if (dataPushed) {
                    aggrPos.push([label, vPos]);
                    aggrNeg.push([label, vNeg]);
                }
            });
        }

        this._stackedAggrPos = aggrPos;
        this._stackedAggrNeg = aggrNeg;
        this._stackedData = r;
    }

    refreshData() {
        if (!(this._data instanceof Array)) {
            return;
        }
        this._computeMinMax();
        this._extractLegend();
        this._computeStackedData();
        this.refresh();
    }

    _flipAxesChanged(flipAxes) {
        this._clearElement(this.$.aggr);
        if (flipAxes) {
            this.rotateLabels = false;
            this.rotateValues = false;
            this.hideLabels = false;
        }
        this.refresh();
    }

    _showChanged(/*show*/) {
        this.refresh();
    }

    _clearChart() {
        const el1 = this.$.selected;
        el1.parentNode.removeChild(el1);
        const el2 = this.$.dragrect;
        el2.parentNode.removeChild(el2);
        this._clearElement(this.$.bars);
        this.$.bars.appendChild(el1);
        this.$.bars.appendChild(el2);
    }

    _filterBar(filterLegend) {
        if (!(filterLegend instanceof Array)) {
            return '';
        }
        return 'filter ' + filterLegend.map(item => `L${item + 1}`).join(' ');
    }

    // Convert padding format to d3
    _padding(padding) {
        const value = +padding;
        if (value > 0) {
            if (value < 100) {
                return value / 100;
            }
            return 1;
        }
        return 0;
    }

    _scaleLegend(width) {
        return scaleBand()
            .domain(this._legend)
            .range([0, width])
            .paddingInner(this._padding(this.groupPadding));
    }

    refresh() {
        if (this.__refreshOn) {
            return;
        }
        this.__refreshOn = true;
        requestAnimationFrame(() => {
            this.__refreshOn = false;
            this.__refresh();
            this._traceSelected();
            this._traceFocus();
        });
    }

    __refresh() {
        const scaleLabel = this.xScale;
        const scaleValue = this.yScale;

        if (!(this._data instanceof Array) || !scaleValue || !scaleLabel) {
            return;
        }

        const scaleLegend = this._scaleLegend(scaleLabel.bandwidth());
        const bandWidth = `${Math.max(scaleLabel.bandwidth(), 1)}px`;
        const bandWidth2 = `${Math.max(scaleLegend.bandwidth(), 1)}px`;
        const z = scaleValue(0);

        const arg = {scaleLabel, scaleValue, scaleLegend, bandWidth, bandWidth2};

        // Select d3 renderer
        if (this.reverseYAxis) {
            if (this.flipAxes) {
                if (this._stacked()) {
                    const chartWidth = this.clientWidth;
                    arg.leftValue = d => `${scaleValue(d[3])}px`;
                    arg.valueLeftPos = null;
                    arg.valueRightPos = this.stackMethod === 'expand'
                        ? d => `${chartWidth - scaleValue(d[2]) + 1}px`
                        : d => `${chartWidth - scaleValue(d[1]) + 1}px`;
                    arg.valueLeftNeg = this.stackMethod === 'expand'
                        ? d => `${scaleValue(d[2]) + 1}px`
                        : d => `${scaleValue(d[1]) + 1}px`;
                    arg.valueRightNeg = null;
                    this.__d3_vert_stack(arg);
                    this._checkHorizontalLabels(scaleLabel.bandwidth());
                } else {
                    const barLength = d => {
                        if (d instanceof Array) {
                            return Math.abs(scaleValue(d[1]) - scaleValue(d[0]));
                        }
                        return Math.abs(scaleValue(d) - z);
                    };

                    arg.barLength = d => `${barLength(d)}px`;

                    arg.leftValue = d => {
                        if (d instanceof Array) {
                            return `${scaleValue(d[1])}px`;
                        }
                        return `${d >= 0 ? scaleValue(d) : z}px`;
                    };

                    switch (this.show) {
                        case 'outside':
                            arg.outsideTranslate = d => `translate(-${barLength(d)}px, 0)`;
                            break;
                        case 'inside-end':
                            arg.outsideTranslate = function(d) {
                                return `translate(${Math.min(this.clientWidth - barLength(d), 0)}px, 0)`;
                            };
                            break;
                        default:
                            arg.outsideTranslate = '';
                    }

                    this.__d3_vert(arg);
                    this._checkHorizontalLabels(scaleLegend.bandwidth());
                }
            } else if (this._stacked()) {
                const chartHeight = this.clientHeight;
                arg.topValue = d => `${scaleValue(d[2])}px`;
                arg.valueTopPos = this.stackMethod === 'expand'
                    ? d => `${scaleValue(d[2])}px`
                    : d => `${scaleValue(d[1])}px`;
                arg.valueBottomPos = null;
                arg.valueTopNeg = null;
                arg.valueBottomNeg = this.stackMethod === 'expand'
                    ? d => `${chartHeight - scaleValue(d[2])}px`
                    : d => `${chartHeight - scaleValue(d[1])}px`;
                this.__d3_horz_stack(arg);
                this._checkVerticalLabels(scaleLabel.bandwidth(), true);
            } else {
                const barLength = d => {
                    if (d instanceof Array) {
                        return Math.abs(scaleValue(d[1]) - scaleValue(d[0]));
                    }
                    return Math.abs(scaleValue(d) - z);
                };

                arg.topValue = d => {
                    if (d instanceof Array) {
                        return `${scaleValue(d[0])}px`;
                    }
                    return `${d >= 0 ? z : scaleValue(d)}px`;
                };

                arg.barLength = d => `${barLength(d)}px`;

                const rotateLabels = this.rotateLabels;

                switch (this.show) {
                    case 'outside':
                        arg.outsideTranslate = d => `translate(0, ${barLength(d)}px) rotate(var(--rotate-values, 0deg))`;

                        arg.maxLabelLength = function(d) {
                            return `${z - barLength(d)}px`;
                        };

                        break;
                    case 'inside-end':
                        arg.outsideTranslate = function(d) {
                            const dim = rotateLabels ? this.clientWidth : this.clientHeight;
                            return `translate(0, ${Math.max(barLength(d) - dim, 0)}px) rotate(var(--rotate-values, 0deg))`;
                        };
                        break;
                    default:
                        arg.outsideTranslate = '';
                }

                this.__d3_horz(arg);
                this._checkVerticalLabels(scaleLegend.bandwidth(), false);
            }
        } else if (this.flipAxes) {
            if (this._stacked()) {
                const chartWidth = this.clientWidth;
                arg.leftValue = d => `${scaleValue(d[2])}px`;
                arg.valueLeftPos = this.stackMethod === 'expand'
                    ? d => `${scaleValue(d[2]) + 1}px`
                    : d => `${scaleValue(d[1]) + 1}px`;
                arg.valueRightPos = null;
                arg.valueLeftNeg = null;
                arg.valueRightNeg = this.stackMethod === 'expand'
                    ? d => `${chartWidth - scaleValue(d[2]) + 1}px`
                    : d => `${chartWidth - scaleValue(d[1]) + 1}px`;
                this.__d3_vert_stack(arg);
                this._checkHorizontalLabels(scaleLabel.bandwidth());
            } else {
                const barLength = d => {
                    if (d instanceof Array) {
                        return Math.abs(scaleValue(d[1]) - scaleValue(d[0]));
                    }
                    return Math.abs(scaleValue(d) - z);
                };

                arg.barLength = d => `${barLength(d)}px`;

                arg.leftValue = d => {
                    if (d instanceof Array) {
                        return `${scaleValue(d[0])}px`;
                    }
                    return `${d < 0 ? scaleValue(d) : z}px`;
                };

                switch (this.show) {
                    case 'outside':
                        arg.outsideTranslate = d => `translate(${barLength(d)}px, 0)`;
                        break;
                    case 'inside-end':
                        arg.outsideTranslate = function(d) {
                            return `translate(${Math.max(barLength(d) - this.clientWidth, 0)}px, 0)`;
                        };
                        break;
                    default:
                        arg.outsideTranslate = '';
                }

                this.__d3_vert(arg);
                this._checkHorizontalLabels(scaleLegend.bandwidth());
            }
        } else if (this._stacked()) {
            const chartHeight = this.clientHeight;
            arg.topValue = d => `${scaleValue(d[3]) + 1}px`;
            arg.valueTopPos = null;
            arg.valueBottomPos = this.stackMethod === 'expand'
                ? d => `${chartHeight - scaleValue(d[2])}px`
                : d => `${chartHeight - scaleValue(d[1])}px`;
            arg.valueTopNeg = this.stackMethod === 'expand'
                ? d => `${scaleValue(d[2])}px`
                : d => `${scaleValue(d[1])}px`;
            arg.valueBottomNeg = null;
            this.__d3_horz_stack(arg);
            this._checkVerticalLabels(scaleLabel.bandwidth(), true);
        } else {
            const barLength = d => {
                if (d instanceof Array) {
                    return Math.abs(scaleValue(d[1]) - scaleValue(d[0]));
                }
                return Math.abs(scaleValue(d) - z);
            };

            arg.topValue = d => {
                if (d instanceof Array) {
                    return `${scaleValue(d[1])}px`;
                }
                return `${scaleValue(d >= 0 ? d : 0)}px`;
            };

            arg.barLength = d => `${barLength(d)}px`;

            const rotateLabels = this.rotateLabels;

            switch (this.show) {
                case 'outside':
                    arg.outsideTranslate = d => `translate(0, -${barLength(d)}px) rotate(var(--rotate-values, 0deg))`;

                    arg.maxLabelLength = function(d) {
                        return `${z - barLength(d)}px`;
                    };

                    break;
                case 'inside-end':
                    arg.outsideTranslate = function(d) {
                        const dim = rotateLabels ? this.clientWidth : this.clientHeight;
                        return `translate(0, ${Math.min(dim - barLength(d), 0)}px) rotate(var(--rotate-values, 0deg))`;
                    };
                    break;
                default:
                    arg.outsideTranslate = '';
            }

            this.__d3_horz(arg);
            this._checkVerticalLabels(scaleLegend.bandwidth(), false);
        }
    }

    __d3_horz({scaleLabel, scaleLegend, bandWidth, bandWidth2, topValue, barLength, outsideTranslate, maxLabelLength}) {
        const groupBarX = d => `translate(${scaleLabel(__xv(d))}px,1px)`;
        const groupBarHide = d => (scaleLabel(__xv(d)) === undefined ? 'none' : '');
        const getIndex = (d, i) => i;

        // JOIN new data with old elements
        const join = select(this.$.bars)
            .selectAll('div.group-bar')
            .data(this._data);

        // EXIT old elements not present in new data
        join.exit().remove();

        // UPDATE old elements present in new data
        join
            .style('width', bandWidth)
            .style('height', null)
            .style('display', groupBarHide)
            .style('transform', groupBarX)
            .property('_index', getIndex);

        // ENTER new elements present in new data
        join.enter()
            .append('div')
            .attr('class', 'group-bar')
            .style('width', bandWidth)
            .style('display', groupBarHide)
            .style('transform', groupBarX)
            .property('_index', getIndex)
            .selectAll('.bar')
            .data(d => __yv(d))
            .enter()
            .append('div')
            .attr('class', 'bar')
            .attr('part', 'bar')
            .attr('legend', (d, i) => `L${i + 1}`)
            .style('width', bandWidth2)
            .style('left', (d, i) => `${scaleLegend('L' + (i + 1))}px`)
            .style('top', d => topValue(d))
            .style('height', d => barLength(d))
            .append('div')
            .attr('class', 'value')
            .style('transform', outsideTranslate)
            .append('div')
            .attr('part', 'value')
            .text(d => (d instanceof Array ? d[1] : d))
            .style('max-height', maxLabelLength);

        // update / enter / exit for children
        const children = join
            .selectAll('.bar')
            .data(d => __yv(d));

        children
            .attr('legend', (d, i) => `L${i + 1}`)
            .style('width', bandWidth2)
            .style('left', (d, i) => `${scaleLegend('L' + (i + 1))}px`)
            .style('top', d => topValue(d))
            .style('height', d => barLength(d))
            .select('.value')
            .style('transform', outsideTranslate)
            .select('div')
            .text(d => (d instanceof Array ? d[1] : d));

        children.exit().remove();

        children.enter()
            .append('div')
            .attr('class', 'bar')
            .attr('part', 'bar')
            .attr('legend', (d, i) => `L${i + 1}`)
            .style('width', bandWidth2)
            .style('left', (d, i) => `${scaleLegend('L' + (i + 1))}px`)
            .style('top', d => topValue(d))
            .style('height', d => barLength(d))
            .append('div')
            .attr('class', 'value')
            .style('transform', outsideTranslate)
            .append('div')
            .attr('part', 'value')
            .text(d => (d instanceof Array ? d[1] : d));
    }

    __d3_vert({scaleLabel, scaleLegend, bandWidth, bandWidth2, leftValue, barLength, outsideTranslate}) {
        const groupBarY = d => `translate(0,${scaleLabel(__xv(d))}px)`;
        const groupBarHide = d => (scaleLabel(__xv(d)) === undefined ? 'none' : '');
        const getIndex = (d, i) => i;

        // JOIN new data with old elements
        const join = select(this.$.bars)
            .selectAll('div.group-bar')
            .data(this._data);

        // EXIT old elements not present in new data
        join.exit().remove();

        // UPDATE old elements present in new data
        join
            .style('width', null)
            .style('height', bandWidth)
            .style('display', groupBarHide)
            .style('transform', groupBarY)
            .property('_index', getIndex);

        // ENTER new elements present in new data
        join.enter()
            .append('div')
            .attr('class', 'group-bar')
            .style('height', bandWidth)
            .style('display', groupBarHide)
            .style('transform', groupBarY)
            .property('_index', getIndex)
            .selectAll('.bar')
            .data(d => __yv(d))
            .enter()
            .append('div')
            .attr('class', 'bar')
            .attr('part', 'bar')
            .attr('legend', (d, i) => `L${i + 1}`)
            .style('height', bandWidth2)
            .style('top', (d, i) => `${scaleLegend('L' + (i + 1))}px`)
            .style('left', leftValue)
            .style('width', barLength)
            .append('div')
            .attr('class', 'value')
            .style('transform', outsideTranslate)
            .append('div')
            .attr('part', 'value')
            .text(d => (d instanceof Array ? d[1] : d));

        // update / enter / exit for children
        const children = join
            .selectAll('.bar')
            .data(d => __yv(d));

        children
            .attr('legend', (d, i) => `L${i + 1}`)
            .style('height', bandWidth2)
            .style('top', (d, i) => `${scaleLegend('L' + (i + 1))}px`)
            .style('left', leftValue)
            .style('width', barLength)
            .select('.value')
            .style('transform', outsideTranslate)
            .select('div')
            .text(d => (d instanceof Array ? d[1] : d));

        children.exit().remove();

        children.enter()
            .append('div')
            .attr('class', 'bar')
            .attr('part', 'bar')
            .style('height', bandWidth2)
            .style('top', (d, i) => `${scaleLegend('L' + (i + 1))}px`)
            .style('left', leftValue)
            .style('width', barLength)
            .append('div')
            .attr('class', 'value')
            .style('transform', outsideTranslate)
            .append('div')
            .attr('part', 'value')
            .text(d => (d instanceof Array ? d[1] : d));
    }

    __d3_horz_stack({scaleValue, scaleLabel, bandWidth, topValue, valueTopPos, valueBottomPos, valueTopNeg, valueBottomNeg}) {
        const barHide = d => (scaleLabel(d[1]) === undefined ? 'none' : '');
        const aggrHide = d => (scaleLabel(d[0]) === undefined ? 'none' : '');
        const barHeight = d => `${Math.abs(scaleValue(d[3]) - scaleValue(d[2]))}px`;
        const leftValue = d => `${scaleLabel(d[1])}px`;

        const join = select(this.$.bars)
            .selectAll('div.bar')
            .data(this._stackedData);

        // EXIT old elements not present in new data
        join.exit().remove();

        // UPDATE old elements present in new data
        join.attr('legend', d => d[0])
            .property('_xvalue', d => d[1])
            .style('width', bandWidth)
            .style('height', barHeight)
            .style('left', leftValue)
            .style('top', topValue)
            .style('display', barHide)
            .select('.value')
            .style('transform', '')
            .select('div')
            .text(d => d[4]);

        // ENTER new elements present in new data
        join.enter()
            .append('div')
            .attr('class', 'bar')
            .attr('part', 'bar')
            .attr('legend', d => d[0])
            .property('_xvalue', d => d[1])
            .style('width', bandWidth)
            .style('height', barHeight)
            .style('left', leftValue)
            .style('top', topValue)
            .style('display', barHide)
            .append('div')
            .attr('class', 'value')
            .style('transform', '')
            .append('div')
            .attr('part', 'value')
            .text(d => d[4]);

        if (this.show === 'outside') {
            const join2 = select(this.$.aggr)
                .selectAll('[part=value-pos]')
                .data(this._stackedAggrPos);

            // EXIT old elements not present in new data
            join2.exit().remove();

            // UPDATE old elements present in new data
            join2
                .style('width', bandWidth)
                .style('left', d => `${scaleLabel(d[0])}px`)
                .style('top', valueTopPos)
                .style('bottom', valueBottomPos)
                .style('display', aggrHide)
                .select('div')
                .text(d => d[1]);

            // ENTER new elements present in new data
            join2.enter()
                .append('div')
                .attr('class', 'value')
                .attr('part', 'value-pos')
                .style('width', bandWidth)
                .style('left', d => `${scaleLabel(d[0])}px`)
                .style('top', valueTopPos)
                .style('bottom', valueBottomPos)
                .style('display', aggrHide)
                .append('div')
                .attr('part', 'value')
                .text(d => d[1]);

            const join3 = select(this.$.aggr)
                .selectAll('[part=value-neg]')
                .data(this._stackedAggrNeg);

            // EXIT old elements not present in new data
            join3.exit().remove();

            // UPDATE old elements present in new data
            join3
                .style('width', bandWidth)
                .style('left', d => `${scaleLabel(d[0])}px`)
                .style('top', valueTopNeg)
                .style('bottom', valueBottomNeg)
                .style('display', aggrHide)
                .select('div')
                .text(d => d[1]);

            // ENTER new elements present in new data
            join3.enter()
                .append('div')
                .attr('class', 'value')
                .attr('part', 'value-neg')
                .style('width', bandWidth)
                .style('left', d => `${scaleLabel(d[0])}px`)
                .style('top', valueTopNeg)
                .style('bottom', valueBottomNeg)
                .style('display', aggrHide)
                .append('div')
                .attr('part', 'value')
                .text(d => d[1]);
        }
    }

    __d3_vert_stack({scaleValue, scaleLabel, bandWidth, leftValue, valueLeftPos, valueRightPos, valueLeftNeg, valueRightNeg}) {
        const barHide = d => (scaleLabel(d[1]) === undefined ? 'none' : '');
        const aggrHide = d => (scaleLabel(d[0]) === undefined ? 'none' : '');
        const barTop = d => `${scaleLabel(d[1])}px`;
        const barWidth = d => `${Math.abs(scaleValue(d[3]) - scaleValue(d[2]))}px`;

        const join = select(this.$.bars)
            .selectAll('div.bar')
            .data(this._stackedData);

        // EXIT old elements not present in new data
        join.exit().remove();

        // UPDATE old elements present in new data
        join
            .attr('legend', d => d[0])
            .property('_xvalue', d => d[1])
            .style('height', bandWidth)
            .style('width', barWidth)
            .style('top', barTop)
            .style('left', leftValue)
            .style('display', barHide)
            .select('.value')
            .style('transform', '')
            .select('div')
            .text(d => d[4]);

        // ENTER new elements present in new data
        join.enter()
            .append('div')
            .attr('class', 'bar')
            .attr('part', 'bar')
            .attr('legend', d => d[0])
            .property('_xvalue', d => d[1])
            .style('height', bandWidth)
            .style('width', barWidth)
            .style('top', barTop)
            .style('left', leftValue)
            .style('display', barHide)
            .append('div')
            .attr('class', 'value')
            .style('transform', '')
            .append('div')
            .attr('part', 'value')
            .text(d => d[4]);

        if (this.show === 'outside') {
            const join2 = select(this.$.aggr)
                .selectAll('[part=value-pos]')
                .data(this._stackedAggrPos);

            // EXIT old elements not present in new data
            join2.exit().remove();

            // UPDATE old elements present in new data
            join2
                .style('height', bandWidth)
                .style('top', d => `${scaleLabel(d[0])}px`)
                .style('left', valueLeftPos)
                .style('right', valueRightPos)
                .style('display', aggrHide)
                .select('div')
                .text(d => d[1]);

            // ENTER new elements present in new data
            join2.enter()
                .append('div')
                .attr('class', 'value')
                .attr('part', 'value-pos')
                .style('height', bandWidth)
                .style('top', d => `${scaleLabel(d[0])}px`)
                .style('left', valueLeftPos)
                .style('right', valueRightPos)
                .style('display', aggrHide)
                .append('div')
                .attr('part', 'value')
                .text(d => d[1]);

            const join3 = select(this.$.aggr)
                .selectAll('[part=value-neg]')
                .data(this._stackedAggrNeg);

            // EXIT old elements not present in new data
            join3.exit().remove();

            // UPDATE old elements present in new data
            join3
                .style('height', bandWidth)
                .style('top', d => `${scaleLabel(d[0])}px`)
                .style('left', valueLeftNeg)
                .style('right', valueRightNeg)
                .style('display', aggrHide)
                .select('div')
                .text(d => d[1]);

            // ENTER new elements present in new data
            join3.enter()
                .append('div')
                .attr('class', 'value')
                .attr('part', 'value-neg')
                .style('height', bandWidth)
                .style('top', d => `${scaleLabel(d[0])}px`)
                .style('left', valueLeftNeg)
                .style('right', valueRightNeg)
                .style('display', aggrHide)
                .append('div')
                .attr('part', 'value')
                .text(d => d[1]);
        }
    }

    _checkHideOverflows(list, barWidth, hideOverflows) {
        if (this.rotateValues) {
            let w = 0;
            for (let i = 0; i < list.length && w === 0; i++) {
                w = list[i].firstChild.scrollWidth;
            }
            this.hideValues = w > 1.3 * barWidth; // Allow 30% overflow
        } else {
            this.hideValues = false;
        }

        if (!hideOverflows || this.hideValues) {
            return;
        }

        for (let i = list.length - 1; i >= 0; i--) {
            const el = list[i];
            const ch = el.parentNode.clientHeight;
            const sw = el.firstChild.clientWidth;
            const sh = el.firstChild.clientHeight;
            const overflows = sw > barWidth || sh > ch;
            el.style.visibility = overflows ? 'hidden' : '';
        }
    }

    _checkVerticalLabels(barWidth, hideOverflows) {
        if (!this.show) {
            return;
        }
        this.__cl = this.__cl ? this.__cl + 1 : 1;
        const __cl = this.__cl;
        requestAnimationFrame(() => {
            if (__cl !== this.__cl) {
                return; // This processing is obsolete
            }
            const list1 = this.$.bars.querySelectorAll('.value');
            const list2 = this.$.aggr.querySelectorAll('.value');
            const test = this.rotateValues
                // Test if rotated labels needs to stay rotated
                ? el => el.firstChild.clientHeight > barWidth
                // Test if non-rotated labels still needs to rotate
                : el => el.firstChild.clientWidth > barWidth;
            let rotateValues = false;
            if (this.show === 'outside') {
                for (let i = list2.length - 1; i >= 0; i--) {
                    if (test(list2[i])) {
                        rotateValues = true;
                        break;
                    }
                }
            }
            if (!rotateValues) {
                for (let i = list1.length - 1; i >= 0; i--) {
                    if (test(list1[i])) {
                        rotateValues = true;
                        break;
                    }
                }
            }

            if (this.rotateValues !== rotateValues) {
                // Rotate first, then check if labels should be hidden
                this.rotateValues = rotateValues;
                requestAnimationFrame(() => this._checkHideOverflows(list1, barWidth, hideOverflows));
            } else {
                this._checkHideOverflows(list1, barWidth, hideOverflows);
            }
        });
    }

    _checkHorizontalLabels(barHeight) {
        if (!this.show) {
            return;
        }

        // Find first non-hidden value
        const list1 = this.$.bars.querySelectorAll('.value');
        let h = 0;
        for (let i = 0; i < list1.length && h === 0; i++) {
            h = list1[i].firstChild.clientHeight;
        }
        this.hideValues = h > 1.5 * barHeight; // Allow values to overlap 50% (its mainly leading anyway)
        if (this.hideValues) {
            return;
        }
        this.__cl = this.__cl ? this.__cl + 1 : 1;
        const __cl = this.__cl;
        requestAnimationFrame(() => {
            if (__cl !== this.__cl) {
                return; // This processing is obsolete
            }
            for (let i = list1.length - 1; i >= 0; i--) {
                const el = list1[i];
                const overflows = el.firstChild.clientWidth > el.parentNode.clientWidth || el.firstChild.clientHeight > barHeight;
                el.style.visibility = overflows ? 'hidden' : '';
            }
            if (this._stacked()) {
                const list2 = this.$.bars.querySelectorAll('.aggr');
                for (let i = list2.length - 1; i >= 0; i--) {
                    const el = list2[i];
                    const overflows = el.firstChild.clientWidth > el.clientWidth || el.firstChild.clientHeight > barHeight;
                    el.style.visibility = overflows ? 'hidden' : '';
                }
            }
        });
    }

    _getBarEl(el) {
        if (!el || !el.getAttribute('part') === 'bar' || !el.parentNode) {
            return null;
        }
        let valueIx = el.parentNode._index;
        if (!(valueIx >= 0)) {
            const _xvalue = el._xvalue;
            if (!_xvalue) {
                return null;
            }
            valueIx = this._data.findIndex(d => __xv(d) === _xvalue);
            if (!(valueIx >= 0)) {
                return null;
            }
        }
        const legend = el.getAttribute('legend');
        if (typeof legend !== 'string' || legend[0] !== 'L') {
            return null;
        }
        const serieIx = +legend.substring(1);
        if (!(serieIx >= 1)) {
            return null;
        }
        return {el, serieIx: serieIx - 1, valueIx};
    }

    _mouseTooltip(ev) {
        const bar = this._getBarEl(ev.target);
        if (!bar) {
            this._closeTooltip();
            return;
        }
        const {el, serieIx, valueIx} = bar;
        if (el === this.__tooltipEl) {
            return;
        }
        this._closeTooltip();

        const _legend = index => {
            if (this.legend && this.legend[index]) {
                return this.legend[index].label || this.legend[index];
            }
            return `Serie ${index + 1}`;
        };

        const v = this.data[valueIx];

        // Open tooltip for marker
        this.__tooltipEl = el;
        const tooltip = `${__xv(v)}, ${_legend(serieIx)}: ${__yv(v)[serieIx]}`;
        this._tooltipEnter(this.__tooltipEl, ev.clientX, ev.clientY, tooltip);
    }

    _closeTooltip() {
        if (this.__tooltipEl) {
            this._tooltipLeave(this.__tooltipEl);
            this.__tooltipEl = null;
        }
    }

    _leaveBars() {
        this._closeTooltip();
    }

    _clickOnBars(ev) {
        const _old = this._selected;
        const _selected = this._getBarEl(ev.target);
        if (!_selected || (_old && _old.el === _selected.el)) {
            this._selected = null;
            return;
        }
        this._selected = this.zoomSelect ? _selected : null;
        this._focusOn(_selected);

        const {serieIx, valueIx} = _selected;
        const v = this.data[valueIx];
        const barData = {serieIx, valueIx, x: __xv(v), y: __yv(v)[serieIx]};

        this.dispatchEvent(new CustomEvent('series-click', {
            bubbles:  true,
            composed: true,
            detail:   barData
        }));

        // Has a range been selected?
        if (!this.zoomSelect || !_old) {
            return;
        }

        // Report selected range
        const b1 = _old.el.getBoundingClientRect();
        const b2 = _selected.el.getBoundingClientRect();
        const cntr = this.$.bars.getBoundingClientRect();
        const x1 = Math.min(b1.left, b2.left) - cntr.left;
        const y1 = Math.min(b1.top, b2.top) - cntr.top;
        const x2 = Math.max(b1.left + b1.width, b2.left + b2.width) - cntr.left;
        const y2 = Math.max(b1.top + b1.height, b2.top + b2.height) - cntr.top;

        // Clear selection and report range
        this._selected = null;

        this.dispatchEvent(new CustomEvent('selection', {
            bubbles:  true,
            composed: true,
            detail:   {x: x1, y: y1, w: x2 - x1, h: y2 - y1}
        }));
    }

    _selectedChanged(_selected) {
        const el = this.$.selected;
        if (!el) {
            return;
        }
        if (!_selected) {
            el.style.display = 'none';
            return;
        }
        const b0 = this.getBoundingClientRect();
        const b = _selected.el.getBoundingClientRect();
        const padding = 'var(--ptcs-selected-bar-overlay--padding, 0px)';

        el.style.left = `calc(${b.left - b0.left}px + ${padding})`;
        el.style.top = `calc(${b.top - b0.top}px + ${padding})`;
        el.style.width = `calc(${b.width}px - 2 * ${padding})`;
        el.style.height = `calc(${b.height}px - 2 * ${padding})`;
        el.style.display = 'block';
    }

    _traceSelected() {
        if (!this._selected) {
            return;
        }
        const _selected = this._getBarEl(this._selected.el);
        if (!_selected) {
            this._selected = null;
            return;
        }
        if (_selected.serieIx === this._selected.serieIx && _selected.valueIx === this._selected.valueIx) {
            // Same marker element is mapped to data point
            this._selected = _selected; // Update location
            return;
        }
        // For now, just unselect it
        this._selected = null;
    }

    _mouseDown(ev) {
        if (!this.zoomDragX && !this.zoomDragY) {
            return;
        }
        const x = ev.clientX;
        const y = ev.clientY;

        this._movedMouse = null;
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
        const cntr = this.$.bars.getBoundingClientRect();
        const s = this.$.dragrect.style;
        if (!this._movedMouse) {
            s.display = 'block';
        }
        const [dragX, dragY] = this.flipAxes
            ? [this.zoomDragY, this.zoomDragX]
            : [this.zoomDragX, this.zoomDragY];

        this._movedMouse = {
            x: dragX ? Math.min(x0, ev.clientX) - cntr.left : 0,
            y: dragY ? Math.min(y0, ev.clientY) - cntr.top : 0,
            w: dragX ? Math.abs(x0 - ev.clientX) : cntr.width,
            h: dragY ? Math.abs(y0 - ev.clientY) : cntr.height,
            t: this._movedMouse ? this._movedMouse.t : Date.now()
        };

        s.left = `${this._movedMouse.x}px`;
        s.top = `${this._movedMouse.y}px`;
        s.width = `${this._movedMouse.w}px`;
        s.height = `${this._movedMouse.h}px`;
    }

    _mouseUp() {
        const s = this.$.dragrect.style;
        s.display = '';
        if (!this._movedMouse) {
            return;
        }

        const x1 = this._movedMouse.x;
        const y1 = this._movedMouse.y;
        const x2 = x1 + this._movedMouse.w;
        const y2 = y1 + this._movedMouse.h;

        const [dragX, dragY] = this.flipAxes
            ? [this.zoomDragY, this.zoomDragX]
            : [this.zoomDragX, this.zoomDragY];

        if ((!dragX || Math.abs(x2 - x1) < 3) && (!dragY || Math.abs(y2 - y1) < 3)) {
            // Dragged less than 3 pixels. Ignore
            return;
        }
        if (Date.now() - this._movedMouse.t < 150) {
            // Only dragged for 150ms. Ignore
            return;
        }

        this.dispatchEvent(new CustomEvent('selection', {
            bubbles:  true,
            composed: true,
            detail:   this._movedMouse
        }));
    }

    // Set the focused element
    _focusOn(focus) {
        if (focus instanceof Element) {
            focus = this._getBarEl(focus);
        }
        if (this._focus) {
            if (focus && focus.el === this._focus.el) {
                this._focus = focus; // In case the element is reused with new data
                return focus;
            }
            this._focus.el.removeAttribute('focus');
        }
        this._focus = focus;
        if (this._focus) {
            this._focus.el.setAttribute('focus', '');
        }
        return focus;
    }

    _pickBar(valueIx, serieIx) {
        // Naive (simple) approach: check all elements
        const pick = el => {
            if (el.getAttribute('part') === 'bar') {
                const bar = this._getBarEl(el);
                return bar && valueIx === bar.valueIx && serieIx === bar.serieIx ? bar : null;
            }
            for (el = el.firstChild; el; el = el.nextSibling) {
                const bar = pick(el);
                if (bar) {
                    return bar;
                }
            }
            return null;
        };

        return pick(this.$.bars);
    }

    _traceFocus() {
        if (this._focus) {
            this._focusOn(this._pickBar(this._focus.valueIx, this._focus.serieIx));
        }
    }


    _initTrackFocus() {
        this._trackFocus(this, () => this._focus ? this._focus.el : null);
    }

    _notifyFocus() {
        // Make sure a chart item has focus, if possible
        if (!this._focus) {
            this._focusOn(this._pickBar(0, 0));
        }
        if (this._focus) {
            this._focus.el.scrollIntoViewIfNeeded();
            this._mouseTooltip({target: this._focus.el});
        }
    }

    _notifyBlur() {
        this._closeTooltip();
    }

    _keyDown(ev) {
        if (!this._focus) {
            return;
        }
        let focus = null;
        switch (ev.key) {
            case 'ArrowLeft':
                focus = this._pickBar(this._focus.valueIx - 1, this._focus.serieIx);
                break;
            case 'ArrowRight':
                focus = this._pickBar(this._focus.valueIx + 1, this._focus.serieIx);
                break;
            case 'ArrowUp':
                focus = this._pickBar(this._focus.valueIx, this._focus.serieIx - 1);
                break;
            case 'ArrowDown':
                focus = this._pickBar(this._focus.valueIx, this._focus.serieIx + 1);
                break;
            case 'PageUp':
                focus = this._pickBar(this._focus.valueIx, 0);
                break;
            case 'PageDown':
                focus = this._pickBar(this._focus.valueIx, __yv(this.data[this._focus.valueIx]).length - 1);
                break;
            case 'Home':
                focus = this._pickBar(0, this._focus.serieIx);
                break;
            case 'End':
                focus = this._pickBar(this.data.length - 1, this._focus.serieIx);
                break;
            case 'Enter':
            case ' ':
                this._focus.el.click();
                break;
            default:
                // Not handled
                return;
        }

        // We consumed this keyboard event. Don't propagate
        ev.preventDefault();

        if (!focus || focus.el === this._focus.el) {
            return;
        }
        this._focusOn(focus);
        this._focus.el.scrollIntoViewIfNeeded();
        this._mouseTooltip({target: focus.el});
    }
};

customElements.define(PTCS.ChartCoreBar.is, PTCS.ChartCoreBar);

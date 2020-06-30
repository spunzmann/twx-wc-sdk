import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

// D3
import {select} from 'd3-selection';
import {scaleLinear, scaleTime, scaleBand} from 'd3-scale';
import {timeSecond, timeMinute, timeHour, timeDay, timeMonth, timeWeek, timeYear} from 'd3-time';
import {timeFormat} from 'd3-time-format';

/* Don't need a warning to make sure I have not confused "=>" with ">=" or "<=" */
/* eslint-disable no-confusing-arrow */

PTCS.formatMillisecond = timeFormat('.%L');
PTCS.formatSecond = timeFormat(':%S');
PTCS.formatMinute = timeFormat('%I:%M');
PTCS.formatHour = timeFormat('%I %p');
PTCS.formatDay = timeFormat('%a %d');
PTCS.formatWeek = timeFormat('%b %d');
PTCS.formatMonth = timeFormat('%B');
PTCS.formatYear = timeFormat('%Y');


PTCS.formatDateDefault = date => {
    //console.log([date, timeSecond(date), timeMinute(date), timeHour(date),
    // timeDay(date), timeMonth(date), timeWeek(date), timeYear(date)])

    /* eslint-disable no-nested-ternary */
    return (timeSecond(date) < date ? PTCS.formatMillisecond
        : timeMinute(date) < date ? PTCS.formatSecond
            : timeHour(date) < date ? PTCS.formatMinute
                : timeDay(date) < date ? PTCS.formatHour
                    : timeMonth(date) < date ? (timeWeek(date) < date ? PTCS.formatDay : PTCS.formatWeek)
                        : timeYear(date) < date ? PTCS.formatMonth
                            : PTCS.formatYear)(date);
    /* eslint-enable no-nested-ternary */
};

PTCS.formatDate = (specifier) => {
    if (specifier) {
        return date => moment(date).format(specifier);
    }

    return PTCS.formatDateDefault;
};

function countDecimals(s) {
    const n = s ? s.length : 0;
    let numPoints = 0;
    let numDigits = 0;
    // Scan the string once from start to end and count the number of digits after the last '.'
    for (let i = 0; i < n; i++) {
        const c = s.charAt(i);
        if (c === '.') {
            numPoints++;
            numDigits = 0;
        } else if (c >= '0' && c <= '9') {
            numDigits++;
        }
    }
    return numPoints ? numDigits : 0;
}

PTCS.formatNumber = (specifier) => {
    // Special case for stacked values
    if (specifier === '#%') {
        return num => `${num}%`;
    }

    if (specifier) {
        return num => num.toFixed(countDecimals(specifier));
    }

    // No (or empty) specifier, use value as-is
    return num => num;
};

PTCS.Axis = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {

    static get template() {
        return html`
        <style>
        :host {
            /*height: 100%;*/
            display: flex;
            align-items: stretch;
            user-select: none;
        }

        :host([side=left]) {
            flex-direction: row;
            height: 100%;
        }

        :host([side=right]) {
            flex-direction: row-reverse;
            height: 100%;
        }

        :host([side=top]) {
            flex-direction: column;
            width: 100%;
        }

        :host([side=bottom]) {
            flex-direction: column-reverse;
            width: 100%;
        }

        :host([hidden]) {
            display: none !important;
        }

        :host([side=left]) #ticksdim {
            margin-left: var(--tick-offs-r, 8px);
        }

        :host([side=right]) #ticksdim {
            margin-right: var(--tick-offs-r, 8px);
        }

        :host([side=top]) #ticksdim {
            margin-top: var(--tick-offs-r, 8px);
        }

        :host([side=bottom]) #ticksdim {
            margin-bottom: var(--tick-offs-r, 8px);
        }

        [part=label-container] {
            text-align: center;
        }

        :host([side=left]) [part=label-container] {
            writing-mode: vertical-rl;
            text-orientation: sideways;
            transform: rotate(180deg);

            margin-right: var(--ptcs-chart-axis-label--horizontal-margin, 0);
        }

        :host([side=right]) [part=label-container] {
            writing-mode: vertical-lr;
            text-orientation: sideways;

            margin-left: var(--ptcs-chart-axis-label--horizontal-margin, 0);
        }

        :host([side=top]) [part=label-container] {
            margin-bottom: var(--ptcs-chart-axis-label--vertical-margin, 0);
        }

        :host([side=bottom]) [part=label-container] {
            margin-top: var(--ptcs-chart-axis-label--vertical-margin, 0);
        }

        #ticks {
            position: relative;
            flex: 1 1 auto;
            overflow: hidden
            /*background: #ffcccc;*/
        }

        [part=tick-label], [part=tick-link] {
            position: absolute;
            /*transition: transform 300ms;*/
        }

        :host([side=left]) [part=tick-label],
        :host([side=left]) [part=tick-link] {
            right: 8px;
        }

        :host([side=right]) [part=tick-label],
        :host([side=right]) [part=tick-link] {
            left: 8px;
        }

        :host([side=top]) [part=tick-label],
        :host([side=top]) [part=tick-link] {
            bottom: 8px;
        }

        :host([side=bottom]) [part=tick-label],
        :host([side=bottom]) [part=tick-link]  {
            top: 8px;
        }

        :host [part=tick-label],
        :host [part=tick-link] {
            min-width: unset;
            min-height: unset;
        }

        :host([rotate-ticks]) [part=tick-label],
        :host([rotate-ticks]) [part=tick-link] {
            writing-mode: vertical-lr;
            text-orientation: sideways;
        }

        /**** -- This rule gets activated too late, which seriously harms the logic.
        [part=tick-link]::part(label) {
            padding: 0px;
        }****/

        [part=label] {
            min-width: unset;
        }

        :host([align-label=start]) [part=label-container] {
            text-align: left;
        }

        :host([align-label=end]) [part=label-container] {
            text-align: right;
        }

        </style>

        <div part="label-container" id="cntr" hidden\$="[[!label]]" align\$="[[axisAlign]]">
            <ptcs-label variant="label" label="[[label]]" part="label"></ptcs-label>
        </div>
        <div part="ticks-area" id="ticks"><div id="ticksdim"></div></div>`;
    }

    static get is() {
        return 'ptcs-chart-axis';
    }

    static get properties() {
        return {
            type: {
                type:     Object, // number || date || Array (of labels)
                value:    'number',
                observer: '_typeChanged'
            },

            // type, but with eliminated duplicates
            _type: {
                type: Object
            },

            // Weights of type labels, if type is labels
            _weights: {
                type: Object
            },

            // left || right || top || bottom
            side: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            // Axis label
            label: {
                type: String
            },

            // Label alignment
            alignLabel: {
                type:               String,
                reflectToAttribute: true
            },

            // Minimum value in data
            minValue: {
                type: Object
            },

            // Maximum value in data
            maxValue: {
                type: Object
            },

            // Specified minimum value: baseline || auto || value
            specMin: {
                type: Object
            },

            // Specified maximum value: auto || value
            specMax: {
                type: Object
            },

            // Use specMin / specMax even if they hide data
            zoom: {
                type: Boolean
            },

            // Current size / length of axis (width or height depending on this.side)
            size: {
                type: Number
            },

            // Maximum size / length of axis
            maxSize: {
                type: String
            },

            // Reverse the axis direction
            reverse: {
                type: Boolean
            },

            rotateTicks: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true,
                observer:           'refresh'
            },

            // The generated scale
            scale: {
                type:   Function,
                notify: true
            },

            // Minimum value on current scale: function(minValue, maxValue, minSpec)
            scaleMin: {
                type:   Number,
                notify: true
            },

            // Maximum value on current scale: function(minValue, maxValue, maxSpec)
            scaleMax: {
                type:   Number,
                notify: true
            },

            // Axis ticks: [{label, value, offs}, ...]
            ticks: {
                type:     Array,
                observer: 'refresh',
                notify:   true
            },

            _focusedTick: Number,

            _horizontal:  Boolean,
            _scaleLength: Number,

            // Padding
            outerPadding: String,
            innerPadding: String,

            // max label dimension
            _maxLabelWidth:  String,
            _maxLabelHeight: String,

            numberFormat: {
                type: String
            },

            numberFormatSpecifier: {
                type: String
            },

            dateFormatToken: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_updateRange(_type, minValue, maxValue, specMin, specMax, zoom)',
            // eslint-disable-next-line max-len
            '_updateScale(_type, side, reverse, scaleMin, scaleMax, size, outerPadding, innerPadding, numberFormat, numberFormatSpecifier, dateFormatToken)',
            '_updateMaxSize(maxSize, _horizontal, size, label, rotateTicks)'
        ];
    }

    ready() {
        super.ready();
        if (this.label === undefined) {
            this.label = null;
        }
        if (PTCS.isEdge) {
            // Edge needs (a lot of) help to rotate the axis label
            this._createPropertyObserver('side', '__edgeSideChanged', false);
            this.__edgeSideChanged(this.side);
            this._createPropertyObserver('rotateTicks', '__edgeRotateTicksChanged', false);
        }
        this.$.ticks.addEventListener('click', ev => this._clickTick(ev));
        this.addEventListener('keydown', ev => this._keyDown(ev));
    }

    _updateMaxSize(maxSize, _horizontal, size, label, rotateTicks) {
        if (this.__callUpdateMaxSize) {
            return;
        }
        this.__callUpdateMaxSize = true;
        requestAnimationFrame(() => {
            this.__callUpdateMaxSize = false;
            const mxs = PTCS.cssDecodeSize(maxSize, this, !_horizontal);
            if (_horizontal) {
                // Use same limit in both directions, or rotating the labels will get problematic
                const dim = mxs > 0
                    ? `${Math.max(mxs - (label ? PTCS.getElementHeight(this.$.cntr) : 0), 0)}px`
                    : '';
                this._maxLabelWidth = '';
                this._maxLabelHeight = dim;
            } else {
                this._maxLabelWidth = mxs > 0
                    ? `${Math.max(mxs - (label ? PTCS.getElementWidth(this.$.cntr) : 0), 0)}px`
                    : '';
                this._maxLabelHeight = '';
            }
            this.refresh();
        });
    }

    _buildType(tree, list, _weights, level = 0, prefixString = '') {
        const prefix = prefixString ? s => `${prefixString}:$:${s}` : s => s;
        tree.forEach(item => {
            if (typeof item === 'string') {
                const key = prefix(item);
                if (_weights[key] === undefined) {
                    _weights[key] = list.length;
                    list.push({label: item, level, key: prefix(item)});
                }
            } else {
                const key = prefix(item.label);
                if (_weights[key] === undefined) {
                    _weights[key] = list.length;
                    list.push({
                        label:    item.label,
                        level,
                        key,
                        children: item.sub && item.sub.length > 0,
                        open:     item.open,
                        sub:      item.sub
                    });
                    if (item.sub && item.open) {
                        this._buildType(item.sub, list, _weights, level + 1, key);
                    }
                }
            }
        });
    }

    __resetHorzMaxWidth() {
        this.__horzMaxWidth = -1; // Unassigned
        this.style.minWidth = '';
    }

    _typeChanged(type) {
        const _weights = {};
        let _type = type;

        this.__resetHorzMaxWidth();

        // TODO: use label axis instead of _weights?
        if (type instanceof Array) {
            // Create weight for each label: {label: index} and eliminate duplicates
            _type = [];

            /*type.forEach((item, index) => {
                const label = typeof item === 'string' ? item : item.label;
                if (_weights[label] === undefined) {
                    _weights[label] = index;
                    _type.push(label);
                }
            });*/

            this._buildType(type, _type, _weights);
        }

        this.setProperties({_weights, _type});
    }

    _getRangeNumber(minValue, maxValue, specMin, specMax, zoom) {
        // Apply specified minValue / maxValue
        const EXTRA_MARGIN = 0.05; // 5%

        let min = 0; // Default - baseline
        if (!isNaN(+specMin)) {
            const v = +specMin;
            if (zoom) {
                min = v;
            } else if (v <= minValue) {
                // Add a few % extra to allow everything to fit
                min = v - EXTRA_MARGIN * (maxValue - minValue);
            } else {
                // Switch to auto
                specMin = 'auto';
            }
        } else if (minValue < 0) {
            specMin = 'auto';
        }

        if (specMin === 'auto') {
            min = zoom ? minValue : minValue - 0.25 * (maxValue - minValue);
        }

        let max;
        if (!isNaN(+specMax)) {
            const v = +specMax;
            if (zoom) {
                max = v;
            } else if (v >= maxValue) {
                // Add a few % extra to allow everything to fit
                max = v + EXTRA_MARGIN * (maxValue - minValue);
            }
        }
        if (max === undefined) {
            max = zoom ? maxValue : maxValue + 0.25 * (maxValue - minValue);
        }
        return [min, max];
    }

    _getRangeDate(minValue, maxValue, specMin, specMax, zoom) {
        if (!(minValue instanceof Date) || !(maxValue instanceof Date)) {
            //console.error('Invalid date min/max:' + minValue + ' / ' + maxValue);
            return null;
        }
        const mins = specMin instanceof Date ? specMin.getTime() : 'auto';
        const maxs = specMax instanceof Date ? specMax.getTime() : undefined;
        const [min, max] = this._getRangeNumber(minValue.getTime(), maxValue.getTime(), mins, maxs, zoom);
        return [new Date(min), new Date(max)];
    }

    __getMaxWlabel(maxValue) {
        let maxw = this._weights[maxValue];
        if (maxw !== undefined) {
            return maxw;
        }
        if (typeof maxValue === 'string') {
            const a = maxValue.split(':$:');
            if (a.length > 0) {
                maxw = a.length > 1 ? this._weights[a.splice(0, a.length - 1).join(':$:')] : undefined;
            }
            if (maxw !== undefined) {
                return maxw;
            }
        }
        if (this._type instanceof Array) {
            return Math.max(0, this._type.length - 1);
        }
        return 0;
    }

    __getMaxLabel(_type, specMax, zoom) {
        if (!zoom || !(_type instanceof Array) || !this._weights) {
            return specMax;
        }
        const value = _type[this._weights[specMax]];
        if (!value || !value.open || !(value.sub instanceof Array) || value.sub.length === 0) {
            return specMax;
        }
        const last = value.sub[value.sub.length - 1];
        return `${value.label}:$:${last.label || last}`;
    }

    _getRangeLabel(_type, minValue, maxValue, specMin, specMax, zoom) {
        const minw = this._weights[minValue] || 0;
        const maxw = this.__getMaxWlabel(maxValue);
        // Only allow zooming on base values - not tick children (for now, at least)
        const baseValue = v => typeof v === 'string' ? v.split(':$:')[0] : v;
        const _specMin = baseValue(specMin);
        const _specMax = this.__getMaxLabel(_type, baseValue(specMax), zoom);
        const [min, max] = this._getRangeNumber(
            minw >= 0 ? minw : _specMin,
            maxw >= 0 ? maxw : _specMax,
            this._weights[_specMin],
            this._weights[_specMax],
            zoom);

        return [
            _type[Math.max(Math.min(_type.length - 1, Math.round(min)), 0)].key,
            _type[Math.max(Math.min(_type.length - 1, Math.round(max)), 0)].key
        ];
    }

    _updateRange(_type, minValue, maxValue, specMin, specMax, zoom) {
        this.__resetHorzMaxWidth();

        if (specMin === undefined || specMin === '') {
            specMin = 'auto';
        }
        if (specMax === undefined || specMax === '') {
            specMax = 'auto';
        }

        let minMax;
        if (_type === 'date') {
            minMax = this._getRangeDate(minValue, maxValue, specMin, specMax, zoom);
        } else if (_type instanceof Array) {
            minMax = this._getRangeLabel(_type, minValue, maxValue, specMin, specMax, zoom);
        } else {
            minMax = this._getRangeNumber(minValue, maxValue, specMin, specMax, zoom);
        }
        if (minMax) {
            this.setProperties({scaleMin: minMax[0], scaleMax: minMax[1]});
        }
    }

    // Create scalar ticks
    _createTicks() {
        const scale = this.scale;
        const formatTick = scale._formatTick || (v => v);
        const defaultTicksLength = scale.ticks().length;
        const maxTickLength = Math.max(3, Math.floor(this._scaleLength / 24));

        let numTicks = Math.min(defaultTicksLength, maxTickLength);

        let ticks = scale.ticks(numTicks);
        let ticksLength = ticks.length;

        while (ticksLength > numTicks && numTicks >= 3) {
            // Actual number of ticks that were generated is bigger than what we wanted
            numTicks--;

            ticks = scale.ticks(numTicks);
            ticksLength = ticks.length;
        }

        const result = ticks.map((v, i) => ({label: formatTick(v), value: v, offs: scale(v), index: i}));

        // Make sure foucus is still within ticks array
        if (!(0 <= this._focusedTick && this._focusedTick < result.length)) {
            this._focusedTick = 0;
        }

        return result;
    }

    // Create ordinal ticks (labels)
    _createLabelTicks(labels) {
        const scale = this.scale;
        const delta = scale.bandwidth() / 2;
        if (arguments.length === 0) {
            labels = this._zoomLabel(this._type, this.scaleMin, this.scaleMax);
        }

        // Keep track of focused item
        const focusKey = (this.ticks instanceof Array && this.ticks[this._focusedTick])
            ? this.ticks[this._focusedTick].key
            : undefined;

        // Optimal number of ticks
        const numTicks = Math.min(Math.max(3, Math.round(this._scaleLength / 24)), labels.length);

        // Needs sampling?
        if (labels.length > numTicks) {
            const excess = (labels.length - numTicks);
            const step = Math.max(2, Math.floor(excess / numTicks + 2));

            // Make sure focused tick is included in sample
            const focus = focusKey ? labels.findIndex(item => item === focusKey) : -1;
            const start = focus > 0 ? focus % step : 0;

            // Sampling
            const a = [];
            for (let i = start; i < labels.length; i += step) {
                a.push(labels[i]);
            }
            labels = a;
        }

        // Create ticks data
        const result = labels.map(value => {
            const key = value;
            const item = this._type[this._weights[key]];
            return {
                label:    item.label,
                key,
                children: item.children,
                value,
                offs:     scale(key) + delta,
                open:     item.open
            };
        });

        // Restore focus to the clicked element
        if (focusKey) {
            this._focusedTick = result.findIndex(item => item.key === focusKey);
        }

        // If focus is unavailable...
        if (!(0 <= this._focusedTick && this._focusedTick < result.length)) {
            this._focusedTick = 0;
        }

        return result;
    }

    _updateScale(_type, side, reverse, scaleMin, scaleMax, size /*, outerPadding, innerPadding*/) {
        if (!size) {
            return;
        }

        //console.log(`${this.label}: ${_type}  ${scaleMin} to ${scaleMax} / ${size}`);
        this._horizontal = (side === 'top' || side === 'bottom');
        this._scaleLength = size; /*this._horizontal ? this.clientWidth : this.clientHeight;*/

        /*if (Math.abs(size - (this._horizontal ? this.clientWidth : this.clientHeight)) > 2) {
            console.log(`SCALE LENGTH: ${Math.round(size)} vs ${this._horizontal ? this.clientWidth : this.clientHeight}`);
        }*/

        if (_type === 'number') {
            this._createNumberScale(reverse, scaleMin, scaleMax);
        } else if (_type === 'date') {
            this._createDateScale(reverse, scaleMin, scaleMax);
        } else if (_type instanceof Array) {
            this._createLabelScale(_type, reverse, scaleMin, scaleMax);
        } else if (_type) {
            console.error('Unknown axis type: ' + JSON.stringify(_type));
            return;
        }
    }

    _createNumberScale(reverse, scaleMin, scaleMax) {
        let min = +scaleMin;
        let max = +scaleMax;
        if (isNaN(min) || isNaN(max)) {
            //if (scaleMin !== '' || scaleMax !== '') {
            //    console.warn(`Invalid min/max: ${JSON.stringify(scaleMin)} / ${JSON.stringify(scaleMax)}`);
            //}
            return;
        }

        // Enforce 5% distance between min and max
        if (min === max) {
            const d = 0.05 * Math.abs(this.maxValue - this.minValue);
            min -= d / 2;
            max += d / 2;
        }

        this.scale = scaleLinear()
            .domain(this._horizontal ? [min, max] : [max, min])
            .range(reverse ? [this._scaleLength, 0] : [0, this._scaleLength]);

        this.scale._formatTick = PTCS.formatNumber(this.numberFormat ? this.numberFormat : this.numberFormatSpecifier);

        this.ticks = this._createTicks();
    }

    _createDateScale(reverse, scaleMin, scaleMax) {
        if (!(scaleMin instanceof Date) || !(scaleMin instanceof Date)) {
            if (scaleMin !== '' || scaleMax !== '') {
                console.warn(`Invalid min/max: ${JSON.stringify(scaleMin)} / ${JSON.stringify(scaleMax)}`);
            }
            return;
        }

        // Enforce 5% distance between min and max
        if (scaleMin.getTime() === scaleMax.getTime()) {
            if (this.minValue instanceof Date && this.maxValue instanceof Date) {
                const d = 0.05 * Math.abs(this.maxValue.getTime() - this.minValue.getTime());
                scaleMin = new Date(scaleMin.getTime() - d / 2);
                scaleMax = new Date(scaleMax.getTime() + d / 2);
            } else {
                return; // Invalid data
            }
        }

        this.scale = scaleTime()
            .domain(this._horizontal ? [scaleMin, scaleMax] : [scaleMax, scaleMin])
            .range(reverse ? [this._scaleLength, 0] : [0, this._scaleLength]);
        //.clamp(true);

        this.scale._formatTick = PTCS.formatDate(this.dateFormatToken);

        this.ticks = this._createTicks();
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

    _zoomLabel(_type, scaleMin, scaleMax) {
        if (scaleMin === undefined || scaleMin === null || scaleMax === undefined || scaleMax === null) {
            return _type.map(item => item.key);
        }
        if (_type[0].key === scaleMin && _type[_type.length - 1].key === scaleMax) {
            return _type.map(item => item.key);
        }
        return _type.slice(this._weights[scaleMin], this._weights[scaleMax] + 1).map(item => item.key);
    }

    _createLabelScale(_type, reverse, scaleMin, scaleMax) {
        const flip = reverse ? this._horizontal : !this._horizontal;
        const labels = this._zoomLabel(_type, scaleMin, scaleMax);
        this.scale = scaleBand()
            .domain(labels)
            .range(flip ? [this._scaleLength, 0] : [0, this._scaleLength])
            .padding(this._padding(this.outerPadding))
            .paddingInner(this._padding(this.innerPadding));

        this.ticks = this._createLabelTicks(labels); // labels has already been computed...
    }

    resized(force) {
        if (!this.scale) {
            return;
        }
        const _scaleLength = this._horizontal ? this.clientWidth : this.clientHeight;
        if (this._scaleLength !== _scaleLength || force) {
            this._scaleLength = _scaleLength;
            this.scale.range([0, _scaleLength]);

            if (this._type === 'number' || this._type === 'date') {
                this.ticks = this._createTicks();
            } else if (this._type instanceof Array) {
                this.ticks = this._createLabelTicks();
            }
        }
    }

    refresh() {
        if (this.__refreshOn) {
            return;
        }
        this.__refreshOn = true;
        setTimeout(() => {
            this.__refreshOn = false;
            this.__refresh();
        }, 50);
    }

    __refresh() {
        if (!this.ticks || this.hasAttribute('hidden')) {
            return;
        }

        // Dimension of widest / highest tick label
        let maxLabel = 0;

        function computeMaxH(bb) {
            if (maxLabel < bb.height) {
                maxLabel = bb.height;
            }
        }

        function computeMaxW(bb) {
            if (maxLabel < bb.width) {
                maxLabel = bb.width;
            }
        }

        const computeMax = this._horizontal ? computeMaxH : computeMaxW;

        const listBB = this.$.ticks.getBoundingClientRect();

        const labelTranslate = PTCS.Axis._axisTranslate(this.side || 'left', listBB);

        // eslint-disable-next-line no-nested-ternary
        const alignment = this._horizontal ? 'center' : (this.side === 'right' ? 'left' : 'right');

        const _maxLabelWidth = this._maxLabelWidth || '';
        const _maxLabelHeight = this._maxLabelHeight || '';

        function processLabel(d) {
            const style = this.style;
            // Emit ptcs-label variant for non-interactive containers
            if (!d.children) {
                this.variant = 'body';
                this.maxWidth = !this.reverse ? _maxLabelWidth : _maxLabelHeight;
            } else {
                // Emit ptcs-link variant primary for the expandable, interactive label containers
                this.variant = 'primary';
                this.textMaximumWidth = !this.reverse ? _maxLabelWidth : _maxLabelHeight;
            }
            this.label = d.label;
            this.horizontalAlignment = alignment;
            this.__task = d;
            style.maxWidth = _maxLabelWidth;
            style.maxHeight = _maxLabelHeight;
            const bb = this.getBoundingClientRect();
            style.transform = labelTranslate(d, bb);
            computeMax(bb);
        }

        // Labels
        const labels = this.ticks.filter(d => !d.children);
        const links = this.ticks.filter(d => !!d.children);

        const join = select(this.$.ticks)
            .selectAll('ptcs-link')
            .data(links);

        // EXIT old elements not present in new data
        join.exit().remove();

        // UPDATE old elements present in new data
        join.each(processLabel);

        // ENTER new elements present in new data
        join.enter()
            .append('ptcs-link')
            .attr('part', 'tick-link')
            .attr('single-line', '')
            .each(function() {
                // Awful workaround for resetting the internal padding on the link label
                // The [part=tick-link]::part(label) CSS is activated too late
                this.shadowRoot.querySelector('[part~=label]').style.padding = '0px';
            })
            .each(processLabel);

        const lab = select(this.$.ticks)
            .selectAll('ptcs-label')
            .data(labels);

        // EXIT old elements not present in new data
        lab.exit().remove();

        // UPDATE old elements present in new data
        lab.each(processLabel);

        // ENTER new elements present in new data
        lab.enter()
            .append('ptcs-label')
            .attr('part', 'tick-label')
            .each(processLabel);

        // Store maximum dimension
        const s = this.$.ticksdim.style;
        if (this._horizontal) {
            s.width = '';
            s.height = `${maxLabel}px`;
            this._checkTickWidths();
        } else {
            s.width = `${maxLabel}px`;
            s.height = '';
            this.rotateTicks = false;
        }

        // Fix to prevent axis oscillations. Don't allow vertical axis to get more narrow
        // with the same labels. It affects the width of the horizontal axis, which may
        // affects its height, which might affects this axis height, which ...
        if (!this._horizontal) {
            const width = Math.round(this.getBoundingClientRect().width);
            if (width > this.__horzMaxWidth) {
                this.style.minWidth = `${width}px`;
                this.__horzMaxWidth = width;
            }
        }
    }

    /*
     * Returns a function that checks if the left box (bb0) intersects with the right box (bb1). In case of this.reverse the order is opposite.
     */
    get intersectFunc() {
        const listBB = this.$.ticks.getBoundingClientRect();

        if (this.reverse) {
            if (this.rotateTicks) {
                return (bb1, bb0) => {
                    let bb1Left = bb1.left + bb1.width / 2 - bb1.height / 2;
                    let bb0Right = bb0.left + bb0.width / 2 + bb0.height / 2;

                    if (bb1.left + bb1.width / 2 + bb1.height / 2 > listBB.left + listBB.width) {
                        bb1Left = bb1.left + bb1.width / 2 - bb1.height;
                    } else if (bb0.left + bb0.width / 2 - bb0.height / 2 < listBB.left) {
                        bb0Right = bb0.left + bb0.width / 2 + bb0.height;
                    }

                    return bb0Right > bb1Left;
                };
            }

            return (bb1, bb0) => bb0.right > bb1.left;
        }

        if (this.rotateTicks) {
            return (bb0, bb1) => {
                let bb1Left = bb1.left + bb1.width / 2 - bb1.height / 2;
                let bb0Right = bb0.left + bb0.width / 2 + bb0.height / 2;

                if (bb1.left + bb1.width / 2 + bb1.height / 2 > listBB.left + listBB.width) {
                    bb1Left = bb1.left + bb1.width / 2 - bb1.height;
                } else if (bb0.left + bb0.width / 2 - bb0.height / 2 < listBB.left) {
                    bb0Right = bb0.left + bb0.width / 2 + bb0.height;
                }

                return bb0Right > bb1Left;
            };
        }

        return (bb0, bb1) => bb0.right > bb1.left;
    }

    _checkTickWidths() {
        const list = this.$.ticks.querySelectorAll('ptcs-link, ptcs-label');
        const num = list.length;
        if (!num) {
            return;
        }
        const intersect = this.intersectFunc;
        let rotateTicks = false;
        const maxLblHeight = list[0].style.maxHeight;

        // I remove maxHeight to get the real size of the labels
        list[0].style.maxHeight = '';
        let bb0 = list[0].getBoundingClientRect();

        for (let i = 1; i < num; ++i) {
            list[i].style.maxHeight = '';

            let bb1 = list[i].getBoundingClientRect();

            if (intersect(bb0, bb1)) {
                list[i - 1].style.maxHeight = maxLblHeight;
                list[i].style.maxHeight = maxLblHeight;

                rotateTicks = true;
                break;
            }

            list[i - 1].style.maxHeight = maxLblHeight;

            bb0 = bb1;
        }

        list[num - 1].style.maxHeight = maxLblHeight;

        this.rotateTicks = rotateTicks;
    }

    _clickTick(ev) {
        const task = ev.target.__task;
        const focusKey = task ? (task.key || task.label) : undefined;

        // Set focus
        if (ev.target.parentNode === this.$.ticks && task) {
            this._focusedTick = this.ticks.findIndex(item => (item.key || item.label) === focusKey);
            console.assert(ev.target === this._getFocusEl());
            this.focus(); // Sometimes needed on Chrome
        }

        if (!task || typeof task.key !== 'string') {
            return;
        }

        const keys = task.key.split(':$:');
        let item = this.type.find(item2 => item2.label === keys[0]);
        for (let i = 1; i < keys.length; i++) {
            if (!item || !item.sub) {
                return;
            }
            item = item.sub.find(item2 => item2.label === keys[i]);
        }

        // A very simple click algorithm for now (single level accordian)
        if (item && item.sub && item.sub.length) {
            item.open = !item.open;

            // Close all other open items
            this.type.forEach(x => {
                if (x !== item && x.open) {
                    x.open = false;
                }
            });

            // Update types to reflect the newly expanded tick
            this._typeChanged(this.type);
        }
    }

    _getFocusEl() {
        function _key(el) {
            const r = (el && el.parentNode) ? el.__task : undefined;
            return r ? (r.key || r.label) : undefined;
        }

        if (this.ticks instanceof Array && 0 <= this._focusedTick && this._focusedTick < this.ticks.length) {
            const r = this.ticks[this._focusedTick];
            const key = r.key || r.label;
            // Instant cache hit?
            if (_key(this.__focusEl) === key) {
                return this.__focusEl;
            }
            // Is the focus element on its expected place?
            const ticks = this.$.ticks.children;
            this.__focusEl = ticks[1 + this._focusedTick]; // 1+ for ticksdim
            if (_key(this.__focusEl) === key) {
                return this.__focusEl;
            }
            // Is the focus element anywhere?
            for (let i = 1; i < ticks.length; i++) { // 1+ for ticksdim
                if (_key(ticks[i]) === key) {
                    this.__focusEl = ticks[i];
                    return this.__focusEl;
                }
            }
            this.__focusEl = null;
        }
        return null;
    }

    _initTrackFocus() {
        this._trackFocus(this, () => this._getFocusEl());
    }

    _notifyFocus() {
        let el = this._getFocusEl();
        if (!el) {
            this._focusedTick = 0;
            el = this._getFocusEl();
        }
        if (el) {
            el.scrollIntoViewIfNeeded();
        }
    }

    _keyDown(ev) {
        const el = this._getFocusEl();
        if (!el) {
            return;
        }
        let focus;
        switch (ev.key) {
            case 'Home':
            case 'PageUp':
                focus = 0;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                focus = this._focusedTick - 1;
                break;
            case 'End':
            case 'PageDown':
                focus = this.ticks.length - 1;
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                focus = this._focusedTick + 1;
                break;
            case 'Enter':
            case ' ':
                el.click();
                break;
            default:
                // Not handled
                return;
        }

        // We consumed this keyboard event. Don't propagate
        ev.preventDefault();

        if (0 <= focus && focus < this.ticks.length) {
            this._focusedTick = focus;
            const el2 = this._getFocusEl();
            if (el2) {
                el2.scrollIntoViewIfNeeded();
            }
        }
    }

    // Help Edge rotate labels
    __edgeRotateLabel(selector, rotate) {
        const list = this.shadowRoot.querySelectorAll(selector);
        for (let i = 0; i < list.length; i++) {
            list[i].$.label.style.writingMode = rotate ? 'tb-lr' : '';
        }
    }

    __edgeSideChanged(side) {
        this.__edgeRotateLabel('[part=label-container] ptcs-label', side === 'left' || side === 'right');
        this.__edgeRotateLabel('[part=label-container] ptcs-link', side === 'left' || side === 'right');
    }

    __edgeRotateTicksChanged(rotateTicks) {
        this.__edgeRotateLabel('ptcs-label[part=label]', rotateTicks);
        this.__edgeRotateLabel('ptcs-link[part=label]', rotateTicks);
    }
};


PTCS.Axis._axisTranslate = (side, listBB) => {
    if (side === 'left' || side === 'right') {
        return (d, b) => {
            let yTranslate = d.offs - b.height / 2;

            if (yTranslate < 0) {
                yTranslate = 0;
            } else if (yTranslate + b.height > listBB.height) {
                yTranslate = listBB.height - b.height;
            }

            return `translate(0, ${yTranslate}px)`;
        };
    } else if (side === 'top' || side === 'bottom') {
        return (d, b) => {
            let xTranslate = d.offs - b.width / 2;

            if (xTranslate + b.width > listBB.width) {
                xTranslate = listBB.width - b.width;
            } else if (xTranslate < 0) {
                xTranslate = 0;
            }

            return `translate(${xTranslate}px, 0)`;
        };
    }

    return (d, b) => undefined;
};


customElements.define(PTCS.Axis.is, PTCS.Axis);

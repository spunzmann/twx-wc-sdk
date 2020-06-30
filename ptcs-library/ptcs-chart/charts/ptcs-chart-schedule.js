import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';

import 'ptcs-datepicker/ptcs-datepicker.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

import '../ptcs-chart-layout.js';
import '../ptcs-chart-legend.js';
import '../ptcs-chart-coord.js';
import '../axes/ptcs-chart-axis.js';
import '../zoom/ptcs-chart-zoom.js';
import './ptcs-chart-core-schedule.js';

// Don't need lint to warn about that ES5 arrow functions might be a mistaken >=
// eslint-disable no-confusing-arrow

PTCS.ChartSchedule = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {
    static get template() {
        return html`
        <style>
        :host {
            display: block;
        }

        :host([disabled]) {
            pointer-events: none;
        }

        ptcs-chart-axis, [part=legend-area] {
            width: 100%;
            height: 100%;
        }
        </style>
        <ptcs-chart-layout id="chart-layout" style="height:100%"
                           title-pos="[[titlePos]]" hide-title="[[!titleLabel]]"
                           notes-pos="[[notesPos]]" notes-align="[[notesAlign]]" hide-notes="[[_hideNotes(notesLabel, hideNotes)]]"
                           legend-pos="[[legendPos]]" hide-legend="[[_hideLegend(hideLegend, legend)]]"
                           eff-legend-pos="{{effLegendPos}}"
                           zoom="[[_zoomActive]]"
                           x-zoom="[[_showZoomX(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, zoomDrag, zoomSelect, flipAxes, yZoomSlider)]]"
                           y-zoom="[[_showZoomY(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, zoomDrag, zoomSelect, flipAxes, xZoomSlider)]]"
                           flip-axes="[[!flipAxes]]"
                           flip-x-axis="[[flipXAxis]]"
                           flip-y-axis="[[flipYAxis]]"
                           spark-view="[[sparkView]]"
                           x-axis="[[!hideXAxis]]"
                           y-axis="[[!hideYAxis]]">
            <div part="title-area" slot="title"
                style\$="text-align:[[_getHorizontalAlignment(titlePos, titleAlign)]]">
                <ptcs-label part="title-label" label="[[titleLabel]]" variant="[[titleVariant]]"
                    horizontal-alignment="[[_getHorizontalAlignment(titlePos, titleAlign)]]" multi-line></ptcs-label>
            </div>
            <div part="notes-area" slot="notes"
                style\$="text-align:[[_getHorizontalAlignment(notesPos, notesAlign)]];">
                <ptcs-label part="notes-label" label="[[notesLabel]]" variant="label"
                    horizontal-alignment="[[_getHorizontalAlignment(notesPos, notesAlign)]]" multi-line></ptcs-label>
            </div>
            <ptcs-chart-coord slot="chart" part="chart"
                flip-axes="[[!flipAxes]]"
                flip-x-axis="[[flipXAxis]]"
                flip-y-axis="[[flipYAxis]]"
                x-ticks="[[_xTicks]]"
                y-ticks="[[_yTicks]]"
                show-x-rulers="[[showXRulers]]"
                show-y-rulers="[[showYRulers]]"
                front-rulers="[[frontRulers]]"
                hide-zero-ruler
                graph-width="{{_graphWidth}}"
                graph-height="{{_graphHeight}}"
                spark-view="[[sparkView]]">
                <ptcs-chart-core-schedule slot="chart" id="chart" part="core-chart"
                    tabindex\$="[[_delegatedFocus]]"
                    legend="[[legend]]"
                    data="[[data]]"
                    labels="{{labels}}"
                    x-min="{{_xMin}}"
                    x-max="{{_xMax}}"
                    y-min="{{_yMin}}"
                    y-max="{{_yMax}}"
                    flip-axes="[[flipAxes]]"
                    reverse-x-axis="[[!reverseXAxis]]"
                    reverse-y-axis="[[reverseYAxis]]"
                    x-scale="[[_xScale]]"
                    y-scale="[[_yScale]]"
                    filter-legend="[[_selectedLegend]]"
                    zoom-select="[[_zoomMouseOpt(zoomSelect, noXZoom, noYZoom)]]"
                    zoom-drag="[[_zoomMouseOpt(zoomDrag, noXZoom, noYZoom)]]"
                    on-selection="_onChartSelection"></ptcs-chart-core-schedule>
            </ptcs-chart-coord>
            <div part="legend-area" hidden\$="[[hideLegend]]" slot="legend">
                <ptcs-chart-legend
                    tabindex\$="[[_delegatedFocus]]"
                    part="legend"
                    items="[[legend]]"
                    shape="[[legendShape]]"
                    filter="[[filterLegend]]"
                    horizontal="[[_horizLegend(effLegendPos)]]"
                    max-width="[[legendMaxWidth]]"
                    align="[[legendAlign]]"
                    selected="{{_selectedLegend}}"></ptcs-chart-legend>
            </div>
            <ptcs-chart-zoom slot="xzoom" id="zoomX" part="zoom-xaxis" type="[[labels]]" hidden\$="[[noXZoom]]"
                tabindex\$="[[_delegatedFocus]]"
                side="[[_xSide(flipXAxis, flipAxes)]]"
                min-value="[[_xMin]]"
                max-value="[[_xMax]]"
                zoom-start="{{xZoomStart}}"
                zoom-end="{{xZoomEnd}}"
                enable-reset="[[_yEnabled(_yMin, _yMax, yZoomStart, yZoomEnd)]]"
                axis-length="[[_xSize(_graphWidth, _graphHeight, flipAxes)]]"
                active="[[_or(_zoomActive, yZoomSlider)]]"
                range-picker="[[xZoomRange]]"
                interval="[[xZoomInterval]]"
                interval-label="[[xZoomIntervalLabel]]"
                interval-control="[[xZoomIntervalControl]]"
                interval-origin="[[xZoomIntervalOrigin]]"
                show-interval-anchor="[[xShowIntervalAnchor]]"
                slider="[[xZoomSlider]]"
                slider-label="[[xZoomSliderLabel]]"
                slider-min-label="[[xZoomSliderMinLabel]]"
                slider-max-label="[[xZoomSliderMaxLabel]]"
                range-start-label="[[xZoomRangeStartLabel]]"
                range-end-label="[[xZoomRangeEndLabel]]"
                reverse-slider="[[!reverseXAxis]]"
                reset-label="[[resetLabel]]"
                interval-from-label="[[xZoomIntervalFromLabel]]"
                interval-to-label="[[xZoomIntervalToLabel]]"></ptcs-chart-zoom>
            <ptcs-chart-axis slot="xaxis" id="xaxis" part="xaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="[[labels]]" zoom
                spec-min="[[_specValue(specXMin, xZoomStart, noXZoom)]]"
                spec-max="[[_specValue(specXMax, xZoomEnd, noXZoom)]]"
                side="[[_xSide(flipXAxis, flipAxes)]]"
                label="[[xAxisLabel]]"
                align-label="[[xAxisAlign]]"
                min-value="[[_xMin]]"
                max-value="[[_xMax]]"
                size="[[_xSize(_graphWidth, _graphHeight, flipAxes)]]"
                max-size="[[_if(flipAxes, horizontalAxisMaxHeight, verticalAxisMaxWidth)]]"
                ticks="{{_xTicks}}"
                reverse="[[!reverseXAxis]]"
                scale="{{_xScale}}"
                hidden\$="[[hideXAxis]]"
                outer-padding="[[outerPadding]]"
                inner-padding="[[innerPadding]]"></ptcs-chart-axis>
            <ptcs-chart-zoom slot="yzoom" id="zoomY" part="zoom-yaxis" type="date" hidden\$="[[noYZoom]]"
                tabindex\$="[[_delegatedFocus]]"
                side="[[_ySide(flipYAxis, flipAxes)]]"
                enable-reset="[[_enabled(labels, _xMin, _xMax, xZoomStart, xZoomEnd)]]"
                axis-length="[[_ySize(_graphWidth, _graphHeight, flipAxes)]]"
                active="[[_or(_zoomActive, xZoomSlider)]]"
                min-value="[[_yMin]]"
                max-value="[[_yMax]]"
                zoom-start="{{yZoomStart}}"
                zoom-end="{{yZoomEnd}}"
                range-picker="[[yZoomRange]]"
                range-start-label="[[yZoomRangeStartLabel]]"
                range-end-label="[[yZoomRangeEndLabel]]"
                interval="[[yZoomInterval]]"
                interval-label="[[yZoomIntervalLabel]]"
                interval-control="[[yZoomIntervalControl]]"
                interval-origin="[[yZoomIntervalOrigin]]"
                show-interval-anchor="[[yShowIntervalAnchor]]"
                slider="[[yZoomSlider]]"
                slider-label="[[yZoomSliderLabel]]"
                slider-min-label="[[yZoomSliderMinLabel]]"
                slider-max-label="[[yZoomSliderMaxLabel]]"
                reverse-slider="[[reverseYAxis]]"
                reset-label="[[resetLabel]]"
                interval-from-label="[[yZoomIntervalFromLabel]]"
                interval-to-label="[[yZoomIntervalToLabel]]"></ptcs-chart-zoom>
            <ptcs-chart-axis slot="yaxis" id="yaxis" part="yaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="date" zoom
                date-format-token="[[dateFormatToken]]"
                spec-min="[[_specValue(specYMin, yZoomStart, noYZoom)]]"
                spec-max="[[_specValue(specYMax, yZoomEnd, noYZoom)]]"
                side="[[_ySide(flipYAxis, flipAxes)]]"
                label="[[yAxisLabel]]"
                align-label="[[yAxisAlign]]"
                min-value="[[_yMin]]"
                max-value="[[_yMax]]"
                size="[[_ySize(_graphWidth, _graphHeight, flipAxes)]]"
                max-size="[[_if(flipAxes, verticalAxisMaxWidth, horizontalAxisMaxHeight)]]"
                ticks="{{_yTicks}}"
                reverse="[[reverseYAxis]]"
                scale="{{_yScale}}"
                hidden\$="[[hideYAxis]]"></ptcs-chart-axis>
        </ptcs-chart-layout>`;
    }

    static get is() {
        return 'ptcs-chart-schedule';
    }

    static get properties() {
        return {
            // Title label
            titleLabel: {
                type: String
            },

            // [top] || bottom || left || right
            titlePos: {
                type: String
            },

            // Title label variant
            titleVariant: {
                type:  String,
                value: 'header'
            },

            // Title alignment: left || center || right
            titleAlign: {
                type: String
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            hideNotes: {
                type:  Boolean,
                value: false
            },

            // Notes label
            notesLabel: {
                type: String
            },

            // top || [bottom] || left || right
            notesPos: {
                type: String
            },

            notesAlign: {
                type: String
            },

            // X-axis label
            xAxisLabel: {
                type: String
            },

            xAxisAlign: {
                type: String
            },

            hideXAxis: {
                type:     Boolean,
                observer: '_hideXAxisChanged'
            },

            // Y-axis label
            yAxisLabel: {
                type: String
            },

            yAxisAlign: {
                type: String
            },

            hideYAxis: {
                type:     Boolean,
                observer: '_hideYAxisChanged'
            },

            dateFormatToken: {
                type: String
            },

            hideLegend: {
                type: Boolean
            },

            // Names of legends, if legends should be visible
            legend: {
                type: Array
            },

            // top || bottom || left || [right]
            legendPos: {
                type: String
            },

            effLegendPos: {
                type: String
            },

            legendAlign: {
                type: String
            },

            // square || circle || none
            legendShape: {
                type: String
            },

            // Filter chart using the legend?
            filterLegend: {
                type: Boolean
            },

            // Legends currently selected in the legend component
            _selectedLegend: {
                type: Array
            },

            sparkView: {
                type:  Boolean,
                value: false
            },

            // Flip x- and y-axes
            flipAxes: {
                type:  Boolean,
                value: false
            },

            // Flip x-axis side
            flipXAxis: {
                type: Boolean
            },

            // Flip y-axis side
            flipYAxis: {
                type: Boolean
            },

            // Connects ticks from x-axis to chart
            _xTicks: {
                type: Array
            },

            // Connects ticks from y-axis to chart
            _yTicks: {
                type: Array
            },

            // Show rulers for X-axis
            showXRulers: {
                type: Boolean
            },

            // Show rulers for Y-axis
            showYRulers: {
                type: Boolean
            },

            // Put rulers on top of chart
            frontRulers: {
                type: Boolean
            },

            // Watches for resizes
            _graphWidth: {
                type: Number
            },

            // Watches for resizes
            _graphHeight: {
                type: Number
            },

            // The x-value on a bar-chart is always [string] (labels)
            /*
            // x-axis type: number || date || [string]
            xType: {
                type: Object
            },
            */

            // x-axis labels
            labels: {
                type: Array
            },

            // The y-value on a schedule-chart is always number
            /*
            // y-axis type: number || date || string
            yType: {
                type: Object
            },
            */

            // Reverse direction of x-axis
            reverseXAxis: {
                type: Boolean
            },

            // Reverse direction of y-axis
            reverseYAxis: {
                type: Boolean
            },

            // Minimun x value in data
            _xMin: {
                type: Object
            },

            // Maximum x value in data
            _xMax: {
                type: Object
            },

            // Minimun y value in data
            _yMin: {
                type: Object
            },

            // Maximum y value in data
            _yMax: {
                type: Object
            },

            // Specified x-min-value: baseline || auto || Number
            specXMin: {
                type: Object
            },

            // Specified x-max-value: auto || Number
            specXMax: {
                type: Object
            },

            // Specified y-min-value: baseline || auto || Number
            specYMin: {
                type:   Object,
                notify: true
            },

            // Specified y-max-value: auto || Number
            specYMax: {
                type:   Object,
                notify: true
            },

            // Move x-scale from x-axis to chart
            _xScale: {
                type: Function,
            },

            // Move y-scale from y-axis to chart
            _yScale: {
                type: Function,
            },


            // Disable X-axis zooming
            noXZoom: {
                type: Boolean
            },

            // Zooming based on properties
            xZoomStart: {
                type: Object
            },

            xZoomEnd: {
                type: Object
            },

            // Show zoom range UI control
            xZoomRange: {
                type: Boolean
            },

            // Specify zoom interval
            xZoomInterval: {
                type: Object
            },

            xZoomIntervalLabel: {
                type: String
            },

            // 'dropdown' || 'radio' || 'textfield'
            xZoomIntervalControl: {
                type: String
            },

            // 'start' || 'end'
            xZoomIntervalOrigin: {
                type: String
            },

            // Allow interval control to manipulate origin?
            xShowIntervalAnchor: {
                type: Boolean
            },

            // Show zoom slider
            xZoomSlider: {
                type: Boolean
            },

            // Disable Y-axis zooming
            noYZoom: {
                type: Boolean
            },

            // Zooming based on properties
            yZoomStart: {
                type: Object
            },

            yZoomEnd: {
                type: Object
            },

            // Show zoom range UI control
            yZoomRange: {
                type: Boolean
            },

            yZoomRangeStartLabel: {
                type: String
            },

            yZoomRangeEndLabel: {
                type: String
            },

            // Specify zoom interval
            yZoomInterval: {
                type: Object
            },

            yZoomIntervalLabel: {
                type: String
            },

            // 'dropdown' || 'radio' || 'textfield'
            yZoomIntervalControl: {
                type: String
            },

            // 'start' || 'end'
            yZoomIntervalOrigin: {
                type: String
            },

            // Allow interval control to manipulate origin?
            yShowIntervalAnchor: {
                type: Boolean
            },

            // Show zoom slider
            yZoomSlider: {
                type: Boolean
            },

            // zoom by dragging mouse: "x" || "y" || "xy" || undefined
            zoomDrag: {
                type: String
            },

            // zoom by selecting two elements: "x" || "y" || "xy" || undefined
            zoomSelect: {
                type: String
            },

            // Show zoom reset button, even if no zoom controls are visible
            _zoomActive: {
                type:     Boolean,
                computed: '_computeZoomActive(noZoom, noXZoom, noYZoom, zoomSelect, zoomDrag)'
            },

            // i18n for zoom reset button
            resetLabel: {
                type: String
            },

            xZoomIntervalFromLabel: {
                type: String
            },

            xZoomIntervalToLabel: {
                type: String
            },

            yZoomIntervalFromLabel: {
                type: String
            },

            yZoomIntervalToLabel: {
                type: String
            },

            legendMaxWidth: {
                type: Number
            },

            verticalAxisMaxWidth: {
                type: Number
            },

            horizontalAxisMaxHeight: {
                type: Number
            },

            // The chart data
            data: {
                type: Array
            },

            outerPadding: {
                type: String
            },

            innerPadding: {
                type: String
            },

            _delegatedFocus: String
        };
    }

    ready() {
        super.ready();

        // One reset button for both zoom controls

        // zoom reset button for x-axis
        this.$.zoomX.addEventListener('zoom-reset', () => {
            // Button pressed. Reset y-axis too
            this.yZoomStart = undefined;
            this.yZoomEnd = undefined;
        });

        // zoom reset button for y-axis
        this.$.zoomY.addEventListener('zoom-reset', () => {
            // Button pressed. Reset x-axis too
            this.xZoomStart = undefined;
            this.xZoomEnd = undefined;
        });
    }

    _zoomMouseOpt(zoom, noXZoom, noYZoom) {
        if (zoom === 'x') {
            return noXZoom ? false : 'x';
        }
        if (zoom === 'y') {
            return noYZoom ? false : 'y';
        }
        if (zoom === 'xy') {
            if (noXZoom) {
                return noYZoom ? false : 'y';
            }
            return noYZoom ? 'x' : 'xy';
        }
        return false;
    }

    _getHorizontalAlignment(pos, align) {
        if (pos === 'top' || pos === 'bottom') {
            return align;
        }

        return 'start';
    }

    _hideNotes(nodesLabel, hideNotes) {
        return !nodesLabel || hideNotes;
    }

    _hideLegend(hideLegend, legend) {
        return hideLegend || !(legend instanceof Array) || !(legend.length > 0);
    }

    _horizLegend(effLegendPos) {
        return effLegendPos === 'top' || effLegendPos === 'bottom';
    }

    _xSide(flipXAxis, flipAxes) {
        // eslint-disable-next-line no-nested-ternary
        return flipAxes ? (flipXAxis ? 'top' : 'bottom') : (flipXAxis ? 'right' : 'left');
    }

    _ySide(flipYAxis, flipAxes) {
        // eslint-disable-next-line no-nested-ternary
        return flipAxes ? (flipYAxis ? 'right' : 'left') : (flipYAxis ? 'top' : 'bottom');
    }

    _xSize(_graphWidth, _graphHeight, flipAxes) {
        return flipAxes ? _graphWidth : _graphHeight;
    }

    _ySize(_graphWidth, _graphHeight, flipAxes) {
        return flipAxes ? _graphHeight : _graphWidth;
    }

    _showZoom(noZoom, zoomRange, zoomInterval, zoomSlider, zoomMouse, horzAxis, sliderAlt) {
        if (noZoom) {
            return false;
        }
        return zoomRange || zoomInterval || zoomSlider || zoomMouse || (horzAxis && sliderAlt);
    }

    _showZoomX(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, zoomDrag, zoomSelect, flipAxes, yZoomSlider) {
        const zoomMouse = [zoomDrag, zoomSelect].find(item => item === 'x' || item === 'xy');
        return this._showZoom(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, zoomMouse, flipAxes, yZoomSlider);
    }

    _showZoomY(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, zoomDrag, zoomSelect, flipAxes, xZoomSlider) {
        const zoomMouse = [zoomDrag, zoomSelect].find(item => item === 'y' || item === 'xy');
        return this._showZoom(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, zoomMouse, !flipAxes, xZoomSlider);
    }

    _specValue(spec, zoom, noZoom) {
        if (noZoom || zoom === undefined || zoom === '' || zoom === null) {
            return spec;
        }
        return zoom;
    }

    _computeZoomActive(noZoom, noXZoom, noYZoom, zoomSelect, zoomDrag) {
        if (noZoom) {
            return false;
        }
        if ((zoomSelect === 'x' || zoomSelect === 'xy' || zoomDrag === 'x' || zoomDrag === 'xy') && !noXZoom) {
            return true;
        }
        if ((zoomSelect === 'y' || zoomSelect === 'xy' || zoomDrag === 'y' || zoomDrag === 'y') && !noYZoom) {
            return true;
        }
        return false;
    }

    _enabled(type, minValue, maxValue, zoomStart, zoomEnd) {
        return !PTCS._typeIsFullRange(type, minValue, maxValue, zoomStart, zoomEnd);
    }

    _yEnabled(_yMin, _yMax, yZoomStart, yZoomEnd) {
        return this._enabled('date', _yMin, _yMax, yZoomStart, yZoomEnd);
    }

    _if(a, b, c) {
        return a ? b : c;
    }

    _or(...args) {
        return args.find(v => !!v) || false;
    }

    _onChartSelection(ev) {
        function invert(scale, v1, v2) {
            if (scale.invert) {
                return [scale.invert(v1), scale.invert(v2)];
            }
            const domain = scale.domain();
            if (domain.length <= 1) {
                return [domain[0], domain[0]];
            }
            let a = scale(domain[0]);
            let b = scale(domain[1]);
            let min, max;

            if (a < b) {
                const d = (b - a);
                const p = d * scale.padding();
                min = Math.ceil((v1 - a + p) / d - 1);
                max = Math.floor((v2 - a) / d);
            } else {
                a = scale(domain[domain.length - 1]);
                b = scale(domain[domain.length - 2]);
                const d = (b - a);
                const p = d * scale.padding();
                max = domain.length - 1 - Math.ceil((v2 - a + p) / d - 1);
                min = domain.length - 1 - Math.floor((v1 - a) / d);
            }

            min = Math.max(Math.min(min, domain.length), 0);
            max = Math.max(Math.min(max, domain.length), min);

            return [domain[min], domain[max]];
        }

        const xScale = this._xScale;
        const yScale = this._yScale;
        let reverseXAxis = !this.reverseXAxis;
        let reverseYAxis = this.reverseYAxis;
        let d = ev.detail;
        if (!this.flipAxes) {
            d = {x: d.y, y: d.x, w: d.h, h: d.w};
            reverseXAxis = !reverseXAxis;
            reverseYAxis = !reverseYAxis;
        }
        const zd = this._zoomMouseOpt(this.zoomDrag, this.noXZoom, this.noYZoom);
        const zs = this._zoomMouseOpt(this.zoomSelect, this.noXZoom, this.noYZoom);

        if (zd === 'x' || zd === 'xy' || zs === 'x' || zs === 'xy') {
            // Make sure the selection at least covers one task bar
            const domain = xScale.domain();
            const [start, end] = reverseXAxis ? invert(xScale, d.x + d.w, d.x) : invert(xScale, d.x, d.x + d.w);
            if (PTCS._typeVal(start, domain) <= PTCS._typeVal(end, domain)) {
                [this.xZoomStart, this.xZoomEnd] = [start, end];
            }
        }
        if (zd === 'y' || zd === 'xy' || zs === 'y' || zs === 'xy') {
            [this.yZoomStart, this.yZoomEnd] = reverseYAxis // default y-axis is reversed
                ? invert(yScale, d.y, d.y + d.h) : invert(yScale, d.y + d.h, d.y);
        }
    }

    refreshData() {
        this.$.chart.refreshData();
    }

    _resetToDefaultValues() {
        this.$.legend._resetToDefaultValues();
        this.$.zoomX._resetToDefaultValues();
        this.$.zoomY._resetToDefaultValues();
    }

    _hideXAxisChanged(hide) {
        if (!hide) {
            this.$.xaxis.refresh();
        }
    }

    _hideYAxisChanged(hide) {
        if (!hide) {
            this.$.yaxis.refresh();
        }
    }

};

customElements.define(PTCS.ChartSchedule.is, PTCS.ChartSchedule);

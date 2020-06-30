import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

import 'ptcs-label/ptcs-label.js';
import '../ptcs-chart-layout.js';
import '../ptcs-chart-legend.js';
import '../ptcs-chart-coord.js';
import '../axes/ptcs-chart-axis.js';
import '../zoom/ptcs-chart-zoom.js';
import {__xv} from './ptcs-chart-core-bar.js';


// Don't need lint to warn about that ES5 arrow functions might be a mistaken >=
// eslint-disable no-confusing-arrow

PTCS.ChartBar = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
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
                           x-zoom="[[_showZoomX(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, xZoomDrag, xZoomSelect, flipAxes, yZoomSlider)]]"
                           y-zoom="[[_showZoomY(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, yZoomDrag, yZoomSelect, flipAxes, xZoomSlider)]]"
                           flip-axes="[[flipAxes]]"
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
                flip-axes="[[flipAxes]]"
                flip-x-axis="[[flipXAxis]]"
                flip-y-axis="[[flipYAxis]]"
                x-ticks="[[_xTicks]]"
                y-ticks="[[_yTicks]]"
                show-x-rulers="[[showXRulers]]"
                show-y-rulers="[[showYRulers]]"
                front-rulers="[[frontRulers]]"
                hide-zero-ruler="[[hideZeroRuler]]"
                graph-width="{{_graphWidth}}"
                graph-height="{{_graphHeight}}"
                spark-view="[[sparkView]]">
                <ptcs-chart-core-bar slot="chart" id="chart"  part="core-chart"
                    tabindex\$="[[_delegatedFocus]]"
                    data="[[data]]"
                    legend="[[legend]]"
                    stack-method="[[stackMethod]]"
                    stack-order="[[stackOrder]]"
                    x-min="{{_xMin}}"
                    x-max="{{_xMax}}"
                    y-min="{{_yMin}}"
                    y-max="{{_yMax}}"
                    y-axis-number-format="{{_yAxisNumberFormat}}"
                    flip-axes="[[flipAxes]]"
                    reverse-x-axis="[[reverseXAxis]]"
                    reverse-y-axis="[[reverseYAxis]]"
                    x-scale="[[_xScale]]"
                    y-scale="[[_yScale]]"
                    filter-legend="[[_selectedLegend]]"
                    show-values="[[_showValues(sparkView, hideValues, showValues)]]"
                    group-padding="[[groupPadding]]"
                    zoom-select="[[_zoomSelect(xZoomSelect, noXZoom, yZoomSelect, noYZoom)]]"
                    zoom-drag-x="[[_zoomDrag(xZoomDrag, noXZoom)]]"
                    zoom-drag-y="[[_zoomDrag(yZoomDrag, noYZoom)]]"
                    on-selection="_onChartSelection"></ptcs-chart-core-bar>
            </ptcs-chart-coord>
            <div part="legend-area" slot="legend">
                <ptcs-chart-legend
                    tabindex\$="[[_delegatedFocus]]"
                    id="legend"
                    part="legend"
                    items="[[legend]]"
                    shape="[[legendShape]]"
                    filter="[[filterLegend]]"
                    horizontal="[[_horizLegend(effLegendPos)]]"
                    max-width="[[legendMaxWidth]]"
                    align="[[legendAlign]]"
                    disabled="[[disabled]]"
                    selected="{{_selectedLegend}}"></ptcs-chart-legend>
            </div>
            <ptcs-chart-zoom slot="xzoom" id="zoomX" part="zoom-xaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="[[labels]]"
                side="[[_xSide(flipXAxis, flipAxes)]]"
                hidden\$="[[noXZoom]]"
                enable-reset="[[_yEnabled(_yMin, _yMax, yZoomStart, yZoomEnd, specYMin, specYMax)]]"
                axis-length="[[_xSize(_graphWidth, _graphHeight, flipAxes)]]"
                min-value="[[_xMin]]"
                max-value="[[_xMax]]"
                zoom-start="{{xZoomStart}}"
                zoom-end="{{xZoomEnd}}"
                min-data="[[_xMin]]"
                max-data="[[_xMax]]"
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
                reverse-slider="[[reverseXAxis]]"
                reset-label="[[resetLabel]]"
                interval-from-label="[[xZoomIntervalFromLabel]]"
                interval-to-label="[[xZoomIntervalToLabel]]"></ptcs-chart-zoom>
            <ptcs-chart-axis slot="xaxis" id="xaxis" part="xaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="[[labels]]"
                zoom="[[_zoom(xZoomStart, xZoomEnd, noXZoom)]]"
                spec-min="[[_specValue(specXMin, xZoomStart, noXZoom)]]"
                spec-max="[[_specValue(specXMax, xZoomEnd, noXZoom)]]"
                side="[[_xSide(flipXAxis, flipAxes)]]"
                label="[[xAxisLabel]]"
                align-label="[[xAxisAlign]]"
                min-value="[[_xMin]]"
                max-value="[[_xMax]]"
                size="[[_xSize(_graphWidth, _graphHeight, flipAxes)]]"
                max-size="[[_if(flipAxes, verticalAxisMaxWidth, horizontalAxisMaxHeight)]]"
                ticks="{{_xTicks}}"
                reverse="[[reverseXAxis]]"
                scale="{{_xScale}}"
                hidden\$="[[hideXAxis]]"
                outer-padding="[[outerPadding]]"
                inner-padding="[[innerPadding]]"></ptcs-chart-axis>
            <ptcs-chart-zoom slot="yzoom" id="zoomY" part="zoom-yaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="number"
                side="[[_ySide(flipYAxis, flipAxes)]]"
                hidden\$="[[noYZoom]]"
                enable-reset="[[_enabled(labels, _xMin, _xMax, xZoomStart, xZoomEnd)]]"
                axis-length="[[_ySize(_graphWidth, _graphHeight, flipAxes)]]"
                min-value="[[_yZoomMin(_yMin, _yMax, specYMin)]]"
                max-value="[[_yZoomMax(_yMin, _yMax, specYMax)]]"
                zoom-start="{{yZoomStart}}"
                zoom-end="{{yZoomEnd}}"
                min-data="[[_yMin]]"
                max-data="[[_yMax]]"
                active="[[_or(_zoomActive, xZoomSlider)]]"
                range-picker="[[yZoomRange]]"
                interval="[[yZoomInterval]]"
                interval-label="[[yZoomIntervalLabel]]"
                interval-control="[[yZoomIntervalControl]]"
                interval-origin="[[yZoomIntervalOrigin]]"
                show-interval-anchor="[[yShowIntervalAnchor]]"
                slider="[[yZoomSlider]]"
                slider-label="[[yZoomSliderLabel]]"
                slider-min-label="[[yZoomSliderMinLabel]]"
                slider-max-label="[[yZoomSliderMaxLabel]]"
                range-start-label="[[yZoomRangeStartLabel]]"
                range-end-label="[[yZoomRangeEndLabel]]"
                reverse-slider="[[reverseYAxis]]"
                reset-label="[[resetLabel]]"
                interval-from-label="[[yZoomIntervalFromLabel]]"
                interval-to-label="[[yZoomIntervalToLabel]]"></ptcs-chart-zoom>
            <ptcs-chart-axis slot="yaxis" id="yaxis" part="yaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="number"
                zoom="[[_zoom(yZoomStart, yZoomEnd, noYZoom)]]"
                spec-min="[[_specValueMin(specYMin, yZoomStart, yZoomEnd, noYZoom, _yMin, _yMax)]]"
                spec-max="[[_specValueMax(specYMax, yZoomEnd, yZoomStart, noYZoom, _yMin, _yMax)]]"
                side="[[_ySide(flipYAxis, flipAxes)]]"
                label="[[yAxisLabel]]"
                align-label="[[yAxisAlign]]"
                min-value="[[_yMin]]"
                max-value="[[_yMax]]"
                size="[[_ySize(_graphWidth, _graphHeight, flipAxes)]]"
                max-size="[[_if(flipAxes, horizontalAxisMaxHeight, verticalAxisMaxWidth)]]"
                ticks="{{_yTicks}}"
                reverse="[[reverseYAxis]]"
                scale="{{_yScale}}"
                number-format="[[_yAxisNumberFormat]]"
                number-format-specifier="[[yAxisNumberFormatSpecifier]]"
                hidden\$="[[hideYAxis]]"></ptcs-chart-axis>
        </ptcs-chart-layout>`;
    }

    static get is() {
        return 'ptcs-chart-bar';
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
                type:     Array, // of labels
                computed: '_computeLabels(data.*)'
            },

            // The y-value on a bar-chart is always number
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
                type: Object,
            },

            // Specified x-max-value: auto || Number
            specXMax: {
                type: Object,
            },

            // Specified y-min-value: baseline || auto || Number
            specYMin: {
                type: Object,
            },

            // Specified y-max-value: auto || Number
            specYMax: {
                type: Object,
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

            // X-Axis Zoom Range Start Label
            xZoomRangeStartLabel: {
                type: String
            },

            // X-Axis Zoom Range End Label
            xZoomRangeEndLabel: {
                type: String
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

            xZoomSliderMaxLabel: {
                type: String
            },

            xZoomSliderMinLabel: {
                type: String
            },

            // X-zoom by selecting two elements
            xZoomSelect: {
                type: Boolean
            },

            // X-zoom by dragging the mouse over the chart
            xZoomDrag: {
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

            yZoomSliderMaxLabel: {
                type: String
            },

            yZoomSliderMinLabel: {
                type: String
            },

            // Y-zoom by selecting two elements
            yZoomSelect: {
                type: Boolean
            },

            // Y-zoom by dragging the mouse over the chart
            yZoomDrag: {
                type: Boolean
            },

            // Show zoom reset button, even if no zoom controls are visible
            _zoomActive: {
                type:     Boolean,
                computed: '_computeZoomActive(noZoom, noXZoom, xZoomSelect, xZoomDrag, noYZoom, yZoomSelect, yZoomDrag)'
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

            // uniform || sparse
            format: {
                type: String,
            },

            // Stack method: auto || expand /*|| diverging || silhouette || wiggle*/
            // (If assigned, enables stacking.)
            stackMethod: {
                type: Boolean,
            },

            // Stack order: auto || reverse || appearance || ascending || descending || insideout
            stackOrder: {
                type: String,
            },

            showValues: {
                type: String
            },

            hideValues: {
                type: Boolean
            },

            hideZeroRuler: {
                type: Boolean
            },

            outerPadding: {
                type: String
            },

            innerPadding: {
                type: String
            },

            groupPadding: {
                type: String
            },

            _yAxisNumberFormat: {
                type: String
            },

            yAxisNumberFormatSpecifier: {
                type: String
            },

            _delegatedFocus: String
        };
    }

    ready() {
        super.ready();

        if (this.hideXAxis === undefined) {
            this.hideXAxis = false;
        }
        if (this.hideYAxis === undefined) {
            this.hideYAxis = false;
        }

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

    _zoomSelect(xZoomSelect, noXZoom, yZoomSelect, noYZoom) {
        return (!noXZoom && xZoomSelect) || (!noYZoom && yZoomSelect);
    }

    _zoomDrag(drag, noZoom) {
        return !noZoom && drag;
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
        return flipAxes ? (flipXAxis ? 'right' : 'left') : (flipXAxis ? 'top' : 'bottom');
    }

    _ySide(flipYAxis, flipAxes) {
        // eslint-disable-next-line no-nested-ternary
        return flipAxes ? (flipYAxis ? 'top' : 'bottom') : (flipYAxis ? 'right' : 'left');
    }

    _xSize(_graphWidth, _graphHeight, flipAxes) {
        return flipAxes ? _graphHeight : _graphWidth;
    }

    _ySize(_graphWidth, _graphHeight, flipAxes) {
        return flipAxes ? _graphWidth : _graphHeight;
    }

    _computeLabels(cr) {
        return cr.base instanceof Array ? cr.base.map(item => __xv(item)) : ['error'];
    }

    _showValues(sparkView, hideValues, showValues) {
        return sparkView || hideValues ? false : showValues;
    }

    _showZoom(noZoom, zoomRange, zoomInterval, zoomSlider, zoomDrag, zoomSelect, horzAxis, sliderAlt) {
        if (noZoom) {
            return false;
        }
        return zoomRange || zoomInterval || zoomSlider || zoomDrag || zoomSelect || (horzAxis && sliderAlt);
    }

    _showZoomX(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, xZoomDrag, xZoomSelect, flipAxes, yZoomSlider) {
        return this._showZoom(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, xZoomDrag, xZoomSelect, !flipAxes, yZoomSlider);
    }

    _showZoomY(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, yZoomDrag, yZoomSelect, flipAxes, xZoomSlider) {
        return this._showZoom(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, yZoomDrag, yZoomSelect, flipAxes, xZoomSlider);
    }

    _zoom(zoomStart, zoomEnd, noZoom) {
        if (noZoom) {
            return false;
        }
        return (zoomStart !== undefined && zoomStart !== null) || (zoomEnd !== undefined && zoomEnd !== null);
    }

    _specValue(spec, zoom, noZoom) {
        if (noZoom || zoom === undefined || zoom === '' || zoom === null) {
            return spec;
        }
        return zoom;
    }

    _specValueMin(specYMin, yZoomStart, yZoomEnd, noYZoom, _yMin, _yMax) {
        if (noYZoom) {
            // No zooming
            return specYMin;
        }
        if (yZoomStart !== undefined && yZoomStart !== '' && yZoomStart !== null) {
            // Zooming
            return yZoomStart;
        }
        if (yZoomEnd !== undefined && yZoomEnd !== '' && yZoomEnd !== null) {
            // Other side of zoom range is zoomed
            if (specYMin === '' || specYMin === 'auto' || isNaN(+specYMin)) {
                return this._yZoomMin(_yMin, _yMax, specYMin);
            }
        }
        return specYMin;
    }

    _specValueMax(specYMax, yZoomEnd, yZoomStart, noYZoom, _yMin, _yMax, yType) {
        if (noYZoom) {
            // No zooming
            return specYMax;
        }
        if (yZoomEnd !== undefined && yZoomEnd !== '' && yZoomEnd !== null) {
            // Zooming
            return yZoomEnd;
        }
        if (yZoomStart !== undefined && yZoomStart !== '' && yZoomStart !== null) {
            // Other side of zoom range is zoomed
            if (specYMax === '' || specYMax === 'auto' || isNaN(+specYMax)) {
                return this._yZoomMax(_yMin, _yMax);
            }
        }
        return specYMax;
    }

    __spec(spec) {
        if (spec === '' || spec === undefined || spec === null || spec === 'auto' || isNaN(spec)) {
            return NaN;
        }
        return Number(spec);
    }

    _yZoomMin(_yMin, _yMax, specYMin) {
        if ((specYMin === '' || specYMin === undefined || specYMin === null || specYMin === 'baseline') && _yMin >= 0) {
            return 0;
        }
        const spec = this.__spec(specYMin);
        if (spec <= _yMin) {
            return spec;
        }
        return _yMin - Math.abs(_yMax - _yMin) * 0.25;
    }

    _yZoomMax(_yMin, _yMax, specYMax) {
        const spec = this.__spec(specYMax);
        if (spec >= _yMax) {
            return spec;
        }
        return _yMax + Math.abs(_yMax - _yMin) * 0.25;
    }

    _computeZoomActive(noZoom, noXZoom, xZoomSelect, xZoomDrag, noYZoom, yZoomSelect, yZoomDrag) {
        if (noZoom) {
            return false;
        }
        if ((xZoomSelect || xZoomDrag) && !noXZoom) {
            return true;
        }
        if ((yZoomSelect || yZoomDrag) && !noYZoom) {
            return true;
        }
        return false;
    }

    _enabled(type, minValue, maxValue, zoomStart, zoomEnd) {
        return !PTCS._typeIsFullRange(type, minValue, maxValue, zoomStart, zoomEnd);
    }

    _yEnabled(_yMin, _yMax, yZoomStart, yZoomEnd, specYMin, specYMax) {
        return this._enabled(
            'number',
            this._yZoomMin(_yMin, _yMax, specYMin),
            this._yZoomMax(_yMin, _yMax, specYMax),
            yZoomStart, yZoomEnd);
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
        let reverseXAxis = this.reverseXAxis;
        let reverseYAxis = this.reverseYAxis;
        let d = ev.detail;
        if (this.flipAxes) {
            d = {x: d.y, y: d.x, w: d.h, h: d.w};
            reverseXAxis = !reverseXAxis;
            reverseYAxis = !reverseYAxis;
        }
        if (this.xZoomDrag || this.xZoomSelect) {
            [this.xZoomStart, this.xZoomEnd] = reverseXAxis
                ? invert(xScale, d.x + d.w, d.x) : invert(xScale, d.x, d.x + d.w);
        }
        if (this.yZoomDrag || this.yZoomSelect) {
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

customElements.define(PTCS.ChartBar.is, PTCS.ChartBar);

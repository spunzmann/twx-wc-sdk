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
import './ptcs-chart-core-line.js';


PTCS.ChartLine = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
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
                           x-zoom="[[_showZoomX(noXZoom,xZoomRange,xZoomInterval,xZoomSlider,xZoomDrag,xZoomSelect,noYZoom,flipAxes,yZoomSlider)]]"
                           y-zoom="[[_showZoomY(noYZoom,yZoomRange,yZoomInterval,yZoomSlider,yZoomDrag,yZoomSelect,noXZoom,flipAxes,xZoomSlider)]]"
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
                spark-view="[[sparkView]]"
                graph-width="{{_graphWidth}}"
                graph-height="{{_graphHeight}}">
                <ptcs-chart-core-line id="chart" slot="chart" part="core-chart"
                    tabindex\$="[[_delegatedFocus]]"
                    data="[[data]]"
                    legend="[[legend]]"
                    stack-method="[[stackMethod]]"
                    stack-order="[[stackOrder]]"
                    x-type="[[_xType]]"
                    x-min="{{_xMin}}"
                    x-max="{{_xMax}}"
                    y-type="[[yType]]"
                    y-min="{{_yMin}}"
                    y-max="{{_yMax}}"
                    hide-lines="[[hideLines]]"
                    show-areas="[[showAreas]]"
                    curve="[[_getCurve(chartType, curve)]]"
                    bundle-beta="[[bundleBeta]]"
                    cardinal-tension="[[cardinalTension]]"
                    catmull-rom-alpha="[[catmullRomAlpha]]"
                    step-position="[[stepPosition]]"
                    flip-axes="[[flipAxes]]"
                    reverse-x-axis="[[reverseXAxis]]"
                    reverse-y-axis="[[reverseYAxis]]"
                    x-scale="[[_xScale]]"
                    y-scale="[[_yScale]]"
                    filter-legend="[[_selectedLegend]]"
                    marker="[[_getMarker(sparkView, chartType, hideMarkers, marker)]]"
                    marker-size="[[markerSize]]"
                    show-values="[[_showValues(sparkView, hideValues, showValues)]]"
                    cursor-type="[[_cursorType(pointerType, flipAxes)]]"
                    cursor-target="[[_cursorTarget(dataPointSelection, flipAxes)]]"
                    zoom-select="[[_zoomSelect(xZoomSelect, noXZoom, yZoomSelect, noYZoom)]]"
                    zoom-drag-x="[[_zoomDrag(xZoomDrag, noXZoom)]]"
                    zoom-drag-y="[[_zoomDrag(yZoomDrag, noYZoom)]]"
                    on-selection="_onChartSelection"></ptcs-chart-core-line>
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
            <ptcs-chart-zoom slot="xzoom" id="zoomX" part="zoom-xaxis" hidden\$="[[noXZoom]]"
                             tabindex\$="[[_delegatedFocus]]"
                             type="[[_xType]]"
                             side="[[_xSide(flipXAxis, flipAxes)]]"
                             enable-reset="[[_yEnabled(yType, _yMin, _yMax, yZoomStart, yZoomEnd, specYMin, specYMax)]]"
                             axis-length="[[_xSize(_graphWidth, _graphHeight, flipAxes)]]"
                             min-value="[[_zoomMin(_xMin, _xMax, _xType, specXMin)]]"
                             max-value="[[_zoomMax(_xMin, _xMax, _xType, specXMax)]]"
                             zoom-start="{{xZoomStart}}"
                             zoom-end="{{xZoomEnd}}"
                             min-data="[[_xMin]]"
                             max-data="[[_xMax]]"
                             active="[[_or(_zoomActive, yZoomSlider)]]"
                             range-picker="[[_zoomArg(noXZoom, xZoomRange)]]"
                             interval="[[_zoomArg(noXZoom, xZoomInterval)]]"
                             interval-label="[[xZoomIntervalLabel]]"
                             interval-control="[[xZoomIntervalControl]]"
                             interval-origin="[[xZoomIntervalOrigin]]"
                             show-interval-anchor="[[xShowIntervalAnchor]]"
                             slider="[[_zoomArg(noXZoom, xZoomSlider)]]"
                             reverse-slider="[[reverseXAxis]]"
                             reset-label="[[resetLabel]]"
                             slider-label="[[xZoomSliderLabel]]"
                             slider-min-label="[[xZoomSliderMinLabel]]"
                             slider-max-label="[[xZoomSliderMaxLabel]]"
                             range-start-label="[[xZoomRangeStartLabel]]"
                             range-end-label="[[xZoomRangeEndLabel]]"
                             interval-from-label="[[xZoomIntervalFromLabel]]"
                             interval-to-label="[[xZoomIntervalToLabel]]"></ptcs-chart-zoom>
            <ptcs-chart-axis id="xaxis" slot="xaxis" part="xaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="[[_xType]]"
                zoom="[[_zoom(xZoomStart, xZoomEnd, noXZoom)]]"
                spec-min="[[_specValueMin(specXMin, xZoomStart, xZoomEnd, noXZoom, _xMin, _xMax, _xType)]]"
                spec-max="[[_specValueMax(specXMax, xZoomEnd, xZoomStart, noXZoom, _xMin, _xMax, _xType)]]"
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
                number-format-specifier="[[xAxisNumberFormatSpecifier]]"
                date-format-token="[[xAxisDateFormatToken]]"
                hidden\$="[[hideXAxis]]"></ptcs-chart-axis>
            <ptcs-chart-zoom slot="yzoom" id="zoomY" part="zoom-yaxis" hidden\$="[[noYZoom]]"
                             tabindex\$="[[_delegatedFocus]]"
                             type="[[yType]]"
                             side="[[_ySide(flipYAxis, flipAxes)]]"
                             enable-reset="[[_xEnabled(chartType, xType, _xMin, _xMax, xZoomStart, xZoomEnd)]]"
                             axis-length="[[_ySize(_graphWidth, _graphHeight, flipAxes)]]"
                             min-value="[[_zoomMin(_yMin, _yMax, yType, specYMin)]]"
                             max-value="[[_zoomMax(_yMin, _yMax, yType, specYMax)]]"
                             zoom-start="{{yZoomStart}}"
                             zoom-end="{{yZoomEnd}}"
                             min-data="[[_yMin]]"
                             max-data="[[_yMax]]"
                             active="[[_or(_zoomActive, xZoomSlider)]]"
                             range-picker="[[_zoomArg(noYZoom, yZoomRange)]]"
                             interval="[[_zoomArg(noYZoom, yZoomInterval)]]"
                             interval-label="[[yZoomIntervalLabel]]"
                             interval-control="[[yZoomIntervalControl]]"
                             interval-origin="[[yZoomIntervalOrigin]]"
                             show-interval-anchor="[[yShowIntervalAnchor]]"
                             slider="[[_zoomArg(noYZoom, yZoomSlider)]]"
                             reverse-slider="[[reverseYAxis]]"
                             reset-label="[[resetLabel]]"
                             slider-label="[[yZoomSliderLabel]]"
                             slider-min-label="[[yZoomSliderMinLabel]]"
                             slider-max-label="[[yZoomSliderMaxLabel]]"
                             interval-from-label="[[yZoomIntervalFromLabel]]"
                             interval-to-label="[[yZoomIntervalToLabel]]"></ptcs-chart-zoom>
            <ptcs-chart-axis id="yaxis" slot="yaxis" part="yaxis"
                tabindex\$="[[_delegatedFocus]]"
                type="[[yType]]"
                zoom="[[_zoom(yZoomStart, yZoomEnd, noYZoom)]]"
                spec-min="[[_specValueMin(specYMin, yZoomStart, yZoomEnd, noYZoom, _yMin, _yMax, yType)]]"
                spec-max="[[_specValueMax(specYMax, yZoomEnd, yZoomStart, noYZoom, _yMin, _yMax, yType)]]"
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
                number-format-specifier="[[yAxisNumberFormatSpecifier]]"
                date-format-token="[[yAxisDateFormatToken]]"
                hidden\$="[[hideYAxis]]"></ptcs-chart-axis>
        </ptcs-chart-layout>`;
    }

    static get is() {
        return 'ptcs-chart-line';
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

            // [left] || center || right
            titleAlign: {
                type: String
            },

            // Title label variant
            titleVariant: {
                type: String
            },

            // Notes label
            notesLabel: {
                type: String
            },

            hideNotes: {
                type:  Boolean,
                value: false
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            // top || [bottom] || left || right
            notesPos: {
                type: String
            },

            // [left] || center || right
            notesAlign: {
                type: String
            },

            // X-axis label
            xAxisLabel: {
                type: String
            },

            // [left] || center || right
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

            // [left] || center || right
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

            // Names of legend items, if legend should be visible
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

            // none || square || circle
            legendShape: {
                type: String
            },

            // Filter chart based on legend interaction?
            filterLegend: {
                type: Boolean
            },

            // Legend itemss currently selected in the legend component
            _selectedLegend: {
                type: Array
            },

            sparkView: {
                type:  Boolean,
                value: false
            },

            // Flip x- and y-axes
            flipAxes: {
                type: Boolean
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

            // x-axis type: number || date || string
            xType: {
                type: Object
            },

            _xType: {
                type:     Object,
                computed: '_getXType(chartType, xType)'
            },

            // y-axis type: number || date || string
            yType: {
                type: Object
            },

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
                type:   Object,
                notify: true
            },

            // Maximum x value in data
            _xMax: {
                type:   Object,
                notify: true
            },

            // Minimun y value in data
            _yMin: {
                type:   Object,
                notify: true
            },

            // Maximum y value in data
            _yMax: {
                type:   Object,
                notify: true
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

            // Label for the X-axis range dropdown START (FROM) value
            xZoomRangeStartLabel: {
                type: String
            },

            // Label for the X-axis range dropdown END (TO) value
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

            // X-Axis Zoom Slider Label
            xZoomSliderLabel: {
                type: String
            },

            // X-Axis Zoom Slider Max Label
            xZoomSliderMaxLabel: {
                type: String
            },

            // X-Axis Zoom Slider Min Label
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

            // Show zoom slider
            yZoomSlider: {
                type: Boolean
            },

            // Y-Axis Zoom Slider Label
            yZoomSliderLabel: {
                type: String
            },

            // Y-Axis Zoom Slider Max Label
            yZoomSliderMaxLabel: {
                type: String
            },

            // Y-Axis Zoom Slider Min Label
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

            yShowIntervalAnchor: {
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

            // Specified chart data
            data: {
                type: Array
            },

            // target method: auto (point) || horz || vert || cross
            pointerType: {
                type: String,
            },

            // target method: auto (over) || horz || vert || both
            dataPointSelection: {
                type: String,
            },

            // Stack method: falsy || auto || expand || diverging || silhouette || wiggle
            // (If assigned, enables stacking.)
            stackMethod: {
                type: String,
            },

            // Stack order: auto || reverse || appearance || ascending || descending || insideout
            stackOrder: {
                type: String,
            },

            // Hide curve lines
            hideLines: {
                type: Boolean
            },

            // Show areas under chart lines
            showAreas: {
                type: Boolean
            },

            // linear || basis || bundle || cardinal || catmull-rom || monotone-x || monotone-y || natural || step
            curve: {
                type: String
            },

            // linechart || runchart || stepchart || areachart || scatterchart || streamgraphchart
            chartType: {
                type: String
            },

            // when curve === bundle
            bundleBeta: {
                type: Number
            },

            // when curve === cardinal
            cardinalTension: {
                type: Number
            },

            // when curve === catmull-rom
            catmullRomAlpha: {
                type: Number
            },

            // when curve === step
            stepPosition: {
                type: String, // center || before || after
            },

            hideMarkers: {
                type:  Boolean,
                value: false
            },

            hideValues: {
                type:  Boolean,
                value: false
            },

            // none || square || circle || triangle || plus || cross
            marker: {
                type: String
            },

            // small || medium || large || xlarge || <number>
            markerSize: {
                type: String
            },

            // above || on || below
            showValues: {
                type: String
            },

            hideZeroRuler: {
                type: Boolean
            },

            xAxisNumberFormatSpecifier: {
                type: String
            },

            xAxisDateFormatToken: {
                type: String
            },

            yAxisNumberFormatSpecifier: {
                type: String
            },

            yAxisDateFormatToken: {
                type: String
            },

            _delegatedFocus: String
        };
    }

    ready() {
        super.ready();
        if (this.titleLabel === undefined) {
            this.titleLabel = null;
        }
        if (this.notesLabel === undefined) {
            this.notesLabel = null;
        }
        if (this.flipAxes === undefined) {
            this.flipAxes = false;
        }
        if (this.xType === undefined) {
            this.xType = 'number';
        }
        if (this.yType === undefined) {
            this.yType = 'number';
        }
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

    _getXType(chartType, xType) {
        if (chartType === 'runchart' || chartType === 'streamgraphchart') {
            return 'date';
        }

        return xType;
    }

    _getCurve(chartType, curve) {
        if (chartType === 'stepchart' || chartType === 'scatterchart') {
            return 'step';
        } else if (chartType === 'runchart') {
            return 'monotone-x';
        }

        return curve;
    }

    _hideNotes(nodesLabel, hideNotes) {
        return !nodesLabel || hideNotes;
    }

    _textAlign(align) {
        return align ? `text-align: ${align}` : false;
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

    _getHorizontalAlignment(pos, align) {
        if (pos === 'top' || pos === 'bottom') {
            return align;
        }

        return 'start';
    }

    _getMarker(sparkView, chartType, hideMarkers, marker) {
        return ((sparkView || hideMarkers) && chartType !== 'scatterchart') ? 'none' : marker;
    }

    _showValues(sparkView, hideValues, showValues) {
        return sparkView || hideValues ? 'no' : showValues;
    }

    _showZoom(noZoom, zoomRange, zoomInterval, zoomSlider, zoomDrag, zoomSelect, altZoom) {
        if (noZoom) {
            return altZoom;
        }
        return zoomRange || zoomInterval || zoomSlider || zoomDrag || zoomSelect || altZoom;
    }

    _showZoomX(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, xZoomDrag, xZoomSelect, noYZoom, flipAxes, yZoomSlider) {
        return this._showZoom(noXZoom, xZoomRange, xZoomInterval, xZoomSlider, xZoomDrag, xZoomSelect, !noYZoom && !flipAxes && yZoomSlider);
    }

    _showZoomY(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, yZoomDrag, yZoomSelect, noXZoom, flipAxes, xZoomSlider) {
        return this._showZoom(noYZoom, yZoomRange, yZoomInterval, yZoomSlider, yZoomDrag, yZoomSelect, !noXZoom && flipAxes && xZoomSlider);
    }

    _zoom(zoomStart, zoomEnd, noZoom) {
        if (noZoom) {
            return false;
        }
        return (zoomStart !== undefined && zoomStart !== null) || (zoomEnd !== undefined && zoomEnd !== null);
    }

    _specValueMin(specYMin, zoomStart, zoomEnd, noZoom, min, max, type) {
        if (noZoom) {
            // No zooming
            return specYMin;
        }
        if (zoomStart !== undefined && zoomStart !== '' && zoomStart !== null) {
            // Zooming
            return zoomStart;
        }
        if (zoomEnd !== undefined && zoomEnd !== '' && zoomEnd !== null) {
            // Other side of zoom range is zoomed
            if (specYMin === '' || specYMin === 'auto' || isNaN(+specYMin)) {
                return this._zoomMin(min, max, type, specYMin);
            }
        }
        return specYMin;
    }

    _specValueMax(specMax, zoomEnd, zoomStart, noZoom, min, max, type) {
        if (noZoom) {
            // No zooming
            return specMax;
        }
        if (zoomEnd !== undefined && zoomEnd !== '' && zoomEnd !== null) {
            // Zooming
            return zoomEnd;
        }
        if (zoomStart !== undefined && zoomStart !== '' && zoomStart !== null) {
            // Other side of zoom range is zoomed
            if (specMax === '' || specMax === 'auto' || isNaN(+specMax)) {
                return this._zoomMax(min, max, type, specMax);
            }
        }
        return specMax;
    }

    __spec(spec) {
        if (spec === '' || spec === undefined || spec === null || spec === 'auto' || isNaN(spec)) {
            return NaN;
        }
        return Number(spec);
    }

    _zoomMin(min, max, type, spec) {
        // Labels?
        if (type instanceof Array) {
            if (typeof spec === 'string' && spec !== '') {
                if (type.find(item => item === spec)) {
                    return spec;
                }
            }
            return min;
        }
        // Date?
        if (type === 'date' && min instanceof Date && max instanceof Date) {
            const _spec = spec instanceof Date ? spec.getTime() : undefined;
            return new Date(this._zoomMin(min.getTime(), max.getTime(), 'number', _spec));
        }
        // Number
        if (spec === 'baseline' && min >= 0) {
            return 0;
        }
        const _spec = this.__spec(spec);
        if (_spec <= min) {
            return _spec;
        }
        return min - Math.abs(max - min) * 0.25;
    }

    _zoomMax(min, max, type, spec) {
        // Labels?
        if (type instanceof Array) {
            if (typeof spec === 'string' && spec !== '') {
                if (type.find(item => item === spec)) {
                    return spec;
                }
            }
            return max;
        }
        // Date?
        if (type === 'date' && min instanceof Date && max instanceof Date) {
            const _spec = spec instanceof Date ? spec.getTime() : undefined;
            return new Date(this._zoomMax(min.getTime(), max.getTime(), 'number', _spec));
        }
        // Number
        const _spec = this.__spec(spec);
        if (_spec >= max) {
            return _spec;
        }
        return max + Math.abs(max - min) * 0.25;
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

    _yEnabled(yType, _yMin, _yMax, yZoomStart, yZoomEnd, specYMin, specYMax) {
        return this._enabled(
            yType,
            this._zoomMin(_yMin, _yMax, yType, specYMin),
            this._zoomMax(_yMin, _yMax, yType, specYMax),
            yZoomStart,
            yZoomEnd);
    }

    _xEnabled(chartType, xType, _xMin, _xMax, xZoomStart, xZoomEnd) {
        return this._enabled(
            this._getXType(chartType, xType),
            _xMin, _xMax,
            xZoomStart, xZoomEnd);
    }

    _zoomArg(noZoom, option) {
        return noZoom ? undefined : option;
    }

    _if(a, b, c) {
        return a ? b : c;
    }

    _or(...args) {
        return args.find(v => !!v) || false;
    }

    _cursorType(pointerType, flipAxes) {
        const map = flipAxes ? PTCS.ChartLine.mapPointerTypeFlip : PTCS.ChartLine.mapPointerType;
        return map[pointerType] || pointerType;
    }

    _cursorTarget(dataPointSelection, flipAxes) {
        const map = flipAxes ? PTCS.ChartLine.mapPoinSelectFlip : PTCS.ChartLine.mapPoinSelect;
        return map[dataPointSelection] || dataPointSelection;
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

    refreshData() {
        this.$.chart.refreshData();
    }
};

PTCS.ChartLine.mapPointerType = {horz: 'y', vert: 'x', cross: 'xy'};
PTCS.ChartLine.mapPoinSelect = {horz: 'y', vert: 'x', both: 'xy'};
PTCS.ChartLine.mapPointerTypeFlip = {horz: 'x', vert: 'y', cross: 'xy'};
PTCS.ChartLine.mapPoinSelectFlip = {horz: 'x', vert: 'y', both: 'xy'};

customElements.define(PTCS.ChartLine.is, PTCS.ChartLine);

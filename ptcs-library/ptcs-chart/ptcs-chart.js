import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import './ptcs-chart-layout.js';
import './ptcs-chart-legend.js';
import './ptcs-chart-coord.js';
import './axes/ptcs-chart-axis.js';

import './charts/ptcs-chart-core-bar.js';
import './charts/ptcs-chart-core-line.js';

const __xv = item => item[0];

const _chartConfig = {

    /*
    THE FOLLOWING PROPERTIES ARE HANDLED BY OTHER CONFIGURATION

    xMin:          '{{_xMin}}',
    xMax:          '{{_xMax}}',
    yMin:          '{{_yMin}}',
    yMax:          '{{_yMax}}',

    */

    bar: {
        $host: {
            flipAxes:    false,
            stackMethod: false
        },

        $el:  'ptcs-chart-core-bar',
        data: '_data',

        stackMethod:  'stackMethod',
        stackOrder:   'stackOrder',
        xType:        '_xType',
        yType:        '_yType',
        reverseXAxis: 'reverseXAxis',
        reverseYAxis: 'reverseYAxis',
        xScale:       '_xScale',
        yScale:       '_yScale',
        filterLegend: '_selectedLegend',
        groupPadding: 'groupPadding',
        flipAxes:     'flipAxes',
        showValues:   'showValues'
    },

    column: {
        $isa:  'bar',
        $host: {
            flipAxes:    true,
            stackMethod: null
        },
    },

    line: {
        $host: {
            hideLines:   false,
            showAreas:   false,
            stackMethod: false,
            stackOrder:  'auto',
            marker:      'none',
            flipAxes:    false,
            curve:       'linear',
        },
        $el:  'ptcs-chart-core-line',
        data: '_data',

        stackMethod:  'stackMethod',
        stackOrder:   'stackOrder',
        xType:        '_xType',
        yType:        '_yType',
        reverseXAxis: 'reverseXAxis',
        reverseYAxis: 'reverseYAxis',
        xScale:       '_xScale',
        yScale:       '_yScale',
        filterLegend: '_selectedLegend',
        flipAxes:     'flipAxes',

        hideLines:       'hideLines',
        showAreas:       'showAreas',
        showValues:      'showValues',
        curve:           'curve',
        bundleBeta:      'bundleBeta',
        cardinalTension: 'cardinalTension',
        catmullRomAlpha: 'catmullRomAlpha',
        stepPosition:    'stepPosition',

        marker:     'marker',
        markerSize: 'markerSize'
    },

    area: {
        $isa:  'line',
        $host: {
            hideLines: false,
            showAreas: true
        }
    },

    plot: {
        $isa:  'line',
        $host: {
            hideLines: true,
            showAreas: false,
            marker:    'circle',
        }
    },

    stream: {
        $isa:  'line',
        $host: {
            hideLines:   true,
            showAreas:   true,
            curve:       'catmull-rom',
            stackMethod: 'wiggle',
            stackOrder:  'insideout',
        }
    },

    step: {
        $isa:  'line',
        $host: {
            hideLines:   false,
            showAreas:   false,
            stackMethod: '',
            marker:      'none',
            flipAxes:    false,
            curve:       'step'
        }
    }
};


PTCS.Chart = class extends PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))) {
    static get template() {
        return html`
        <style>
        :host {
            display: block;
        }

        ptcs-chart-axis, [part=legend-area] {
            width: 100%;
            height: 100%;
        }
        </style>

        <ptcs-chart-layout id="chart-layout" style="height:100%" title-pos="[[titlePos]]" notes-pos="[[notesPos]]" legend-pos="[[legendPos]]">
            <div part="title-area" hidden\$="[[!titleLabel]]" slot="title">
                <ptcs-label part="title-label" label="[[titleLabel]]" variant="[[titleVariant]]"></ptcs-label>
            </div>
            <div part="notes-area" hidden\$="[[!notesLabel]]" slot="notes" style\$="text-align:[[notesAlign]]">
                <ptcs-label part="notes-label" label="[[notesLabel]]" variant="label" horizontal-alignment="[[notesAlign]]"></ptcs-label>
            </div>
            <div part="legend-area" hidden\$="[[_hideLedgend(hideLegend, legend)]]" slot="legend">
                <ptcs-chart-legend
                    items="[[legend]]"
                    shape="[[legendShape]]"
                    filter="[[filterLegend]]"
                    horizontal="[[_horizLegend(legendPos)]]"
                    align="[[legendAlign]]"
                    selected="{{_selectedLegend}}"></ptcs-chart-legend>
            </div>
            <ptcs-chart-coord slot="chart" part="chart" id="coord"
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
                graph-height="{{_graphHeight}}">
                <ptcs-chart-axis slot="xaxis" part="xaxis"
                    type="[[_xType]]"
                    spec-min="[[specXMin]]"
                    spec-max="[[specXMax]]"
                    side="[[_xSide(flipXAxis, flipAxes)]]"
                    label="[[xAxisLabel]]"
                    align-label="[[xAxisAlign]]"
                    min-value="[[_xMin]]"
                    max-value="[[_xMax]]"
                    size="[[_xSize(_graphWidth, _graphHeight, flipAxes)]]"
                    ticks="{{_xTicks}}"
                    reverse="[[reverseXAxis]]"
                    scale="{{_xScale}}"
                    hidden\$="[[hideXAxis]]"
                    outer-padding="[[outerPadding]]"
                    inner-padding="[[innerPadding]]"></ptcs-chart-axis>
                <ptcs-chart-axis slot="yaxis" part="yaxis"
                    type="[[_yType]]"
                    spec-min="[[specYMin]]"
                    spec-max="[[specYMax]]"
                    side="[[_ySide(flipYAxis, flipAxes)]]"
                    label="[[yAxisLabel]]"
                    align-label="[[yAxisAlign]]"
                    min-value="[[_yMin]]"
                    max-value="[[_yMax]]"
                    size="[[_ySize(_graphWidth, _graphHeight, flipAxes)]]"
                    ticks="{{_yTicks}}"
                    reverse="[[reverseYAxis]]"
                    scale="{{_yScale}}"
                    hidden\$="[[hideYAxis]]"></ptcs-chart-axis>

                    <!--
                    <div slot="xaxis2">VER3
                    chartType: [[chartType]] |
                    xType: [[xType]] |
                    _xType: [[_xType]] |
                    xMin: [[_xMin]] |
                    xMax: [[_xMax]] |
                    yType: [[yType]] |
                    _yType: [[_yType]] |
                    yMin: [[_yMin]] |
                    yMax: [[_yMax]] |
                    x-min="[[_xMin]]"
                    x-max="[[_xMax]]"
                    y-min="[[_yMin]]"
                    y-max="[[_yMax]]"
                    hideLegend="[[hideLegend]]"
                    hideLines="[[hideLines]]"
                    showAreas="[[showAreas]]"
                    curve="[[curve]]"
                    </div>
                    -->

                    <!--
                <ptcs-chart-core-bar slot="chart" id="chart" part="core-chart"
                    data="[[data]]"
                    stack-method="[[stackMethod]]"
                    stack-order="[[stackOrder]]"
                    x-type="[[labels]]"
                    x-min="{{_xMin}}"
                    x-max="{{_xMax}}"
                    y-min="{{_yMin}}"
                    y-max="{{_yMax}}"
                    flip-axes="[[flipAxes]]"
                    reverse-x-axis="[[reverseXAxis]]"
                    reverse-y-axis="[[reverseYAxis]]"
                    x-scale="[[_xScale]]"
                    y-scale="[[_yScale]]"
                    filter-legend="[[_selectedLegend]]"
                    show-values="[[showValues]]"
                    group-padding="[[groupPadding]]"></ptcs-chart-core-bar>
                    -->
            </ptcs-chart-coord>
        </ptcs-chart-layout>`;
    }

    static get is() {
        return 'ptcs-chart';
    }

    static get properties() {
        return {
            chartType: {
                type:     String,
                observer: '_chartTypeChanged'
            },

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
                type: String
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
                type: Boolean
            },

            // Y-axis label
            yAxisLabel: {
                type: String
            },

            yAxisAlign: {
                type: String
            },

            hideYAxis: {
                type: Boolean
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

            // Specified x-axis type: number || date || [string]
            xType: {
                type: Object
            },

            // Computed x-axis type
            _xType: {
                type: Object
            },

            // Specified y-axis type: number || date || string
            yType: {
                type: Object
            },

            // Computed y-axis type
            _yType: {
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

            // Specified chart data
            data: {
                type: Array
            },

            // Computed chart data
            _data: {
                type: Array
            },

            // Stack method: falsy || auto || expand || diverging || silhouette || wiggle
            stackMethod: {
                type: String,
            },

            // Stack order: auto || reverse || appearance || ascending || descending || insideout
            stackOrder: {
                type: String,
            },

            showValues: {
                type: String
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

            // none || square || circle || triangle || plus || cross
            marker: {
                type: String
            },

            // small || medium || large || xlarge || <number>
            markerSize: {
                type: String
            },

            __observers: {
                type:  Object,
                value: () => ({})
            }
        };
    }

    static get observers() {
        return [
            '_dataChanged(data.*)',
            '_updateType(chartType, _data, xType, yType)'
        ];
    }

    ready() {
        super.ready();
        if (this.titleLabel === undefined) {
            this.titleLabel = null;
        }
        if (this.notesLabel === undefined) {
            this.notesLabel = null;
        }
    }

    _resolveChartType(chartType) {
        const cfg = _chartConfig[chartType];
        if (!cfg) {
            return {};
        }

        const r = cfg.$isa ? this._resolveChartType(cfg.$isa) : {$host: {}};

        for (const k in cfg.$host) {
            r.$host[k] = cfg.$host[k];
        }

        for (const k in cfg) {
            if (k !== '$host') {
                r[k] = cfg[k];
            }
        }

        return r;
    }

    _createCoreChart(ctor, elOld) {
        let el;

        if (elOld && elOld.tagName === ctor.$el.toUpperCase()) {
            el = elOld;
        } else {
            el = document.createElement(ctor.$el);
            el.setAttribute('slot', 'chart');
            el.setAttribute('part', 'core-chart');

            // Connect chart to axes
            el.addEventListener('x-min-changed', ev => {
                this._xMin = ev.detail.value;
            });
            el.addEventListener('x-max-changed', ev => {
                this._xMax = ev.detail.value;
            });
            el.addEventListener('y-min-changed', ev => {
                this._yMin = ev.detail.value;
            });
            el.addEventListener('y-max-changed', ev => {
                this._yMax = ev.detail.value;
            });
        }

        // Connect core chart properties to chart (this) properties
        const props = {};

        for (const k in ctor) {
            if (k[0] === '$') {
                continue;
            }
            const mapTo = ctor[k];

            if (typeof mapTo === 'string') {
                const propName = mapTo;
                const funcName = `__${propName}Changed$`;
                if (!this[funcName]) {
                    const func = newVal => {
                        //console.log(`observedProperty ${k} changed`); // to ${newVal}`);
                        const _charts = this.$.coord.querySelectorAll('[part=core-chart]');
                        for (let i = 0; i < _charts.length; i++) {
                            if (_charts[i].__props[k]) {
                                _charts[i][k] = newVal;
                            }
                        }
                    };
                    this[funcName] = func;
                    this._createPropertyObserver(propName, funcName, false);
                }
                el[k] = this[propName];
                props[k] = true;
            } else if (mapTo.value) {
                el[k] = mapTo.value;
            }
        }

        el.__props = props;

        return el;
    }

    _chartTypeChanged(chartType) {
        const ctor = this._resolveChartType(chartType);
        const coord = this.$.coord;
        const charts = coord.querySelectorAll('[part=core-chart]');
        for (let i = 0; i < charts.length; i++) {
            coord.removeChild(charts[i]);
        }

        if (!ctor || !ctor.$el) {
            console.error('INVALID chart-type: ' + JSON.stringify(chartType));
            return;
        }

        // Assign host properties for this chart type
        for (const k in ctor.$host) {
            this[k] = ctor.$host[k];
        }

        const el = this._createCoreChart(ctor, charts[0]);

        coord.appendChild(el);
    }

    _hideLedgend(hideLegend, legend) {
        return hideLegend || !(legend instanceof Array) || !(legend.length > 0);
    }

    _horizLegend(legendPos) {
        return legendPos === 'top' || legendPos === 'bottom';
    }

    _xSide(flipXAxis, flipAxes) {
        // eslint-disable-next-line no-nested-ternary
        return flipAxes ? (flipXAxis ? 'right' : 'left') : (flipXAxis ? 'top' : 'bottom');
    }

    _ySide(flipXAxis, flipAxes) {
        // eslint-disable-next-line no-nested-ternary
        return flipAxes ? (flipXAxis ? 'top' : 'bottom') : (flipXAxis ? 'right' : 'left');
    }

    _xSize(_graphWidth, _graphHeight, flipAxes) {
        return flipAxes ? _graphHeight : _graphWidth;
    }

    _ySize(_graphWidth, _graphHeight, flipAxes) {
        return flipAxes ? _graphWidth : _graphHeight;
    }

    _dataChanged(cr) {
        const data = cr.base;

        // FOR NOW: Auto-convert INFOTABLE
        if (data.rows && data.dataShape && data.dataShape.fieldDefinitions && data.dataShape.fieldDefinitions.x &&
            data.dataShape.fieldDefinitions.y) {
            /*
            {
                dataShape: {
                    fieldDefinitions : {
                        x: { name: 'x', baseType: 'STRING' },
                        y: { name: 'y', baseType: 'JSON' }
                    }
                },
                rows: [
                    {x: 'APPLE', y: [1, 3, 5]},
                    {x: 'BANANA', y: [2, 4, 8]},
                    {x: 'ORANGE', y: [3, 7, 9]},
                ]
            }
            */
            //console.log(`CONVERT INFOTABLE ${data.dataShape.fieldDefinitions.x.baseType} : ${data.dataShape.fieldDefinitions.y.baseType}`);
            let _data = data.rows.map(item => [item.x, item.y.array]);
            _data.xType = data.dataShape.fieldDefinitions.x.baseType;
            _data.yType = data.dataShape.fieldDefinitions.y.baseType;
            this._data = _data;
        } else if (data instanceof Array) {
            this._data = data;
        } else {
            this.data = [];
        }

        this.refreshData();
    }

    _updateType(chartType, _data, xType, yType) {
        if (!(_data instanceof Array)) {
            // No data
            return;
        }

        if (xType) {
            this._xType = xType;
        } else if (chartType === 'bar' || chartType === 'column') {
            this._xType = _data.map((item, i) => __xv(item));
        } else {
            switch (_data.xType) {
                case 'DATETIME':
                    this._xType = 'date';
                    break;

                case 'INTEGER':
                case 'LONG':
                case 'NUMBER':
                    this._xType = 'number';
                    break;

                default:
                    this._xType = _data.map((item, i) => __xv(item));
            }
        }

        if (yType) {
            this._yType = yType;
        } else {
            switch (_data.yType) {
                case 'DATETIME':
                    this._yType = 'date';
                    break;

                case 'INTEGER':
                case 'LONG':
                case 'NUMBER':
                case 'VEC2':
                case 'VEC3':
                case 'VEC4':
                case 'VEC': // our extended basetype
                case 'JSON':
                    this._yType = 'number';
                    break;

                // TODO: what if yType is a label?
                default:
                    this._yType = 'number';
                //    this._xType = _data.map((item, i) => __xv(item));
            }
        }

        this.refreshData();
    }

    refreshData() {
        //console.log('--- refreshData ---');
        //this.$.chart.refreshData();
        const charts = this.$.coord.querySelectorAll('[part=core-chart]');
        for (let i = 0; i < charts.length; i++) {
            if (charts[i].refreshData) {
                charts[i].refreshData();
            }
        }
    }
};

customElements.define(PTCS.Chart.is, PTCS.Chart);

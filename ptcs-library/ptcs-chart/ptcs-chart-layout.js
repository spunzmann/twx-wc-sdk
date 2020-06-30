import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-binary/ptcs-behavior-binary.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';

/* Don't need a warning to make sure I have not confused "=>" with ">=" or "<=" */
/* eslint-disable no-confusing-arrow */

PTCS.ChartLayout = class extends PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))) {
    static get template() {
        return html`
    <style>
    :host {
        display: grid;
        overflow: hidden;
        box-sizing: border-box;
    }

    [part=notes]:not([hidden]) {
        display: flex;
    }

    [part=notes][align=center] {
        align-items: center;
        justify-content: center;
    }

    [part=notes][align=end] {
        align-items: flex-end;
    }

    [part=notes][align=right] {
        justify-content: flex-end;
    }
    </style>

    <div part="title" hidden\$="[[_hidden(sparkView, hideTitle)]]"><slot name="title"></slot></div>
    <div part="notes" hidden\$="[[_hidden(sparkView, hideNotes)]]"
         align\$="[[notesAlign]]"><slot name="notes"></slot></div>
    <div part="chart"><slot name="chart"></slot></div>
    <div part="legend" hidden\$="[[_hidden(sparkView, hideLegend)]]"><slot name="legend"></slot></div>
    <div part="xzoom"><slot name="xzoom"></slot></div>
    <div part="xaxis"><slot name="xaxis"></slot></div>
    <div part="xaxis2"></div>
    <div part="yzoom"><slot name="yzoom"></slot></div>
    <div part="yaxis"><slot name="yaxis"></slot></div>
    <div part="yaxis2"></div>`;
    }

    static get is() {
        return 'ptcs-chart-layout';
    }

    static get properties() {
        return {
            // [top] || bottom || left || right
            titlePos: {
                type:               String,
                reflectToAttribute: true
            },

            hideTitle: {
                type: Boolean,
            },

            // top || [bottom] || left || right
            notesPos: {
                type:               String,
                reflectToAttribute: true
            },

            hideNotes: {
                type: Boolean,
            },

            // start || center || end
            notesAlign: {
                type: String
            },

            // top || bottom || left || [right]
            legendPos: {
                type:               String,
                reflectToAttribute: true
            },

            hideLegend: {
                type: Boolean,
            },

            // Show xAxis area, unless sparkView
            xAxis: {
                type: Boolean
            },

            // Show yAxis area, unless sparkView
            yAxis: {
                type: Boolean
            },

            // Show secondary xAxis area, unless sparkView
            xAxis2: {
                type: Boolean
            },

            // Show secondary yAxis area, unless sparkView
            yAxis2: {
                type: Boolean
            },

            // Zooming of some kind is enabled, so we will need a reset button
            zoom: {
                type: Boolean
            },

            // Show xzoom area, unless sparkView
            xZoom: {
                type: Boolean
            },

            // Show yzoom area, unless sparkView
            yZoom: {
                type: Boolean
            },

            // Flip axes (change place on xaxis/xzoom and yaxis/yzoom)
            flipAxes: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // Flip XAxis side
            flipXAxis: {
                type: Boolean
            },

            // Flip YAxis side
            flipYAxis: {
                type: Boolean
            },

            // Hide everything except the chart pane
            sparkView: {
                type:  Boolean,
                value: false
            },

            // Is the view narrow (mobile)?
            narrow: {
                type: Boolean
            },

            // Effective title position
            effTitlePos: {
                type:               String,
                notify:             true,
                reflectToAttribute: true
            },

            // Effective notes position
            effNotesPos: {
                type:               String,
                notify:             true,
                reflectToAttribute: true
            },

            // Effective legend position
            effLegendPos: {
                type:               String,
                notify:             true,
                reflectToAttribute: true
            },

            _resizeObserver: ResizeObserver

        };
    }

    static get observers() {
        return [
            '_change(titlePos, hideTitle, notesPos, hideNotes, legendPos, hideLegend, sparkView, narrow)',
            // eslint-disable-next-line max-len
            '_updateLayout(effTitlePos, effNotesPos, effLegendPos, sparkView, flipAxes, flipXAxis, flipYAxis, xAxis, yAxis, xAxis2, yAxis2, xZoom, yZoom)'
        ];
    }

    ready() {
        super.ready();
        this._resizeObserver = new ResizeObserver(entries => {
            const rect = entries[0].contentRect;
            this.narrow = rect.width <= 480;
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this._resizeObserver.observe(this);
    }

    disconnectedCallback() {
        this._resizeObserver.unobserve(this);
        super.disconnectedCallback();
    }

    _hidden(sparkView, hide) {
        return sparkView || hide;
    }

    _change(titlePos, hideTitle, notesPos, hideNotes, legendPos, hideLegend, sparkView, narrow) {
        // Resolve value
        function prop(pos, hide, dflt) {
            if (hide) {
                return '';
            }
            if (narrow && (pos === 'left' || pos === 'right')) {
                return dflt;
            }
            return pos || dflt;
        }
        // Resolve title value (can only be "top" (default) or "bottom")
        function propTitle() {
            if (hideTitle) {
                return '';
            }
            // top || bottom
            return titlePos !== 'bottom' ? 'top' : titlePos;
        }

        // Compute effective values
        this.setProperties({
            effTitlePos:  propTitle(),
            effNotesPos:  prop(notesPos, sparkView || hideNotes, 'top'),
            effLegendPos: prop(legendPos || 'right', sparkView || hideLegend, 'top')
        });
    }

    _updateLayout(/*effTitlePos, effNotesPos, effLegendPos, sparkView, flipAxes, flipXAxis, flipYAxis, xAxis, yAxis, xAxis2, yAxis2, xZoom, yZoom*/) {
        // Debounce layout computations
        if (!this.__callUpdateLayout) {
            this.__callUpdateLayout = true;
            requestAnimationFrame(() => {
                this.__callUpdateLayout = false;
                this.__updateLayout();
            });
        }
    }

    __updateLayout() {
        // Select axis visibility
        const f1 = (a, b, fab) => fab ? b : a;
        const f = this.sparkView
            ? (() => false)
            : ((a1, a2, fa, b1, b2, fb) => this.flipAxes ? f1(b1, b2, fb) : f1(a1, a2, fa));

        // Compute active areas
        const [title, notes, legend] = [this.effTitlePos, this.effNotesPos, this.effLegendPos];
        const [xa, xa2, fx] = [this.xAxis, this.xAxis2, this.flipXAxis];
        const [ya, ya2, fy] = [this.yAxis, this.yAxis2, this.flipYAxis];
        const xAxis = f(xa, xa2, fx, ya, ya2, fy);
        const xAxis2 = f(xa2, xa, fx, ya2, ya, fy);
        const yAxis = f(ya, ya2, fy, xa, xa2, fx);
        const yAxis2 = f(ya2, ya, fy, xa2, xa, fx);

        const zoom = this.zoom || this.xZoom || this.yZoom;
        const _xZoom = (this.xZoom || (!this.flipAxes && zoom)) && !this.sparkView;
        const _yZoom = (this.yZoom || (this.flipAxes && zoom)) && !this.sparkView;
        const [xZoom, yZoom] = this.flipAxes ? [_yZoom, _xZoom] : [_xZoom, _yZoom];

        // Diagnotic functions
        const left = v => v === 'left';
        const right = v => v === 'right';
        const top = v => v === 'top';
        const bottom = v => v === 'bottom';
        const vert = v => v === 'left' || v === 'right';
        const horz = v => v === 'top' || v === 'bottom';

        // List of actual sides
        const posList = [title, notes, legend].filter(s => !!s);

        let row = 1; // Number of rows
        let col = 1; // Number of columns

        // Chart region
        const chartP = {x: 1, y: 1};

        posList.forEach(pos => {
            if (vert(pos)) {
                col++;
                if (left(pos)) {
                    chartP.x++;
                }
            } else {
                row++;
                if (top(pos)) {
                    chartP.y++;
                }
            }
        });

        // Compute legend position (always closest to chart)
        const legendP = {x: chartP.x, y: chartP.y};
        switch (legend) {
            case 'top':
                legendP.y--;
                break;
            case 'bottom':
                legendP.y++;
                break;
            case 'left':
                legendP.x--;
                break;
            case 'right':
                legendP.x++;
                break;
        }
        legendP.x2 = legendP.x + 1;

        // Compute title position (may depend on legend)
        // title x is not used any longer, since titles can only be 'top' or 'bottom' nowadays
        // eslint-disable-next-line no-unused-vars
        let titleY;
        switch (title) {
            case 'top':
                titleY = 1;
                break;
            case 'bottom':
                titleY = bottom(legend) ? legendP.y + 1 : chartP.y + 1;
                break;
        }

        // Compute notes position (may depend on title and legend)
        const notesP = {x: chartP.x, y: chartP.y};
        switch (notes) {
            case 'top':
                notesP.y = title !== 'top' ? 1 : 2;
                break;
            case 'bottom':
                notesP.y = row;
                break;
            case 'left':
                notesP.x = 1;
                notesP.y = chartP.y;
                break;
            case 'right':
                notesP.x = right(legend) ? legendP.x + 1 : chartP.x + 1;
                notesP.y = chartP.y;
                break;
        }

        const addRow = () => {
            row++;
            if (bottom(title)) {
                titleY++;
            }
            if (bottom(notes)) {
                notesP.y++;
            }
            if (bottom(legend)) {
                legendP.y++;
            }
        };

        const addCol = () => {
            col++;
            if (right(notes)) {
                notesP.x++;
            }
            if (right(legend)) {
                legendP.x++;
                legendP.x2++;
            } else if (horz(legend)) {
                legendP.x2++;
            }
        };

        // xAxis: unshift a row after the chart area
        if (xAxis) {
            addRow();
        }

        // xAxis2: unshift a row before the chart area
        if (xAxis2) {
            addRow();
            chartP.y++; // Shift chart down one step
        }

        // yAxis: unshift a row after the chart area
        if (yAxis) {
            addCol();
            chartP.x++; // Shift chart right one step
        }

        // yAxis2: add a column after the chart area
        if (yAxis2) {
            addCol();
        }

        // xzoom: append a row at the end of the chart strucure for the xzoom area
        if (xZoom) {
            row++;
        }

        // yzoom: unshift a column for the yzoom area
        if (yZoom) {
            addCol();
            chartP.x++; // Shift chart right one step
        }

        // generate grid-template-columns / -rows
        const g = (v, c) => (v === c - 1) ? 'minmax(0, 1fr)' : 'auto';
        const tc = [...Array(col).keys()].map(cno => g(cno, chartP.x));
        const tr = [...Array(row).keys()].map(rno => g(rno, chartP.y));

        const elChart = this.shadowRoot.querySelector('[part=chart]');
        const elTitle = this.shadowRoot.querySelector('[part=title]');
        const elNotes = this.shadowRoot.querySelector('[part=notes]');
        const elLegend = this.shadowRoot.querySelector('[part=legend]');
        let elXAxis = this.shadowRoot.querySelector('[part=xaxis]');
        let elYAxis = this.shadowRoot.querySelector('[part=yaxis]');
        let elXAxis2 = this.shadowRoot.querySelector('[part=xaxis2]');
        let elYAxis2 = this.shadowRoot.querySelector('[part=yaxis2]');
        let elXZoom = this.shadowRoot.querySelector('[part=xzoom]');
        let elYZoom = this.shadowRoot.querySelector('[part=yzoom]');

        if (this.flipXAxis) {
            [elXAxis, elXAxis2] = [elXAxis2, elXAxis];
        }
        if (this.flipYAxis) {
            [elYAxis, elYAxis2] = [elYAxis2, elYAxis];
        }
        if (this.flipAxes) {
            [elXAxis, elYAxis, elXAxis2, elYAxis2, elXZoom, elYZoom] =
            [elYAxis, elXAxis, elYAxis2, elXAxis2, elYZoom, elXZoom];
        }

        this.style.gridTemplateColumns = tc.join(' ');
        this.style.gridTemplateRows = tr.join(' ');

        elChart.style.gridColumn = `${chartP.x}`;
        elChart.style.gridRow = `${chartP.y}`;

        if (legend) {
            elLegend.style.gridColumn = `${legendP.x} / ${legendP.x2}`;
            if (vert(legend)) {
                // Stretch down to end of chart / bottom xaxis
                elLegend.style.gridRow = `${legendP.y} / ${chartP.y + (xAxis ? 2 : 1)}`;
            } else {
                elLegend.style.gridRow = `${legendP.y}`;
            }
            elLegend.style.display = '';
        } else {
            elLegend.style.display = 'none';
        }
        if (title) {
            elTitle.style.gridColumn = `1/${col + 1}`;
            elTitle.style.gridRow = `${titleY}`;
            elTitle.style.display = '';
        } else {
            elTitle.style.display = 'none';
        }
        if (horz(notes)) {
            elNotes.style.gridColumn = `1/${col + 1}`;
            elNotes.style.gridRow = `${notesP.y}`;
            elNotes.style.display = '';
        } else if (vert(notes)) {
            elNotes.style.gridColumn = `${notesP.x}`;
            elNotes.style.gridRow = `${notesP.y}/${row + 1}`;
            elNotes.style.display = '';
        } else {
            elNotes.style.display = 'none';
        }
        if (xAxis) {
            elXAxis.style.gridColumn = `${chartP.x}`;
            elXAxis.style.gridRow = `${chartP.y + 1}`;
            elXAxis.style.display = '';
        } else {
            elXAxis.style.display = 'none';
        }
        if (xAxis2) {
            elXAxis2.style.gridColumn = `${chartP.x}`;
            elXAxis2.style.gridRow = `${chartP.y - 1}`;
            elXAxis2.style.display = '';
        } else {
            elXAxis2.style.display = 'none';
        }
        if (yAxis) {
            elYAxis.style.gridColumn = `${chartP.x - 1}`;
            elYAxis.style.gridRow = `${chartP.y}`;
            elYAxis.style.display = '';
        } else {
            elYAxis.style.display = 'none';
        }
        if (yAxis2) {
            elYAxis2.style.gridColumn = `${chartP.x + 1}`;
            elYAxis2.style.gridRow = `${chartP.y}`;
            elYAxis2.style.display = '';
        } else {
            elYAxis2.style.display = 'none';
        }
        if (xZoom) {
            elXZoom.style.gridColumn = `${chartP.x}/${col + 1}`;
            elXZoom.style.gridRow = `${row}`;
            elXZoom.style.display = '';
        } else {
            elXZoom.style.display = 'none';
        }
        if (yZoom) {
            elYZoom.style.gridColumn = `${chartP.x - (yAxis ? 2 : 1)}`;
            elYZoom.style.gridRow = `${chartP.y}`;
            elYZoom.style.display = '';
        } else {
            elYZoom.style.display = 'none';
        }
    }
};

customElements.define(PTCS.ChartLayout.is, PTCS.ChartLayout);

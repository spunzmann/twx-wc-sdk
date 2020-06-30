import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-binary/ptcs-behavior-binary.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import {select} from 'd3-selection';

PTCS.ChartCoord = class extends PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))) {
    static get template() {
        return html`
    <style>
    :host {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr auto;
    }

    [part=chart] {
        grid-column: 2;
        grid-row: 2;
    }

    [part=rulers] {
        grid-column: 2;
        grid-row: 2;
        position: relative;
        pointer-events: none;
    }

    /* X-axis */
    :host(:not([flip-axes]):not([flip-x-axis])) [part=xaxis] {
        grid-column: 2;
        grid-row: 3;
    }

    :host(:not([flip-axes])[flip-x-axis]) [part=xaxis] {
        grid-column: 2;
        grid-row: 1;
    }

    :host([flip-axes]:not([flip-x-axis])) [part=xaxis] {
        grid-column: 1;
        grid-row: 2;
    }

    :host([flip-axes][flip-x-axis]) [part=xaxis] {
        grid-column: 3;
        grid-row: 2;
    }

    /* X-axis2 */
    :host(:not([flip-axes]):not([flip-x-axis])) [part=xaxis2] {
        grid-column: 2;
        grid-row: 1;
    }

    :host(:not([flip-axes])[flip-x-axis]) [part=xaxis2] {
        grid-column: 2;
        grid-row: 3;
    }

    :host([flip-axes]:not([flip-x-axis])) [part=xaxis2] {
        grid-column: 3;
        grid-row: 2;
    }

    :host([flip-axes][flip-x-axis]) [part=xaxis2] {
        grid-column: 1;
        grid-row: 2;
    }

    /* Y-axis */
    :host(:not([flip-axes]):not([flip-y-axis])) [part=yaxis] {
        grid-column: 1;
        grid-row: 2;
    }

    :host(:not([flip-axes])[flip-y-axis]) [part=yaxis] {
        grid-column: 3;
        grid-row: 2;
    }

    :host([flip-axes]:not([flip-y-axis])) [part=yaxis] {
        grid-column: 2;
        grid-row: 3;
    }

    :host([flip-axes][flip-y-axis]) [part=yaxis] {
        grid-column: 2;
        grid-row: 1;
    }

    /* Y-axis2 */
    :host(:not([flip-axes]):not([flip-y-axis])) [part=yaxis2] {
        grid-column: 3;
        grid-row: 2;
    }

    :host(:not([flip-axes])[flip-y-axis]) [part=yaxis2] {
        grid-column: 1;
        grid-row: 2;
    }

    :host([flip-axes]:not([flip-y-axis])) [part=yaxis2] {
        grid-column: 2;
        grid-row: 1;
    }

    :host([flip-axes][flip-y-axis]) [part=yaxis2] {
        grid-column: 2;
        grid-row: 3;
    }

    /* Y-rulers */
    :host(:not([show-y-rulers])) #yticks {
        display: none;
    }

    [part~=y-ruler] {
        position: absolute;
    }

    :host(:not([flip-axes])) [part~=y-ruler] {
        left: -4px;
        right: 0;
        top: 0;
        height: 1px;
    }

    :host(:not([flip-axes])[flip-y-axis]) [part~=y-ruler] {
        left: 0;
        right: -4px;
    }

    :host([flip-axes]) [part~=y-ruler] {
        top: 0;
        bottom: -4px;
        left: 0;
        width: 1px;
    }

    :host([flip-axes][flip-y-axis]) [part~=y-ruler] {
        top: -4px;
        bottom: 0;
    }

    :host(:not([show-x-rulers])) #xticks {
        display: none;
    }

    /* X-ruler */
    [part~=x-ruler] {
        position: absolute;
    }

    :host(:not([flip-axes])) [part~=x-ruler] {
        top: 0;
        bottom: -4px;
        left: 0;
        width: 1px;
    }

    :host(:not([flip-axes])[flip-x-axis]) [part~=x-ruler] {
        top: -4px;
        bottom: 0;
    }

    :host([flip-axes]) [part~=x-ruler] {
        left: -4px;
        right: 0;
        top: 0;
        height: 1px;
    }

    :host([flip-axes][flip-y-axis]) [part~=x-ruler] {
        left: 0;
        right: -4px;
    }

    /* Zero-ruler */
    :host([hide-zero-ruler]) [part~=zero-ruler] {
        display: none;
    }

    [part~=zero-ruler] {
        position: absolute;
    }

    :host(:not([flip-axes])) [part~=zero-ruler] {
        top: 0;
        height: 2px;
        left: 0;
        right: 0;
    }

    :host([flip-axes]) [part~=zero-ruler] {
        left: 0;
        width: 2px;
        top: 0;
        bottom: 0;
    }

    :host([front-rulers]) [part=rulers] {
        z-index: 12;
    }
    </style>

    <div part="xaxis"><slot name="xaxis"></slot></div>
    <div part="yaxis"><slot name="yaxis"></slot></div>
    <div part="xaxis2"><slot name="xaxis2"></slot></div>
    <div part="yaxis2"><slot name="yaxis2"></slot></div>
    <div part="rulers" hidden\$="[[sparkView]]"><div id="xticks"></div><div id="yticks"></div><div id="zero" part="zero-ruler ruler"></div></div>
    <div part="chart"><slot name="chart"></slot></div>`;
    }

    static get is() {
        return 'ptcs-chart-coord';
    }

    static cmpNumber(a, b) {
        return a - b;
    }

    static cmpDate(a, b) {
        return a.getTime() - b.getTime();
    }

    static get properties() {
        return {
            // Swap xaxis and xaxis2
            flipXAxis: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // Swap yaxis and yaxis2
            flipYAxis: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // Flip axes (change place on xaxes and yaxes)
            flipAxes: {
                type:               Boolean,
                reflectToAttribute: true
            },

            hideZeroRuler: {
                type:               Boolean,
                reflectToAttribute: true
            },

            showXRulers: {
                type:               Boolean,
                reflectToAttribute: true
            },

            frontRulers: {
                type:               Boolean,
                reflectToAttribute: true
            },

            xTicks: {
                type: Array
            },

            showYRulers: {
                type:               Boolean,
                reflectToAttribute: true
            },

            yTicks: {
                type: Array
            },

            _resizeObserver: ResizeObserver,

            graphWidth: {
                type:   Number,
                notify: true
            },

            graphHeight: {
                type:   Number,
                notify: true
            },

            // Hide rulers on spark mode
            sparkView: {
                type:  Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_xticks(flipAxes, showXRulers, xTicks)',
            '_yticks(flipAxes, showYRulers, yTicks)'
        ];
    }

    ready() {
        super.ready();
        this._resizeObserver = new ResizeObserver(entries => {
            const rect = entries[0].contentRect;
            this.setProperties({graphWidth: rect.width, graphHeight: rect.height});
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this._resizeObserver.observe(this.shadowRoot.querySelector('[part=chart]'));
    }

    disconnectedCallback() {
        this._resizeObserver.unobserve(this.shadowRoot.querySelector('[part=chart]'));
        super.disconnectedCallback();
    }

    _xticks(flipAxes, showXRulers, xTicks) {
        if (!showXRulers || !(xTicks instanceof Array)) {
            return;
        }

        const setPos = flipAxes
            ? d => `translate(0,${d.offs}px)`
            : d => `translate(${d.offs}px,0)`;

        const join = select(this.$.xticks)
            .selectAll('[part="ruler x-ruler"]')
            .data(xTicks);

        // Enter
        join.enter()
            .append('div')
            .attr('part', 'ruler x-ruler')
            .style('transform', setPos);

        // Update
        join.style('transform', setPos);

        // Exit
        join.exit().remove();
    }

    _yticks(flipAxes, showYRulers, yTicks) {
        if (!(yTicks instanceof Array)) {
            return;
        }
        const setPos = flipAxes
            ? d => `translate(${d.offs}px,0)`
            : d => `translate(0,${d.offs}px)`;

        // Zero ruler
        this._showZeroRuler(flipAxes, this.flipYAxis, yTicks, setPos);

        // Ruler Grid
        if (!showYRulers) {
            return;
        }

        const join = select(this.$.yticks)
            .selectAll('[part="ruler y-ruler"]')
            .data(yTicks);

        // Enter
        join.enter()
            .append('div')
            .attr('part', 'ruler y-ruler')
            .style('transform', setPos);

        // Update
        join.style('transform', setPos);

        // Exit
        join.exit().remove();
    }

    // Zero ruler
    _showZeroRuler(flipAxes, flipYAxis, yTicks, setPos) {
        const zeroPt = yTicks.find(t => t.value === 0);
        const zeroEl = this.$.zero;
        const style = zeroEl.style;
        if (zeroPt) {
            const limit = flipAxes ? this.graphWidth : this.graphHeight;
            // Show zero line if it is not at top nor at the bottom
            if (Math.abs(zeroPt.offs) > 2 && Math.abs(limit - zeroPt.offs) > 2) {
                const zeroDim = flipAxes ? zeroEl.clientWidth : zeroEl.clientHeight;
                style.transform = setPos({offs: zeroPt.offs - zeroDim / 2 + 1});
                style.display = '';
                return;
            }
        }
        style.display = 'none';
    }
};

customElements.define(PTCS.ChartCoord.is, PTCS.ChartCoord);

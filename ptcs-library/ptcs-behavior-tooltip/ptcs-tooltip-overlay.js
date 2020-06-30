import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-hbar/ptcs-hbar.js';
//import 'ptcs-icon/ptcs-icon.js';

//
// IMPORTANT: This component may only be used by ptcs-behavior-tooltip.js
//

PTCS.__TooltipOverlay = class extends PTCS.BehaviorStyleable(PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(PolymerElement))) {
    static get template() {
        return html`
        <style>
        :host {
            position: fixed;
            z-index: 99999;
            pointer-events: none;
            box-sizing: border-box;
            display: inline-block;
        }

        :host(:not([_showtooltip])) {
            visibility: hidden;
        }

        [part=truncation-overflow],
        [part=text] {
            word-break: break-word;
        }

        [part=tooltip-icon] {
            align-self: flex-start;
        }

        /* Tooltip pointer on kbd focus should be 14px wide and 8px high */
        [part=pointer] {
            position: absolute;
            display: block;
        }

        :host([_top=hide]) [part=pointer] {
            display: none;
        }

        :host([_top]) [part=pointer] {
            top: var(--ptcs-tooltip-pointer-shift, -5px);
            transform: rotate(180deg);
        }

        :host(:not([_top])) [part=pointer] {
            bottom: var(--ptcs-tooltip-pointer-shift, -5px);
        }
        </style>
        <ptcs-hbar start center part="tooltip">
            <svg height="8" width="14" part="pointer" id="svgptr">
               <polyline points="0 0, 7 8, 14 0"/>
            </svg>
            <ptcs-icon id="icon" part="tooltip-icon" icon="[[tooltipIcon]]" size="small" hidden\$="[[!tooltipIcon]]"></ptcs-icon>
            <div part="tooltip-text">
                <template is="dom-repeat" items="{{_tooltipItems}}">
                    <div part\$="[[item.part]]">[[item.text]]</div>
                </template>
            </div>
        </ptcs-hbar>`;
    }

    static get is() {
        return 'ptcs-tooltip-overlay';
    }

    static get properties() {
        return {
            // The tooltip text
            tooltip: {
                type: String
            },

            // tooltip decomposed into separate lines
            _tooltipItems: {
                type:     Array,
                computed: '_computeTooltipItems(tooltip)'
            },

            // The tooltip icon, if any
            tooltipIcon: {
                type:     String,
                observer: 'tooltipIconChanged',
                value:    '' // Need an initial value, or @hidden will not be computed
            },

            // Show tooltip?
            _showtooltip: {
                type:     Boolean,
                observer: '_showtooltipChanged'
            },

            // Show tooltip pointer at top - or at bottom
            _top: {
                type:               String,
                reflectToAttribute: true
            },

            ariaHidden: {
                type:               Boolean,
                compute:            '_computeAriaHidden(_showtooltip)',
                reflectToAttribute: true
            }
        };
    }

    ready() {
        super.ready();

        // Only pay the price for Edge on Edge
        if (PTCS.isEdge) {
            this._createPropertyObserver('tooltip', '_tooltipChanged', false);
            this._createPropertyObserver('kbdfocus', '_kbdfocusChanged', false);
        }
    }

    // Convert tooltip data to tooltipItems
    _computeTooltipItems(tooltip) {
        if (tooltip instanceof Array) {
            return tooltip.map(item => {
                if (typeof item === 'string') {
                    return {text: item, part: 'text'};
                }
                return {text: item.text || '', part: item.part || 'text'};
            });
        }

        if (typeof tooltip === 'string') {
            const a = tooltip.split('\n\n').map(s => ({text: s, part: 'text'}));
            if (a.length > 1) {
                a[0].part = 'truncation-overflow';
            }
            return a;
        }

        // Unknown format
        return [{text: `${tooltip}`, part: 'text'}];
    }

    _computeAriaHidden(_showtooltip) {
        return !_showtooltip;
    }

    hide() {
        // Abort any ongoing requests to show the tooltip
        this._requestShow = null;

        // Hide tooltip
        this._showtooltip = false;
    }

    _showtooltipChanged(/*_showtooltip*/) {
        // Delay setting the visibility attribute, to avoid flicker
        if (this.__showTimeout) {
            return;
        }
        this.__showTimeout = true;
        setTimeout(() => {
            this.__showTimeout = false;
            // Note: must manipulate the attribute manually, because we need a delay
            if (this._showtooltip) {
                this.setAttribute('_showtooltip', '');
            } else {
                this.removeAttribute('_showtooltip');
                // Remove positions, allow the tooltip to size itself freely
                this.style.left = '';
                this.style.top = '';
            }

            // Edge needs some extra help
            if (PTCS.isEdge) {
                this.style.visibility = this._showtooltip ? 'visible' : 'hidden';
            }
        }, 150); // Magic number (for now): must be higher than --ptcs-tooltip-next-delay
    }

    show(el, tooltip, area) {
        console.assert(el && tooltip && area && area.w > 0 && area.h > 0);

        // Cancel any previous request
        this._requestShow = null;

        // In case tooltip is a function ...
        if (typeof tooltip === 'function') {
            tooltip = tooltip.call(el) || '';
        }

        // New tooltip about to be shown
        this.tooltip = tooltip;
        this.tooltipIcon = el.tooltipIcon;

        this._requestShow = area;
        requestAnimationFrame(() => this._placeWindow(el, area));
    }

    _placeWindow(el, area) {
        if (area !== this._requestShow) {
            // Request has been cancelled
            return;
        }
        this._requestShow = null;

        // CSS variables may change dynamically, so we need to check every time
        // Padding (distance between focused element and the focus border)
        let pd = 8;
        const padding = getComputedStyle(el).getPropertyValue('--ptcs-tooltip-overlay--padding');
        if (padding) {
            const m = /^\s*(-?[0-9.]+)([a-zA-Z]*)\s*/g.exec(padding);
            if (m && (m[2] === '' || m[2] === 'px')) {
                const x = parseFloat(m[1]);
                if (!isNaN(x)) {
                    pd = x;
                }
            }
        }

        // Screen geometry
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        // Offset between area.mx and pointer
        const mousePointerWidth = 12;

        // Tooltip dimension
        const b = this.getBoundingClientRect();

        // Mouse enter position
        const mx = typeof area.mx === 'number' ? area.mx : area.x + area.w / 2;

        // Potential tooltip positions
        const areaArg = area.arg || {};
        const x1 = mx + mousePointerWidth - b.width;
        const x2 = mx - mousePointerWidth;
        const y1 = area.y - b.height - pd;
        const y2 = area.y + area.h + pd;
        const hidePointer = areaArg.hidePointer || false;
        const arg = {mx, w: b.width, hidePointer};

        let shiftX = areaArg.shiftX || 0;
        let shiftY = areaArg.shiftY || 0;
        const fitTop = y1 - shiftY >= 0;
        const fitBottom = y2 + b.height + shiftY < height;
        const fitLeft = x1 - shiftX >= 0;
        const fitRight = x2 + b.width + shiftX < width;

        /*
           Tooltip should be positioned in following locations, in order of preference, if not positioned from mouse pointer point of entry:

                  Ternary Position             Secondary Position
                                 WIDGET WITH TOOLTIP
                  Quaternary Position          Primary Position
        */
        // Places to try
        const places = ['br', 'tr', 'tl', 'bl'];

        // Do the tooltip have any preferences about its position?
        const pos = el.tooltipPos || el.getAttribute('tooltip-pos');
        if (typeof pos === 'string') {
            places.unshift(...pos.split(' '));
        }

        // Find a place for the tooltip
        const place = places.find(p => {
            switch (p) {
                case 'tl':
                    // Ternary Position
                    if (fitTop && fitLeft) {
                        this._setPos(x1 - shiftX, y1 - shiftY, false, arg);
                        return true;
                    }
                    break;
                case 'tr':
                    // Secondary Position
                    if (fitTop && fitRight) {
                        this._setPos(x2 + shiftX, y1 - shiftY, false, arg);
                        return true;
                    }
                    break;
                case 'bl':
                    // Quaternary Position
                    if (fitBottom && fitLeft) {
                        this._setPos(x1 - shiftX, y2 + shiftY, true, arg);
                        return true;
                    }
                    break;
                case 'br':
                    // Primary Position
                    if (fitBottom && fitRight) {
                        this._setPos(x2 + shiftX, y2 + shiftY, true, arg);
                        return true;
                    }
                    break;
                default:
                    if (p !== '') {
                        console.warn('Unknown tooltip position: ' + p);
                    }
            }
            return false;
        });

        if (place) {
            // Found a valid tooltip place
            return;
        }

        // Tooltips doesn't fit anywhere. Find a fallback position
        const x = Math.max(Math.min((x1 + x2 - b.width) / 2, width - b.width), 0);
        if (b.height <= height - area.y - area.h) {
            // Center below
            this._setPos(x, area.y + area.h + pd, true, arg);
        } else if (b.height < area.y) {
            // Center above
            this._setPos(x, area.y - b.height - pd, false, arg);
        } else {
            // Double fail. Just put the toolbar as far down as possible
            this._setPos(x, Math.min(0, height - b.height), true, arg);
        }
    }

    _setPos(x, y, top, arg) {
        this._top = arg.hidePointer ? 'hide' : top;
        this.style.left = `${Math.max(0, x)}px`;
        this.style.top = `${Math.max(0, y)}px`;

        // Magic numbers:
        // - Width of pointer: 14px
        // - Min distance of pointer from edge: 8px
        x += Math.abs(Math.min(0, x));
        this.$.svgptr.style.left = `${Math.min(Math.max(8, arg.mx - x), arg.w - 14 - 8)}px`;

        this._showtooltip = true;
    }

    tooltipIconChanged(val) {
        // Drives CSS for spacing between icon / tooltip text
        if (val) {
            this.setAttribute('_icon', '');
        } else {
            this.removeAttribute('_icon');
        }
    }

    //
    // Egde fixes - these functions will only be invoked on Edge
    //
    _tooltipChanged(tooltip) {
        // Edge fix for artificial use case where tooltip text cannot be line-broken properly...
        if (typeof tooltip === 'string' && !tooltip.includes(' ') && this.scrollWidth > 546) {
            this.style.wordBreak = 'break-all';
        } else {
            this.style.wordBreak = '';
        }
    }

    _kbdfocusChanged(kbdfocus) {
        this.style.visibility = kbdfocus ? 'visible' : 'hidden';
    }
};

customElements.define(PTCS.__TooltipOverlay.is, PTCS.__TooltipOverlay);


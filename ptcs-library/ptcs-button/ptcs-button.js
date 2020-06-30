import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-icon/ptcs-icon.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';

if (!PTCS.intersectViewPort) {
    PTCS.intersectViewPort = el => {
        const bb = el.getBoundingClientRect();

        return {
            top:    bb.top,
            left:   bb.left,
            bottom:
                (window.innerHeight || document.documentElement.clientHeight) -
                bb.bottom,
            right:
                (window.innerWidth || document.documentElement.clientWidth) -
                bb.right
        };
    };
}

PTCS.Button = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.BehaviorStyleable(
    PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(PolymerElement))))) {

    static get template() {
        return html`
      <style>
        :host {
          user-select: none;
          -ms-user-select: none;
          position: relative;
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: nowrap;
          box-sizing: border-box;

          /*min-width: 34px;*/
        }

        :host([content-align='left']) {
          justify-content: flex-start;
        }

        :host([content-align='center']) {
          align-items: center;
          justify-content: center;
        }

        :host([content-align="right"]) {
          justify-content: flex-end
        }

        :host([aria-disabled="true"]) {
          pointer-events: none;
        }

        :host([aria-disabled="false"]) {
          cursor: pointer;
        }

        [part="root"] {
          box-sizing: border-box;
          display: flex;
          align-self: center;
          align-items: center;
        }

        [part="root"] {
          overflow: hidden;
          max-height: 100%;
        }


        [part="label"] {
          max-width: var(--ptcs-button-label--max-width, auto);
          flex: auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        [part="box"] {
          align-self: center;
        }

        :host([mode="icon+label"]) ptcs-icon {
          margin-right: var(--ptcs-button-icon--sep, 8px);
        }

        :host([mode="label"]) ptcs-icon {
          display: none;
        }

        /* IE11 bug workaround for :active */
        ptcs-icon,
        div {
          pointer-events: none;
        }
      </style>
    <div part="root">
      <ptcs-icon partmap="* icon-*" part="icon"
                 hidden\$="[[_hide(icon, iconSrc)]]"
                 icon="[[_icon(icon, iconSrc)]]"
                 icon-set\$="[[_iconSet(icon, iconSrc)]]"></ptcs-icon>
      <div part="label" id="label" hidden\$="[[_hide(label)]]">[[label]]</div>
    </div>`;
    }

    static get is() {
        return 'ptcs-button';
    }


    static get properties() {
        return {
            variant: {
                type:               String,
                value:              'primary',
                reflectToAttribute: true,
                notify:             true
            },

            icon: {
                type:  String,
                value: null
            },

            iconSrc: {
                type:  String,
                value: null
            },

            label: {
                type:  String,
                value: null
            },

            contentAlign: {
                type:               String,
                value:              'center',
                reflectToAttribute: true
            },

            buttonMaxWidth: {
                type:     Number,
                observer: '_buttonMaxWidthChanged'
            },

            mode: {
                type:               String,
                computed:           '_computeMode(icon, iconSrc, label)',
                reflectToAttribute: true
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            ariaDisabled: {
                type:               String,
                computed:           '_disabled(disabled)',
                reflectToAttribute: true
            },

            // FocusBehavior should simulate a click event when space is pressed
            _spaceActivate: {
                type:     Boolean,
                value:    true,
                readOnly: true
            }

        };
    }

    _buttonMaxWidthChanged(val) {
        if (val) {
            var unitTest = val + '';
            if (unitTest.indexOf('px') === -1) {
                this.style.maxWidth = val + 'px';
            } else {
                this.style.maxWidth = val;
            }
        } else {
            this.style.removeProperty('max-width');
        }
    }

    _hide(arg1, arg2) {
        return !(arg1 || arg2);
    }

    _icon(icon, iconSrc) {
        return icon || iconSrc;
    }

    _iconSet(icon, iconSrc) {
        return icon ? iconSrc : false;
    }

    _monitorTooltip() { // Implements ptcs-button's tooltip behavior on label truncation

        const el = this.$.label;

        // TW-61475. There is probably some rounding issues how IE/Edge calculates the offsetWidth and scrollWidth
        // when the actual width is not an integer. If the problem returns with more the "1" difference between offsetWidth and scrollWidth
        // then we will need to find the real reason.
        if (el && ((!(PTCS.isEdge || PTCS.isIE) && el.offsetWidth < el.scrollWidth) ||
            ((PTCS.isEdge || PTCS.isIE) && el.offsetWidth < el.scrollWidth - 1))) { // Truncated label to be used as tooltip?
            if (!this.tooltip) { // We don't have a tooltip but label is truncated: Use the button label as tooltip
                return this.label;
            } else if (this.tooltip !== this.label) { // if label is not same as tooltip, show both:
                return this.label + '\n\n' + this.tooltip;
            }
        } else if (this.tooltip === this.label) { // Label is not truncated. Don't show tooltip if identical to label.
            return '';
        }
        return this.tooltip || ''; // Either no label truncation or no label, return tooltip if any
    }

    ready() {
        super.ready();
        this.tooltipFunc = this._monitorTooltip.bind(this);
    }

    _computeMode(icon, iconSrc, label) {
        var iconLabel = label ? 'icon+label' : 'icon';
        return icon || iconSrc ? iconLabel : 'label';
    }

    _disabled(disabled) {
        return disabled ? 'true' : 'false';
    }

    _getAbsPos(el) {
        var rect = el.getBoundingClientRect();
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft, bottom: rect.bottom + scrollTop};
    }

    // Set boolean attribute
    _setbattr(el, attr, value) {
        if (value) {
            el.setAttribute(attr, '');
        } else {
            el.removeAttribute(attr);
        }
    }

};


customElements.define(PTCS.Button.is, PTCS.Button);

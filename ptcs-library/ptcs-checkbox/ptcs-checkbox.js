import {html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-binary/ptcs-behavior-binary.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-label/ptcs-label.js';

PTCS.Checkbox = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PTCS.BehaviorBinary)), ['checked']))) {
    static get template() {
        return html`
    <style>
      :host {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
        overflow: hidden;
      }

      :host([disabled]) {
        cursor: auto;
        pointer-events: none;
      }

      [part=label] {
          min-height: unset;
          min-width: unset;
          margin-left: 7px;
      }

      [part=box] {
        flex: 0 0 auto;
        position: relative;
        width: 14px;
        height: 14px;
        box-sizing: border-box;
      }

      .v-mark, .partial-mark {
        display: none;
      }

      :host([checked]:not([partial])) .v-mark,
      :host(:not([partial]):not([disabled]):hover) .v-mark {
        display: block;
      }

      :host([checked][partial]) .partial-mark,
      :host([partial]:not([disabled]):hover) .partial-mark {
        display: block;
      }

      [part=check-mark] {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
      }
    </style>

    <div part="box">
    <svg part="check-mark" class="v-mark" viewBox="-1.5 -1.5 9 8">
        <g stroke="none" stroke-width="1" fill-rule="evenodd" transform="translate(-3, -3.5)">
        <path d="M9.1072275,4.12331278 C9.02508659,4.04117186 8.92523299,4 8.8077343,4 C8.69023562,4 8.59011159,4.04117186
        8.50803828,4.12331278 L5.61735424,7.01845879 L4.32202924,5.7184014 C4.23961791,5.63626049 4.13976431,5.59508862
        4.02226562,5.59508862 C3.90476693,5.59508862 3.80491333,5.63626049 3.7225696,5.7184014 L3.12331278,6.31759062
        C3.04117186,6.40000195 3,6.49978795 3,6.61735424 C3,6.73485293 3.04117186,6.83490935 3.12331278,6.91705026
        L4.7184014,8.51213888 L5.31786104,9.1113281 C5.40000195,9.19373944 5.49985556,9.23464088 5.61735424,9.23464088
        C5.73485293,9.23464088 5.83470653,9.19373944 5.91705026,9.1113281 L6.51630709,8.51213888 L9.70668715,5.32196164
        C9.78882806,5.23961791 9.82999992,5.13976431 9.82999992,5.02226562 C9.82999992,4.90476693 9.78882806,4.80491333
        9.70668715,4.722502 L9.1072275,4.12331278 Z"></path>
        </g>
    </svg>
    <svg part="check-mark" class="partial-mark" viewBox="0 0 13 13">
        <rect x="3" y="6" width="8" height="2"></rect>
    </svg>
    </div>
    <ptcs-label part="label" id="label" partmap="* label-*" label\$="[[label]]" hidden="[[!label]]"
                multi-line="[[!singleLine]]" max-width\$="[[maxWidth]]px"></ptcs-label>`;
    }

    static get is() {
        return 'ptcs-checkbox';
    }

    static get properties() {
        return {
            partial: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            ariaChecked: {
                type:               String,
                computed:           '_compute_ariaChecked(checked)',
                reflectToAttribute: true
            },

            ariaDisabled: {
                type:               String,
                computed:           '_compute_ariaDisabled(disabled)',
                reflectToAttribute: true
            },

            label: {
                type:               String,
                value:              '',
                reflectToAttribute: true
            },

            maxWidth: {
                type: String
            },

            singleLine: {
                type:  Boolean,
                value: false
            },

            // FocusBehavior should simulate a click event when space is pressed
            _spaceActivate: {
                type:     Boolean,
                value:    true,
                readOnly: true
            }

        };
    }

    ready() {
        super.ready();
        this.addEventListener('click', () => this._onClick());
        // Use boilerplate function in ptcs-behavior-tooltip
        this.tooltipFunc = this.hideIfTooltipEqualsLabel;
    }

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._connected = false;
    }

    _onClick() {
        if (!this.disabled && !this.isIDE) {
            this.checked = !this.checked;
        }
    }

    _compute_ariaChecked(checked) {
        return checked ? 'true' : false;
    }

    _compute_ariaDisabled(disabled) {
        return disabled ? 'true' : false;
    }

};

customElements.define(PTCS.Checkbox.is, PTCS.Checkbox);

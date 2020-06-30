import {html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-binary/ptcs-behavior-binary.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-label/ptcs-label.js';

// PTCS.radiobuttonMap[radiogroup] = <selected radio button in group>
PTCS.radiobuttonMap = {};

PTCS.Simpleradio = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PTCS.BehaviorBinary))))) {
    static get template() {
        return html`
      <style>
        :host {
          cursor: pointer;
          display: inline-flex;
          flex-wrap: nowrap;
          align-items: center;

          min-width: 34px;
          min-height: 19px;

          box-sizing: border-box;

          white-space: nowrap;
          overflow: hidden;
        }

        :host([hidden]) {
          display: none;
        }

        [part=circle] {
          min-width: 14px;
          margin-right: 8px;
        }

        [part=label] {
          white-space: normal;
          flex-wrap: wrap;

          min-height: unset;
          min-width: unset;
        }

        :host([disabled]) {
          pointer-events: none;
        }

        :host(:not([checked]):not(:hover)) [part="interior-button"] {
          fill: transparent;
        }
      </style>

      <svg part="circle" height="14px" width="14px" viewBox="0 0 14 14">
        <circle part="exterior-ring" cx="7" cy="7" r="6" stroke-width="1" fill="transparent"></circle>
        <circle part="interior-button" cx="7" cy="7" r="3" stroke-width="0" fill="transparent"></circle>
      </svg><ptcs-label part="label" max-width="[[labelMaxWidth]]" multi-line="" label="[[label]]"></ptcs-label>`;
    }

    static get is() {
        return 'ptcs-radio';
    }

    static get properties() {
        return {
            radiogroup: {
                type:     String,
                value:    '',
                observer: '_radiogroupChanged'
            },

            preventAutoSelect: {
                type: Boolean
            },

            label: {
                type:  String,
                value: 'Radio Button'
            },

            labelMaxWidth: {
                type:  String,
                value: '',
                src:   'maxWidth'
            },

            disabled: {
                type:               Boolean,
                value:              false,
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

    ready() {
        super.ready();
        this.addEventListener('click', () => this._onClick());
        this.tooltipFunc = this.hideIfTooltipEqualsLabel;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.checked) {
            this._checkedChanged(this.checked);
        } else if (!this.preventAutoSelect && this.radiogroup && !PTCS.radiobuttonMap[this.radiogroup]) {
            this.checked = true;
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Remove from PTCS.radiobuttonMap
        if (this.checked && this.radiogroup && PTCS.radiobuttonMap[this.radiogroup] === this) {
            PTCS.radiobuttonMap[this.radiogroup] = null;
        }
    }

    _radiogroupChanged(radiogroup, old) {
        if (old && old !== radiogroup && PTCS.radiobuttonMap[old] === this) {
            PTCS.radiobuttonMap[old] = null;
        }
        if (radiogroup && this.checked) {
            const curr = PTCS.radiobuttonMap[radiogroup];
            if (curr) {
                curr.checked = false;
            }
            PTCS.radiobuttonMap[radiogroup] = this;
        }
    }

    _checkedChanged(checked) {
        super._checkedChanged(checked);
        if (!this.radiogroup) {
            return;
        }
        const curr = PTCS.radiobuttonMap[this.radiogroup];
        if (checked) {
            if (curr !== this) {
                if (curr) {
                    curr.checked = false;
                }
                PTCS.radiobuttonMap[this.radiogroup] = this;
            }
        } else if (curr === this) {
            PTCS.radiobuttonMap[this.radiogroup] = null;
        }
    }

    _onClick() {
        if (!this.disabled && !this.isIDE) {
            this.checked = true;
        }
    }
};

customElements.define(PTCS.Simpleradio.is, PTCS.Simpleradio);

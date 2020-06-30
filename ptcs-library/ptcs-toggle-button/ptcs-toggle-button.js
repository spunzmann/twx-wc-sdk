import {html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-binary/ptcs-behavior-binary.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-label/ptcs-label.js';

PTCS.ToggleButton = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.BehaviorStyleable(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.ThemableMixin(PTCS.BehaviorBinary), ['disabled', 'checked'])))) {
    static get template() {
        return html`
    <style>
      :host {
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: baseline;
        box-sizing: border-box;
        overflow: hidden;
        cursor: pointer;
      }

      :host([disabled]) {
        color: #adb5bd;
        cursor: auto;
      }

      [part=rectangle] {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        flex-shrink: 0;
      }

      :host([checked]) [part=rectangle] {
        justify-content: flex-end;
      }

      :host([disabled]) [part=oval] {
        margin: 0px 1px;
      }

      :host([labelalign=right]) {
        flex-direction: row-reverse;
      }

      :host([labelalign=right]) ptcs-label {
        margin-left: 8px;
      }

      :host([labelalign=left]) ptcs-label {
        margin-right: 8px;
      }

      ptcs-label {
        display: none;

        min-height: unset;
        min-width: unset;
      }

      :host(:not([label=""])) ptcs-label {
        display:inline-flex;
      }
    </style>

    <ptcs-label part="label" partmap="* label-*" label\$="[[label]]" multi-line="" max-width\$="[[labelMaxWidth]]"></ptcs-label>
    <div part="rectangle">
      <div part="oval"></div>
    </div>`;
    }

    static get is() {
        return 'ptcs-toggle-button';
    }

    static get properties() {
        return {
            label: {
                type:               String,
                value:              '',
                reflectToAttribute: true
            },

            labelalign: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            labelMaxWidth: {
                type: String
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

    _onClick() {
        if (!this.disabled && !this.isIDE) {
            this.checked = !this.checked;
        }
    }
};

customElements.define(PTCS.ToggleButton.is, PTCS.ToggleButton);

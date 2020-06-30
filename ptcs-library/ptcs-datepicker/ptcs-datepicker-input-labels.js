import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import 'ptcs-hbar/ptcs-hbar.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

PTCS.DatepickerInputLabels = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))))) {
    static get template() {
        return html`
        <style>
            :host{
                display: inline-flex;
                flex-direction: row;
                flex-wrap: nowrap
                width: 100%;
                position: relative;
                box-sizing: border-box;
                align-items: center;
            }

            :host([disabled]) {
                cursor: auto;
                pointer-events: none;
              }

            [part="input-labels-container"] {
                overflow: hidden;
                position: relative;
                white-space: nowrap;
                flex-wrap: nowrap;
                box-sizing: border-box;
            }

            [part="date-labels-input"] {
                display: inline-flex;
                flex-flow: row nowrap;
                place-content: center flex-start;
                align-items: center;
            }

            [part="text-mask-cursor"] {
                -webkit-appearance: none;
                -moz-appearance: none;
                -webkit-box-shadow: none;
                border: none;
                box-shadow: none;
                cursor: text;
                outline: none;
            }

            [part="text-mask-cursor"]:-moz-read-only { /* For Firefox */
                color: transparent;
            }

            [part="label"] {
                display: inline-flex;
                vertical-align: top;
            }

            [part="placeholder"] {
                cursor: auto;
                pointer-events: none;
            }

            [part="icon"]{
                position: absolute;
                pointer-events: none;
            }

            [part="clear-button"] {
                position: absolute;
            }
            
            [part="clear-button"][hidden] {
                display: none;
            }

            /*START Animation style */

            [part="cursor"] {
                position: relative;
            }

            @keyframes blink {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            [part="date-labels-input"][hidden] {
                display: none;
            }

            [part="cursor"][no-label],
            [part="cursor"][no-label] [part="text-mask-cursor"][focused] {
                width: 0px;
                border-left: solid 1px transparent;
            }

            [part="text-mask-cursor"] {
                animation-name: blink;
                animation-duration: 800ms;
                animation-iteration-count: infinite;
                border-left: solid 1px transparent;
                opacity: 1;
            }

            [part="text-mask-cursor"][focused] {
                border-left: solid 1px #000;
            }
            /*END Animation style */
        </style>

        <ptcs-hbar id="input_labels" part="input-labels-container" inline>
            <div id="dateField" part="date-labels-input">
                <template is="dom-repeat" items="[[labels]]" as="item">
                    <ptcs-label part="label" id="label" label="[[item]];" disable-tooltip></ptcs-label>
                </template>
                <div part="cursor" no-label\$="[[__areLabesEmpty(labels.length)]]">
                    <input type="text" id="text_mask_cursor" tabindex\$="[[_delegatedFocus]]" part="text-mask-cursor"
                    readonly="true" disabled\$="[[disabled]]"/>
                </div>
                <ptcs-label hidden\$="[[!__areLabesEmpty(labels.length)]]" id="placeholder" part="placeholder"
                variant="placeholder" label="[[placeholder]]" disable-tooltip></ptcs-label>
            </div>
        </ptcs-hbar>

        <ptcs-icon icon="page:calendar" part="icon" id="icon" ></ptcs-icon>
        <ptcs-button hidden\$="[[disabled]]" part="clear-button" variant="small" id="clearbutton"
        mode="icon" icon="page:alt-close"></ptcs-button>
    `;
    }
    static get is() {
        return 'ptcs-datepicker-input-labels';
    }
    static get properties() {
        return {
            labels: {
                type:   Array,
                value:  () => [],
                notify: true
            },
            placeholder: {
                type:  String,
                value: ''
            },
            disabled: {
                type:  Boolean,
                value: false
            }
        };
    }

    ready() {
        super.ready();
        // Show text caret
        this.addEventListener('focus', () => !this.disabled && this.$.text_mask_cursor.setAttribute('focused', ''));
        // Hide text caret
        this.addEventListener('blur', () => !this.disabled && this.$.text_mask_cursor.removeAttribute('focused'));
    }

    __areLabesEmpty(value) {
        return !value;
    }
};

customElements.define(PTCS.DatepickerInputLabels.is, PTCS.DatepickerInputLabels);

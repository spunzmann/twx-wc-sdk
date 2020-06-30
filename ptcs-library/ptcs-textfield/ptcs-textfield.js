import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import {InputMask} from './lib/masking-input.js';
import './ptcs-textfield-base.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-icon/ptcs-icon.js';
import 'ptcs-icons/page-icons.js';


PTCS.Textfield = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.BehaviorStyleable(
    PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(
        PTCS.TextFieldMixin(PolymerElement)), ['counter', 'read-only', 'show-clear-text', 'has-text'])))) {
    static get template() {
        return html`
      <style>
        /* This styles block should come from ptcs-textfield-base. Currently there is some issue with style inclusion. */
        :host
        {
          display: inline-flex;
          box-sizing: border-box;
          overflow: hidden;
        }

        [part="root"] {
          flex: 0 0 auto;
          display: inline-flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: stretch;
          align-content: stretch;

          width: 100%;
          height: 100%;
        }

        [part="text-box"] {
          min-width: 34px;
          min-height: 34px;
          flex-grow: 1;

          box-sizing: border-box;
        }

        [part="text-value"] {
          border: 0;
          background: transparent;
          outline: none;
          box-shadow: none;
          margin-left: 8px;
          width: 100%;
          box-sizing: border-box;
          flex: 1;
        }

        /* FF needs this rule */
        :host(:not([has-text])) [part="text-value"]:not(:focus) {
            width: 0px;
            flex: 0 0 auto;
        }

        :host([text-alignment=right]) [part="text-value"] {
          text-align: right;
          margin-left: 0px;
          margin-right: 8px;
          order: 3;
        }

        [part="text-value"]:focus {
          min-width: 1px;
       }

        :host([egde-fix]) [part="text-value"]:focus {
          min-width: 4px;
        }

        [part="label"] {
          display: none;

          flex-shrink: 0;

          min-width: unset;
          min-height: unset;
        }

        :host(:not([label=""])) [part="label"] {
          display: block;
          padding-bottom: 4px;
        }

        [part="text-value"]:focus::-webkit-input-placeholder { color: transparent; }
        [part="text-value"]:focus::-webkit-input-placeholder { color: transparent; }
        [part="text-value"]:focus::-moz-placeholder { color: transparent; }
        [part="text-value"]:focus:-ms-input-placeholder { color: transparent; }

        :host([counter]:not([maxlength=""]):not([disabled]):not([read-only])) [part="counter"] {
          display: block;
          margin-right: 8px;
          width: auto;
        }

        :host([counter]:not([maxlength=""]):not([disabled]):not([read-only])) [part="counter"][nearLimit] {
          color: #ce3939;
        }

        [part=counter]:not([disabled]) .nearLimit {
          color: #ce3939;
        }

        [part="counter"] {
          display: none;
        }
        /* The end of included style block */

        :host {
            width: 273px;
        }

        [part="text-box"] {
          display: inline-flex;
          flex-direction: row;
          justify-content: start;
          align-items: center;
        }

        [part=icon] {
          display: none;
          pointer-events: none;
        }

        :host([icon]:not([icon=""])) [part=icon] {
          display: inline-flex;
        }

        :host([icon-src]:not([icon-src=""])) [part=icon] {
          display: inline-flex;
        }

        [part=clear-button] {
          flex: 0 0 auto;
          display: none;
          margin-right: 8px;
          margin-left: 0px;
          margin-top: 0px;
          margin-bottom: 0px;
        }

        #maskShell[mask-active]~[part=counter] {
          display: none;
        }

        #maskShell[mask-active] [part="text-value"]:focus::-webkit-input-placeholder { color: transparent; }
        #maskShell[mask-active] [part="text-value"]:focus::-webkit-input-placeholder { color: transparent; }
        #maskShell[mask-active] [part="text-value"]:focus::-moz-placeholder { color: transparent; }
        #maskShell[mask-active] [part="text-value"]:focus:-ms-input-placeholder { color: transparent; }

        :host(:hover:not([counter]):not([disabled]):not([read-only])[show-clear-text][has-text]) [part=clear-button] {
          display: inline-flex;
        }

        :host(:not([counter]):not([disabled]):not([read-only])[show-clear-text][has-text]) #maskShell[focused]+[part=clear-button] {
          display: inline-flex;
        }

        /* E.g. the datepicker needs to show the clear button DESPITE readonly */
        :host(:hover:not([counter]):not([disabled])[show-clear-text][has-text][display-clear-button-on-readonly]) [part=clear-button] {
          display: inline-flex;
        }

        :host(:not([counter]):not([disabled])[show-clear-text][has-text][display-clear-button-on-readonly]) #maskShell[focused]+[part=clear-button] {
          display: inline-flex;
        }

        /* masking css */

        .shell {
          line-height: 1;
          position:relative;
          display:inline-flex;
          width: 100%;
        }

        [part=mask] {
          position:absolute;
          margin-left: 8px;
          pointer-events: none;
          height: 22px;
        }

        [part=mask] i {
          font-style: normal;
          /* any of these 3 will work */
          color: transparent;
          opacity: 0;
          visibility: hidden;
        }

        input.masked,[part=mask] {
          background-color: transparent;
        }

        [part="hint-text"] {
          align-self: center;
          cursor: text;

          /* minimal height should exists otherwise hint is not shown */
          min-height: 16px;
          width: 100%;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          user-select: none;
        }

        :host([text-alignment=right]) [part="hint-text"] {
            text-align: right;
        }

        :host([has-text]) [part="hint-text"] {
            display: none;
        }

        /* hint-text must be hidden in Safari, or sometimes <input> refuses keyboard input */
        :host([safari-fix]:focus-within) [part="hint-text"] {
            display: none;
        }

        [part=clear-button] {
          visibility: visible;
        }

        [part="clear-button"] ptcs-icon {
          max-width: 100%;
          overflow: visible;
        }

        /* IE11 and Edge fix to remove auto-generated non-standard clear button in input field */
        [part=text-value]::-ms-clear {
          display: none;
        }
      </style>

      <div part="root">
        <ptcs-label part="label" label="[[label]]" multi-line="" horizontal-alignment="[[labelAlignment]]" disable-tooltip></ptcs-label>
        <div part="text-box">
          <ptcs-icon part="icon" icon="[[icon]]" src="[[iconSrc]]"></ptcs-icon>
          <span id="maskShell" class="shell">
            <span aria-hidden="" part="mask" id="inputMask">
              <i></i>
            </span>
            <input id="input" part="text-value" class\$="[[_maskedClass(mask)]]" disabled\$="[[disabled]]" readonly\$="[[readOnly]]"
            maxlength\$="[[maxNumberOfCharacters]]" pattern\$="[[_maskToRegex(mask)]]" data-charset\$="[[dataCharset]]"
            data-hint-text\$="[[dataHintText]]" value="{{text::input}}" tabindex\$="[[_tabindex(_delegatedFocus)]]">
            <label part="hint-text" id="hintText">[[hintText]]</label>
          </span>

          <ptcs-button partmap="* clear-button-*" variant="small" id="clearbutton" part="clear-button" mode="icon" icon="page:alt-close">
          </ptcs-button>

          <div part="counter" nearlimit\$="[[_nearLimit]]">[[_counterString]]</div>
        </div>
      </div>
`;
    }

    static get is() {
        return 'ptcs-textfield';
    }

    static get properties() {
        return {
            password: {
                type:               Boolean,
                value:              false,
                observer:           '_passwordChanged',
                reflectToAttribute: true
            },

            showClearText: {
                type:               Boolean,
                value:              true,
                reflectToAttribute: true
            },

            labelAlignment: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            textAlignment: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            icon: {
                type:               String,
                reflectToAttribute: true
            },

            iconSrc: {
                type:               String,
                reflectToAttribute: true
            },

            mask: {
                type:               String,
                reflectToAttribute: true,
                value:              '',
                observer:           '_maskChanged'
            },

            _inputMask: {
                type:  Object,
                value: undefined
            },

            dataCharset: {
                type: String
            },

            dataHintText: {
                type: String
            },

            readOnly: {
                type:  Boolean,
                value: false
            },

            _delegatedFocus: {
                type:  String,
                value: null
            }
        };
    }

    _tabindex(_delegatedFocus) {
        return _delegatedFocus !== false ? _delegatedFocus : '-1';
    }

    _maskChanged() {
        if (this._inputMask === undefined) {
            this._inputMask = new InputMask({wc: this, shell: this.$.maskShell});
        }

        this._inputMask.refresh(this.mask);

        this._sendInputEvent();
    }

    _passwordChanged() {
        let type = this.password ? 'password' : 'text';
        this.$.input.type = type;
    }

    /**
* Returns the class required by input-masking library
*/
    _maskedClass(mask) {
        return (mask ? 'masked' : '');
    }

    /**
* Input-masking library: Include type="tel" when requiring numbers only.
*/
    _maskType(mask) {
        return (mask.match(/^[9]+$/) ? 'tel' : '');
    }

    _maskToRegex(mask) {
        var pattern = '';
        var hint = '';
        var dataCharSet = '';

        for (var i = 0; i < mask.length; i++) {
            let maskChar = mask[i];

            switch (maskChar) {
                case 'a':
                    pattern += '[a-zA-Z]';
                    hint += '_';
                    dataCharSet += '_';
                    break;
                case '9':
                    pattern += '[0-9]';
                    hint += '_';
                    dataCharSet += 'X';
                    break;
                case '*':
                    pattern += '[a-zA-Z0-9]';
                    hint += '_';
                    dataCharSet += '*';
                    break;
                default:
                    hint += maskChar;
                    dataCharSet += maskChar;
                    pattern += maskChar;
            }
        }

        this.dataHintText = hint;
        this.dataCharset = dataCharSet;
        if (pattern.length === 0) { // make pattern accept every thing to prevent HTML error messages on runtime
            pattern = '.*';
        }
        return pattern;
    }

    _sendInputEvent() {
        var event = new Event('input', {
            bubbles:    true,
            cancelable: true
        });

        this.$.input.dispatchEvent(event);
    }

    _dispatchEnterKeyPressedEvent() {
        this.dispatchEvent(new CustomEvent('EnterKeyPressed', {bubbles: true, composed: true, detail: {key: 'Enter'}}));
    }

    _preventTooltip() {
        this.disableTooltip = true;
        requestAnimationFrame(() => this._tooltipClose());
    }

    _allowTooltip() {
        this.__ptId = (this.__ptId || 0) + 1;
        const __ptId = this.__ptId;
        setTimeout(() => {
            // Make sure the timeout is still relevant and that we have not regained focus
            if (__ptId === this.__ptId && !this.$.maskShell.hasAttribute('focused')) {
                this.disableTooltip = false;
            }
        }, 100);
    }

    ready() {
        super.ready();
        if (PTCS.isEdge) {
            this.setAttribute('egde-fix', '');
            // Fixes that protects us from MUB styling that leaks into the shady DOM on Edge
            this.$.input.style.border = 'none';
            this.$.input.style.padding = '0';
            this.$.hintText.marginBottom = '0px';
        }
        if (PTCS.isSafari) {
            this.setAttribute('safari-fix', '');
        }

        // Click on textfield -> don't show tooltip
        this.addEventListener('click', () => this._preventTooltip());

        // Click on clearbutton
        this.$.clearbutton.addEventListener('click', () => {
            this.text = '';
            this._sendInputEvent();
        });

        // Track focus in <input>
        this.$.input.addEventListener('focus', () => {
            this.$.maskShell.setAttribute('focused', '');
            if (!this.disabled && !this.readOnly) {
                // Select text
                this.$.input.setSelectionRange(0, this.$.input.value.length);
            }
        });

        // Track blur in <input>
        this.$.input.addEventListener('blur', () => {
            this.$.maskShell.removeAttribute('focused');
            if (this.isValueChanged()) {
                this._dispatchEnterKeyPressedEvent();
            }
            this._allowTooltip();
        });

        // Listen to <enter> keys
        this.$.input.addEventListener('keypress', (event) => {
            this._preventTooltip();
            const x = event.which || event.keyCode; // Use either which or keyCode, depending on browser support
            if (x === 13) {
                if (this.isValueChanged()) {
                    this._dispatchEnterKeyPressedEvent();
                }
            }
        });

        this.tooltipFunc = this._monitorTooltip.bind(this);

        this._trackFocus(this.$.input, this.shadowRoot.querySelector('[part=text-box]'));

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '-1');
        }
    }


    _monitorTooltip() {/* Implements ptcs-textfield's tooltip behavior on label truncation. Show the truncated hint text
    if any, and don't show the tooltip if its text is the same as the hint text or the label text */
        const el = this.shadowRoot.querySelector('[part=text-box]');
        if (el) {
            const hint = el.querySelector('[part=hint-text]');
            // Truncated hint text to be used as tooltip?
            if (el.offsetWidth < hint.scrollWidth - 1) { // -1 because of off-by-one Edge issue (see fix for TW-61475)
                if (!this.tooltip) { // We don't have a tooltip but hinttext is truncated: Use the hint text as tooltip
                    return this.hintText;
                } else if (this.hintText !== '' && this.tooltip !== this.hintText) {
                    // if hinttext is not same as tooltip, show both (unless tooltip is same as the label):
                    if (this.tooltip !== this.label) {
                        return this.hintText + '\n\n' + this.tooltip;
                    } // Tooltip is same as the hint text, only show the hint text that is truncated
                    return this.hintText;
                }
            }
        }
        if (this.tooltip === this.label) {
            return ''; // Hint Text is not truncated. Don't show tooltip if identical to the text field label text, which cannot be truncated
        }
        return this.tooltip || ''; // Either no hint text truncation or no hint, tooltip text different from label. Return tooltip if any
    }

    // Get focus element in parent host
    /*
_getParentFocus() {
for (let el = this; el; el = el.parentNode) {
    if (el.nodeType === 11 && el.host && el.host.shadowRoot) {
        return el.host.shadowRoot.activeElement;
    }
}
return document.activeElement;
}
*/
};

customElements.define(PTCS.Textfield.is, PTCS.Textfield);

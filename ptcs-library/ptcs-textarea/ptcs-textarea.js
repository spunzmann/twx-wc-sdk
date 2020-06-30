import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-textfield/ptcs-textfield-base.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';

PTCS.Textarea = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.BehaviorStyleable(
    PTCS.TextFieldMixin(PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(PolymerElement), []))))) {
    static get template() {
        return html`
      <style>
        /* This styles block should come from ptcs-textfield-base. Currently there is some issue with style inclusion. */
        :host
        {
          display: inline-block;

          box-sizing: border-box;

          overflow: hidden;
        }

        [part="root"] {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }

        [part="text-box"] {
          flex-grow: 1;
          box-sizing: border-box;
        }

        [part="text-value"] {
          border: 0;
          background: transparent;
          padding: 8px;
          outline: none;
          box-shadow: none;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          flex: 1;
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
          text-align: right;
          width: auto;
        }

        :host([counter]:not([maxlength=""]):not([disabled]):not([read-only])) [part="counter"][nearLimit] {
          color: #ce3939;
        }

        [part=counter]:not([disabled]) .nearLimit {
          color: #ce3939;
        }

        :host([text-alignment=right]) [part=text-box] {
          text-align: right;
        }

        [part="counter"] {
          display: none;
        }

        /* The end of included style block */

        :host {
          line-height: 18px;
        }

        [part="text-box"] {
          display: inline-flex;
          flex-direction: column;
          position: relative;
        }

        [part=text-value] {
          resize: none;
          overflow: hidden;
        }

        [part=counter] {
          margin-bottom: 8px;
          direction: rtl;
        }

        [part="hint-text"] {
          position: absolute;
          height: 100%;
          width: 100%;
          cursor: text;
          box-sizing: border-box;
        }

        :host([has-text]) [part="hint-text"] {
          display: none;
        }
      </style>

      <div part="root" id="root">
        <ptcs-label part="label" id="label" label="[[label]]" multi-line="" horizontal-alignment="[[labelAlignment]]" disable-tooltip></ptcs-label>
        <div part="text-box" id="textbox">
          <label part="hint-text" id="hintText">[[hintText]]</label>
          <textarea part="text-value" id="input" disabled\$="[[disabled]]" readonly\$="[[readOnly]]"
          maxlength\$="[[maxNumberOfCharacters]]" value="{{text::input}}" tabindex\$="[[_tabindex(_delegatedFocus)]]"></textarea>
          <div id="counter" part="counter" nearlimit\$="[[_nearLimit]]">[[_counterString]]</div>
        </div>
      </div>`;
    }

    static get is() {
        return 'ptcs-textarea';
    }

    static get properties() {
        return {
            textAlignment: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            labelAlignment: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            _initialHeight: {
                type:  String,
                value: ''
            },

            _autoGrow: {
                type:  Boolean,
                value: true
            },

            _delegatedFocus: {
                type:  String,
                value: null
            }
        };
    }

    ready() {
        super.ready();

        // Clicking on the hint text sends focus to <input>
        this.$.hintText.addEventListener('mouseup', () => {
            this._forwardFocus();
            requestAnimationFrame(() => this._tooltipClose());
        });

        this.addEventListener('input', () => this._calculateDynamicHeightChanged());
        requestAnimationFrame(() => this._calculateDynamicHeightChanged());

        this.$.input.addEventListener('blur', () => {
            if (this.isValueChanged()) {
                this.dispatchEvent(new CustomEvent('TextAreaChanged', {bubbles: true, composed: true, detail: {key: 'Enter'}}));
            }
        });

        // Listen to keys in order to dismiss tooltip (if any)
        this.$.input.addEventListener('keypress', () => {
            requestAnimationFrame(() => this._tooltipClose());
        });

        // Listen to click in order to dismiss tooltip (if any)
        this.$.input.addEventListener('click', () => {
            requestAnimationFrame(() => this._tooltipClose());
        });

        // Use boilerplate function in ptcs-behavior-tooltip
        this.tooltipFunc = this.hideIfTooltipEqualsLabel;

        // When input has focus, draw focus border around textbox
        this._trackFocus(this.$.input, this.$.textbox);
    }

    // Forward focus to <textarea>
    _forwardFocus() {
        if (!this.disabled && !this.readOnly) {
            this.$.input.focus();
        }
    }

    _tabindex(_delegatedFocus) {
        return _delegatedFocus !== false ? _delegatedFocus : '-1';
    }

    _calculateDynamicHeightChanged() {
        if (this._initialHeight === '') {
            if (this.offsetHeight === 0) {
                // Component is not ready yet
                requestAnimationFrame(() => this._calculateDynamicHeightChanged());
                return;
            }
            this._initialHeight = this.offsetHeight;
            this.$.textbox.style.height = this.$.textbox.offsetHeight + 'px';
        }

        this.style.height = 'auto';
        if (this._autoGrow && this._initialHeight < this.$.input.scrollHeight + this.$.counter.offsetHeight + this.$.label.offsetHeight) {
            this.style.height = (this.$.input.scrollHeight + this.$.counter.offsetHeight + this.$.label.offsetHeight) + 'px';
            this.$.input.style.overflow = null;
        } else {
            this.style.height = this._initialHeight + 'px';
            this.$.input.style.overflow = 'auto';
        }
    }
};

customElements.define(PTCS.Textarea.is, PTCS.Textarea);

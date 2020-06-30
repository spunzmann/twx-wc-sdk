import {PTCS} from 'ptcs-library/library.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="ptcs-text-field-default-styles-base">
  <template>
    <style>
      :host
      {
        display: inline-block;

        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;

        min-width:fit-content;
        min-height:fit-content;
      }

      [part="root"] {
        display: inline-flex;
        flex-direction: column;

        width: 100%;
      }

      [part="text-box"] {
        min-width: 32px;
        min-height: 32px;
      }

      [part="text-value"] {
        border: 0;
        background: transparent;
        padding: 0;
        outline: none;
        box-shadow: none;

        margin-left: 8px;
        margin-right: 8px;

        width: 100%;
        box-sizing: border-box;
        flex: 1;
        min-width: 0;
      }

      [part="label"] {
        display: none;

        font-size: 12px;
      }

      :host(:not([label=""])) [part="label"] {
        display: block;

        margin-bottom: 4px;
      }

      [part="text-value"]:focus::-webkit-input-placeholder { color: transparent; }
      [part="text-value"]:focus::-webkit-input-placeholder { color: transparent; }
      [part="text-value"]:focus::-moz-placeholder { color: transparent; }
      [part="text-value"]:focus:-ms-input-placeholder { color: transparent; }

      :host([counter]:not([maxlength=""]):not([disabled]):not([read-only])) [part="counter"] {
        display: block;

        font-size: 12px;

        margin-right: 8px;
        width: auto;
      }

      [part="counter"] {
        display: none;
      }
    </style>
  </template>
  </dom-module>`;

document.head.appendChild($_documentContainer.content);

PTCS.TextFieldMixin = subclass => class PtcsTextFieldMixin extends subclass {
    static get properties() {
        return {
            text: {
                type:   String,
                value:  '',
                notify: true
            },

            // If we have both TextField and Grid Widget,
            // In some cases, dhtmlxgrid.js:1665 vendor code checks for existance of the 'value' property, and if it's
            // not there, the Grid prevents event propagation. (dhtmlxgrid.js:1698)
            value: {
                type:     String,
                observer: 'valueChanged'
            },

            _valueHasChanged: {
                type: Boolean
            },

            label: {
                type:               String,
                value:              '',
                reflectToAttribute: true
            },

            counter: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            _counterString: {
                type: String
            },

            _nearLimit: {
                type:  Boolean,
                value: false
            },

            maxNumberOfCharacters: {
                type:               Number,
                value:              1000000,
                reflectToAttribute: true
            },

            hintText: {
                type:               String,
                reflectToAttribute: true
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            readOnly: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            /**
         * A read-only property indicating whether this input has a non empty value.
         * It can be used for example in styling of the component.
         **/
            hasText: {
                type:               Boolean,
                value:              false,
                readOnly:           true,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return ['_changeBaseInput(text, maxNumberOfCharacters)'];
    }

    valueChanged(val, oldval) {
        if (oldval === undefined) {
            this._valueHasChanged = val !== '';
        } else {
            this._valueHasChanged = true;
        }
    }

    isValueChanged() {
        const result =  this._valueHasChanged;
        this._valueHasChanged = false;
        return result;
    }

    _changeBaseInput(text, maxNumberOfCharacters) {
        this._setHasText(!!text);
        this.value = text;

        // Truncate input, if needed, since the HTML element doesn't handle this by itself
        const input = this.$.input;
        if (input.value.length > maxNumberOfCharacters) {
            input.value = input.value.substr(0, maxNumberOfCharacters);
        }

        this._counterString = (maxNumberOfCharacters ? input.value.length + '/' + maxNumberOfCharacters : '');
        this._nearLimit = maxNumberOfCharacters && maxNumberOfCharacters * 0.9 <= input.value.length;

        if (PTCS.isIE || PTCS.isEdge) {
            const counter = this.shadowRoot.querySelector('[part=counter]');
            if (this._nearLimit) {
                counter.classList.add('nearLimit');
            } else {
                counter.classList.remove('nearLimit');
            }
        }
    }
};

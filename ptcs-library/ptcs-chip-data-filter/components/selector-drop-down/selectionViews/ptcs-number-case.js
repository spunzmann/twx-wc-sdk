import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-shadow-style/shadow-part.js';

const dropDownDefaultValue = '=';
const mathOperations = ['=', '>', '<', '>=', '<='];
class PTCSNumberCase extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PolymerElement))) {
    static get is() {
        return 'ptcs-number-case';
    }
    static get template() {
        return html`
            <style>
                :host {
                    display: flex;
                    flex-wrap: wrap;
                }
                :host([hidden]) {
                    display: none;
                }
                span {
                    line-height: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-height)
                }
                #drop-down, ptcs-textfield {
                    width: var(--ptcs-chip-data-filter-selector-dropdown-number-case-subcomponent-width);
                }
                #drop-down, #from-text-field, #to-text-field, span {
                    height: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-height);
                    margin: var(--subcomponent-margin-spacing) var(--subcomponent-margin-spacing) 0px 0px;
                }
                #between-outside-container {
                    display: none;
                }
                #between-outside-container[data-enabled] {
                    display: flex;
                }
            </style>
            <ptcs-dropdown id="drop-down" part="drop-down" selected-value="{{__currentSelectionDropDown}}"
            tabindex\$="[[_delegatedFocus]]" on-selected-indexes-changed="__setIsFilled">
            </ptcs-dropdown>
            <ptcs-textfield id="from-text-field" part="from-text-field" hint-text=[[dictionary.stringAddValue]] tabindex\$="[[_delegatedFocus]]"
            on-text-changed="__setIsFilled" on-keyup="__handleKeyUp"></ptcs-textfield>
            <div id="between-outside-container" data-enabled\$="[[__isBetweenOrOutside(__currentSelectionDropDown)]]">
                <span> [[dictionary.stringTo]] </span>
                <ptcs-textfield id="to-text-field" part="to-text-field" hint-text=[[dictionary.stringAddValue]] tabindex\$="[[_delegatedFocus]]"
                on-text-changed="__setIsFilled" on-keyup="__handleKeyUp"></ptcs-textfield>
            </div>
        `;
    }
    static get properties() {
        return {
            dictionary: {
                type:  Object,
                value: () => { }
            },
            isFilled: { // carries information whether the view is filled with enough amount of data
                readOnly: true,
                notify:   true,
                value:    false
            },
            _delegatedFocus: {
                type:  String,
                value: null
            }
        };
    }
    static get observers() {
        return [
            '__updateTranslations(dictionary.stringBetween, dictionary.stringOutside)'
        ];
    }
    ready() {
        super.ready();
        this.__updateTranslations();
        this.__currentSelectionDropDown = dropDownDefaultValue;
    }
    set dataEnteredByUser(newData) {
        if (Array.isArray(newData)) {
            [this.__currentSelectionDropDown, this.$['from-text-field'].text, this.$['to-text-field'].text] = newData;
        }
    }
    get dataEnteredByUser() {
        if (this.__isBetweenOrOutside()) {
            return [this.$['drop-down'].selectedValue, this.$['from-text-field'].text, this.$['to-text-field'].text];
        }
        return [this.$['drop-down'].selectedValue, this.$['from-text-field'].text];
    }
    get query() {
        if (this.isError() || !this.__queryFieldName) {
            return null;
        }

        let query = {
            type:            this.__comparisonOperatorQueryMap[this.__currentSelectionDropDown],
            fieldName:       this.__queryFieldName,
            isCaseSensitive: true
        };

        if (this.__isBetweenOrOutside()) {
            let isToFieldSmallerThanFromField = Number(this.$['to-text-field'].text) < Number(this.$['from-text-field'].text);

            query.to = isToFieldSmallerThanFromField ? this.$['from-text-field'].text : this.$['to-text-field'].text;
            query.from = isToFieldSmallerThanFromField ? this.$['to-text-field'].text : this.$['from-text-field'].text;
        } else {
            query.value = this.$['from-text-field'].text;
        }

        return query;
    }
    queryFieldName(newFieldName) {
        if (arguments.length !== 0) {
            this.__queryFieldName = newFieldName;
        }
        return this.__queryFieldName;
    }
    isError() {
        const isFromTextFieldValueValid = this.$['from-text-field'].text.length !== 0;

        if (this.__isBetweenOrOutside()) {
            const isToTextFieldValueValid = this.$['to-text-field'].text.length !== 0;

            return !isFromTextFieldValueValid || !isToTextFieldValueValid;
        }
        return !isFromTextFieldValueValid;
    }
    setDefaultValues() {
        this.$['from-text-field'].text = this.$['to-text-field'].text = '';
        this.__currentSelectionDropDown = dropDownDefaultValue;
    }
    getFormatted() {
        let formatted;

        if (this.__isBetweenOrOutside()) {
            let isToFieldSmallerThanFromField = Number(this.$['to-text-field'].text) < Number(this.$['from-text-field'].text);
            let to = isToFieldSmallerThanFromField ? this.$['from-text-field'].text : this.$['to-text-field'].text;
            let from = isToFieldSmallerThanFromField ? this.$['to-text-field'].text : this.$['from-text-field'].text;

            formatted = `${this.__currentSelectionDropDown.toLowerCase()} ${from} ${this.dictionary.stringAnd} ${to}`;
        } else {
            formatted = `${this.__currentSelectionDropDown} ${this.$['from-text-field'].text}`;
        }

        return formatted;
    }
    __isBetweenOrOutside() {
        return this.__currentSelectionDropDown !== undefined && !mathOperations.includes(this.__currentSelectionDropDown);
    }
    __setIsFilled() {
        const isFromTextFieldNotEmpty = typeof this.$['from-text-field'].text === 'string' && this.$['from-text-field'].text.length !== 0;

        if (this.__isBetweenOrOutside()) {
            const isToTextFieldNotEmpty = typeof this.$['to-text-field'].text === 'string' && this.$['to-text-field'].text.length !== 0;
            this._setIsFilled(isToTextFieldNotEmpty && isFromTextFieldNotEmpty);
            return;
        }
        this._setIsFilled(isFromTextFieldNotEmpty);
    }
    __updateTranslations() {
        const mathOperationsCopy = mathOperations.slice();
        this.__comparisonOperatorQueryMap = {
            '>':  'GT',
            '>=': 'GE',
            '<':  'LT',
            '<=': 'LE',
            '=':  'EQ'
        };
        if (this.dictionary) {
            if (this.dictionary.stringBetween) {
                this.__comparisonOperatorQueryMap[this.dictionary.stringBetween] = 'Between';
                mathOperationsCopy.push(this.dictionary.stringBetween);
            }
            if (this.dictionary.stringOutside) {
                this.__comparisonOperatorQueryMap[this.dictionary.stringOutside] = 'NotBetween';
                mathOperationsCopy.push(this.dictionary.stringOutside);
            }
        }
        this.$['drop-down'].items = mathOperationsCopy;

    }
    __handleKeyUp(event) {
        if (event.key === 'Enter' && !this.isError()) {
            this.blur();
            this.dispatchEvent(new CustomEvent('data-approved', {
                bubbles:  true,
                composed: true
            }));
        }
    }
}

customElements.define(PTCSNumberCase.is, PTCSNumberCase);

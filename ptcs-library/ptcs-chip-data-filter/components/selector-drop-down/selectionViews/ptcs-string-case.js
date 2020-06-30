import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-shadow-style/shadow-part.js';

class PTCSStringCase extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PolymerElement))) {
    static get template() {
        return html`
            <style>
                 #text-field {
                    margin: var(--subcomponent-margin-spacing) var(--subcomponent-margin-spacing) 0px 0px;
                    height: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-height);
                }
            </style>
            <ptcs-textfield
                id="text-field"
                tabindex\$="[[_delegatedFocus]]"
                on-text-changed="__setIsFilled"
                on-keyup="__handleKeyUp">
            </ptcs-textfield>
        `;
    }
    static get is() {
        return 'ptcs-string-case';
    }
    static get properties() {
        return {
            dictionary: {
                type:  Object,
                value: () => {}
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
    constructor() {
        super();
        this.__cachedData = [];
    }
    set dataEnteredByUser(newData) {
        if (Array.isArray(newData)) {
            this.__cachedData = newData;
            this.$['text-field'].text = '';
        }
    }
    get dataEnteredByUser() {
        return this.__getCurrentData();
    }
    /*
        An example of query:
        {
        "type": "OR",
        "filters":[{
             "type": "LIKE",
             "fieldName": "textBasedCategory",
             "isCaseSensitive": true,
             "value": "Pol"
        }, {
             "type": "LIKE",
             "fieldName": "textBasedCategory",
             "isCaseSensitive": true,
             "value": "Anny"
         }]
       }
    */
    get query() {
        if (this.isError() || !this.__queryFieldName) {
            return null;
        }

        const subsequentStringsEnteredByUser = this.__getCurrentData();
        const filters = subsequentStringsEnteredByUser.map(textEntry => {
            return {
                type:            'LIKE',
                fieldName:       this.__queryFieldName,
                isCaseSensitive: true,
                value:           textEntry
            };
        });

        return {
            type:    'OR',
            filters: filters
        };
    }
    queryFieldName(newFieldName) {
        this.__queryFieldName = newFieldName;
    }
    setDefaultValues() {
        this.__cachedData = [];
        this.$['text-field'].text = '';
    }
    isError() {
        return !this.isFilled && this.__cachedData.length === 0;
    }
    getFormatted() {
        const subsequentStringsEnteredByUser = this.__getCurrentData();
        return `${subsequentStringsEnteredByUser.join('; ')}`;
    }
    clearCache() {
        this.__cachedData = [];
    }
    __setIsFilled() {
        this._setIsFilled(this.$['text-field'].text.length !== 0);
    }
    __getCurrentData() {
        const cachedDataCopy = this.__cachedData.slice();
        const textFieldContent = this.$['text-field'].text;

        if (textFieldContent) {
            cachedDataCopy.push(textFieldContent);
        }
        return cachedDataCopy;
    }
    __handleKeyUp(event) {
        if (event.key === 'Enter' && !this.isError()) {
            this.$['text-field'].blur();
            this.dispatchEvent(new CustomEvent('data-approved', {
                bubbles:  true,
                composed: true
            }));
        }
    }
}

customElements.define(PTCSStringCase.is, PTCSStringCase);

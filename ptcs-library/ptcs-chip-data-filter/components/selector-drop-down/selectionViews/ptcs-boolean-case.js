import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-dropdown/ptcs-dropdown.js';

class PTCSBooleanCase extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PolymerElement))) {
    static get is() {
        return 'ptcs-boolean-case';
    }
    static get template() {
        return html`
            <style>
                #drop-down {
                    width:  var(--ptcs-chip-data-filter-selector-dropdown-base-subcomponent-width);
                    height: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-height);
                    margin: var(--subcomponent-margin-spacing) var(--subcomponent-margin-spacing) 0px 0px;
                }
            </style>
            <ptcs-dropdown id="drop-down" select-all-label=[[dictionary.stringSelectAll]] hint-text="[[dictionary.stringSelectMultipleValues]]"
            tabindex\$="[[_delegatedFocus]]" open multi-select on-selected-indexes-changed="__setIsFilled" all-label=[[dictionary.stringAll]]
            clear-selected-items-label=[[dictionary.stringClearSelectedItems]] selected-label=[[dictionary.stringSelected]]></ptcs-dropdown>
        `;
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
    ready() {
        super.ready();
        this.$['drop-down'].items = ['true', 'false'];
    }
    set dataEnteredByUser(newData) {
        if ((Array.isArray(newData) && Array.isArray(newData[1]))) {
            this.$['drop-down'].selectedIndexes =  newData[1].slice();
        }
    }
    get dataEnteredByUser() {
        return [this.$['drop-down'].selectedItems.slice(), this.$['drop-down'].selectedIndexes.slice()];
    }
    /*
        Examples:

        'type': 'EQ'
        'fieldName': 'user'
        'value': 'Pol'

        'type': 'IN'
        'fieldName': 'user'
        'values': ['Pol', 'Anny']
    */
    get query() {
        if (this.isError() || !this.__queryFieldName) {
            return null;
        }

        const isSingleElementChecked = this.$['drop-down'].selectedItems.length === 1;
        const valueOrValues = isSingleElementChecked ? 'value' : 'values';
        return {
            type:            isSingleElementChecked ? 'EQ' : 'IN',
            fieldName:       this.__queryFieldName,
            isCaseSensitive: true,
            [valueOrValues]: isSingleElementChecked ? this.$['drop-down'].selectedItems[0] : this.$['drop-down'].selectedItems.slice()
        };
    }
    queryFieldName(newFieldName) {
        if (arguments.length === 0) {
            return this.__queryFieldName;
        }
        this.__queryFieldName = newFieldName;
        return this.__queryFieldName;
    }
    setDefaultValues() {
        this.$['drop-down'].selectedIndexes = [];
    }
    isError() {
        return this.$['drop-down'].selectedIndexes.length === 0;
    }
    getFormatted() {
        return `${this.$['drop-down'].selectedItems.join('; ')}`;
    }
    __setIsFilled() {
        this._setIsFilled(this.$['drop-down'].selectedIndexes.length !== 0);
    }
}

customElements.define(PTCSBooleanCase.is, PTCSBooleanCase);

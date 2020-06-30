import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

import './components/chip-container/ptcs-chip-data-filter-chip-container.js';
import './components/selector-drop-down/ptcs-chip-data-filter-selector-dropdown.js';

import {refDictionary, getStringBasedProperties} from './localization.js';

var DataFilter = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {
    static get is() {
        return 'ptcs-chip-data-filter';
    }
    static get template() {
        return html`
        <style>
                :host {
                    display: inline-flex;
                    flex-direction: column;
                    width: 100%;
                }
            </style>
            <ptcs-chip-data-filter-selector-dropdown on-change="__handleSelectorChange" id="selector" part="selector"
            dictionary="[[dictionary]]" tabindex\$="[[_delegatedFocus]]" 
            date-order="[[dateOrder]]" format-token="[[formatToken]]"></ptcs-chip-data-filter-selector-dropdown>
            <ptcs-chip-data-filter-chip-container on-remove="__removeEnteredData" id="chip-container" part="chip-container"
            dictionary="[[dictionary]]"></ptcs-chip-data-filter-chip-container>
        `;
    }
    static get properties() {
        /*
            to avoid loooong list of string based properties, they are appended here using Object.assign
            if a string has been changed, then the 'dictionary' property is updated
        */
        // add observer param to all string based properties
        const stringBasedProperties = getStringBasedProperties();
        Object.keys(stringBasedProperties).forEach(stringParam => {
            stringBasedProperties[stringParam].observer = '__updateDictionary';
        });
        return Object.assign({
            dictionary: { //  object is passed from vater component to its child (those that need translation(s))
                type:  Object,
                value: refDictionary
            },
            query: {
                type:   Object,
                notify: true
            },
            data: {
                type: String
            },
            _delegatedFocus: {
                type:  String,
                value: null
            },
            daysContainingData: {
                type: String,
            },
            // Full override of format
            formatToken: {
                type: String
            },
            dateOrder: {
                type:  String,
                value: 'YMD' //  auto, YMD, MDY, DMY (auto - is default format)
            },
        }, stringBasedProperties);
    }
    set data(newData) {
        this.$.selector.data = newData;
    }
    get data() {
        return this.$.selector.data;
    }

    set daysContainingData(newData) {
        const supportedType = 'datetime';
        const fieldWithDays = Object.entries(newData.dataShape.fieldDefinitions)[0][1];

        if (fieldWithDays && fieldWithDays.baseType.toLowerCase() === supportedType) {
            const arrayOfTimestamp = newData.rows.map(row => row[fieldWithDays.name]);
            this.$.selector.$['datetime-case'].$['date-picker'].daysContainingAnyData = arrayOfTimestamp;
        } else {
            console.warn(`${fieldWithDays.name} (${fieldWithDays.baseType}) is not supported`);
        }
    }

    get daysContainingData() {
        return this.$.selector.$['datetime-case'].$['date-picker'].daysContainingAnyData;
    }

    __removeEnteredData(event) {
        const triggerChip = event.composedPath()[0];
        const triggerChipId = Number(triggerChip.getAttribute('data-id'));
        const triggerChipFieldName = triggerChip.getAttribute('field-name');

        this.$.selector.removeEnteredData(triggerChipId, triggerChipFieldName);
    }
    __handleSelectorChange(event) {
        const selectorDataEnteredByUser = event.detail.data;
        const chipContainerData = selectorDataEnteredByUser.map((filterOption, index) => {
            return {
                content:   filterOption.formatted,
                error:     filterOption.isError,
                id:        index,
                fieldName: filterOption.fieldName
            };
        });
        this.$['chip-container'].data = chipContainerData;
        this.query = this.$.selector.query;
        event.stopPropagation();
    }
    __updateDictionary() {
        // notice, that the whole dictionary is updated, even if the only one string was changed as a result of translation :|
        // for sure, this can be the subject of the further improvements
        for (const stringProp of Object.keys(this.dictionary)) {
            this.set(`dictionary.${stringProp}`, this[stringProp]); // notify about change of a property
        }
    }
};

customElements.define(DataFilter.is, DataFilter);

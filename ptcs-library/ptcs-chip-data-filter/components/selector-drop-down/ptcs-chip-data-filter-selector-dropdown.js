import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-dropdown/ptcs-dropdown.js';

import './selectionViews/ptcs-number-case.js';
import './selectionViews/ptcs-string-case.js';
import './selectionViews/ptcs-boolean-case.js';
import './selectionViews/ptcs-datetime-case.js';

function getFilteredOutStructsBasedOnUnsupporTypes(inputData) {
    const supportedCases = ['string', 'boolean', 'number', 'datetime'];
    const filteredData = {
        dataShape: {
            fieldDefinitions: {}
        }
    };
    const dropDownItems = Object.
        entries(inputData.dataShape.fieldDefinitions).
        map(filterOption => {
            let dataTypeCase, filterOptionKey, filterOptionValue;
            [filterOptionKey, filterOptionValue] = filterOption;
            dataTypeCase = filterOptionValue.baseType;
            if (!supportedCases.includes(dataTypeCase && dataTypeCase.toLowerCase())) {
                console.error(`${filterOptionValue.name} (${dataTypeCase}) is not supported`);
            } else {
                filteredData.dataShape.fieldDefinitions[filterOptionKey] = filterOptionValue;
                return filterOptionValue.name;
            }
            return null;
        })
        .filter(el => el); // filter out null elements
    return [dropDownItems, filteredData];
}

class PTCSselector extends PTCS.BehaviorFocus(
    PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {
    static get template() {
        return html`
            <style>
                :host{
                    --subcomponent-margin-spacing: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-spacing);
                }
                #container {
                    display: flex;
                    flex-wrap: wrap;
                }
                [part="main-drop-down"], [part="no-selection"] {
                    width:  var(--ptcs-chip-data-filter-selector-dropdown-base-subcomponent-width);
                    height: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-height);
                    margin: var(--subcomponent-margin-spacing) var(--subcomponent-margin-spacing) 0px 0px;
                }
                [part="apply-button"] {
                    height: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-height);
                    margin-top: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-spacing);
                }
                ptcs-textfield[hidden] {
                    display: none;
                }
            </style>
            <div id="container">
                <ptcs-dropdown id="main-drop-down" part="main-drop-down" on-selected-indexes-changed="__handleMainDropDownIndexChange"
                hint-text=[[dictionary.stringAddFilter]] tabindex\$="[[_delegatedFocus]]" disabled></ptcs-dropdown>

                <ptcs-textfield id="no-selection-case-text-field" part="no-selection" hint-text=[[dictionary.stringSelectFilterFirst]]
                disabled tabindex\$="[[_delegatedFocus]]" hidden\$="[[__setHiddenIfPossible(__selectedItemParamsMainDropDown)]]"></ptcs-textfield>

                <ptcs-number-case id="number-case" part="number-case" on-data-approved="__forceClickOntoApply" dictionary=[[dictionary]]
                tabindex\$="[[_delegatedFocus]]" on-is-filled-changed="__toggleApply"
                hidden\$="[[__isThisDataTypeHidden('number', __selectedItemParamsMainDropDown)]]"></ptcs-number-case>

                <ptcs-string-case id="string-case" part="string-case" on-data-approved="__forceClickOntoApply" dictionary=[[dictionary]]
                tabindex\$="[[_delegatedFocus]]" on-is-filled-changed="__toggleApply"
                hidden\$="[[__isThisDataTypeHidden('string', __selectedItemParamsMainDropDown)]]"></ptcs-string-case>

                <ptcs-boolean-case id="boolean-case" part="boolean-case" dictionary=[[dictionary]] tabindex\$="[[_delegatedFocus]]"
                on-is-filled-changed="__toggleApply" hidden\$="[[__isThisDataTypeHidden('boolean', __selectedItemParamsMainDropDown)]]">
                </ptcs-boolean-case>

                <ptcs-datetime-case id="datetime-case" part="datetime-case" dictionary=[[dictionary]] tabindex\$="[[_delegatedFocus]]"
                on-is-filled-changed="__toggleApply" hidden\$="[[__isThisDataTypeHidden('datetime', __selectedItemParamsMainDropDown)]]"
                format-token="[[formatToken]]" date-order="[[dateOrder]]">
                </ptcs-datetime-case>

                <ptcs-button id="apply-button" part="apply-button" disabled variant="primary" label=[[dictionary.stringApply]]
                content-align="center" mode="label" on-click="__handleApplyClick" tabindex\$="[[_delegatedFocus]]"></ptcs-button>
            </div>
        `;
    }
    static get is() {
        return 'ptcs-chip-data-filter-selector-dropdown';
    }
    static get properties() {
        return {
            dictionary: {
                type:  Object,
                value: () => {}
            },
            _data: {
                type:     Object,
                value:    null,
                observer: '__handleDataChange'
            },
            _delegatedFocus: {
                type:  String,
                value: null
            },
            formatToken: {
                type: String
            },
            dateOrder: {
                type: String
            }
        };
    }
    constructor() {
        super();
        this.__caseRelatedDataInOrder = []; // the property keeps data entered by an user related with the different filter options
        this.__selectedItemParamsMainDropDown = {
            idx:      undefined,
            dataType: undefined,
            name:     undefined
        };
    }
    get query() {
        const filters = this.__caseRelatedDataInOrder
            .filter(specCase => specCase.query)
            .map(specCase => specCase.query);

        if (filters.length) {
            let queryHeader = {
                filters: {
                    type:    'AND',
                    filters: filters
                }
            };
            return queryHeader;
        }
        return null;
    }
    set data(inputData) {
        if (inputData && inputData.dataShape && inputData.dataShape.fieldDefinitions) {
            const [dropDownItems, filteredData] = getFilteredOutStructsBasedOnUnsupporTypes(inputData);
            if (JSON.stringify(filteredData) === JSON.stringify(this._data)) {
                return;
            }
            [this.$['main-drop-down'].items, this._data] = [dropDownItems, filteredData];
        } else {
            console.error('Incorrect format of data passed to selector [data-filter]');
        }
    }
    get data() {
        return this._data;
    }
    removeEnteredData(index, fieldName) {
        this.__clearCache(fieldName);
        this.__caseRelatedDataInOrder.splice(index, 1);
        this.__emmitChangeEvent();
    }
    __emmitChangeEvent() {
        this.dispatchEvent(new CustomEvent(
            'change',
            {
                bubbles:  true,
                composed: true,
                detail:   {
                    data: this.__caseRelatedDataInOrder.slice()
                }
            })
        );
    }
    __handleDataChange() {
        this.__setDefaultSelectorSetting();
        this.__caseRelatedDataInOrder = [];
        this.__emmitChangeEvent();
    }
    __toggleApply(event) {
        this.$['apply-button'].disabled = !event.detail.value;
    }
    __handleApplyClick() {
        if (!this.$['apply-button'].hasAttribute('disabled')) {
            this.__saveSelection();
            this.__setDefaultSelectorSetting();
            this.$['apply-button'].blur();
        }
    }
    __setDefaultSelectorSetting() {
        this.$['main-drop-down'].selected = -1;
        this.$['apply-button'].disabled = true;
        this.$['main-drop-down'].disabled = this.$['main-drop-down'].items.length === 0;

        this.$['no-selection-case-text-field'].disabled = true;
    }
    /*
        Returns {<ptcs-number-case>, <ptcs-text-case>, <ptcs-datetime-case>, <ptcs-boolean-case>, undefined, ...}
    */
    __getSelectedCaseComponent() {
        const dataType = this.__selectedItemParamsMainDropDown.dataType;
        const selectedCaseComponent = dataType && this.$[`${dataType.toLowerCase()}-case`];

        return selectedCaseComponent;
    }
    __getCorrespondingIdInEnteredData() {
        const selectedItemIdxDropDown = this.__selectedItemParamsMainDropDown.idx;
        let correspondingIndexInEnteredData;

        this.__caseRelatedDataInOrder.some((el, elIndex) => {
            if (el.innerIdx === selectedItemIdxDropDown) {
                correspondingIndexInEnteredData = elIndex;
                return true;
            }
            return false;
        });
        return correspondingIndexInEnteredData;
    }
    __saveSelection() {
        const selectedCaseComponent = this.__getSelectedCaseComponent();
        if (selectedCaseComponent) {
            const selectedItemIdxDropDown = this.__selectedItemParamsMainDropDown.idx;
            const selectedItemCategoryDropDown = this.__selectedItemParamsMainDropDown.name;
            const dataToBeInserted = {
                query:             selectedCaseComponent.query,
                dataEnteredByUser: selectedCaseComponent.dataEnteredByUser,
                formatted:         `${selectedItemCategoryDropDown}: ${selectedCaseComponent.getFormatted()}`,
                isError:           selectedCaseComponent.isError(),
                innerIdx:          selectedItemIdxDropDown,
                fieldName:         selectedCaseComponent.__queryFieldName,
                element:           selectedCaseComponent
            };
            const correspondingIndexInEnteredData = this.__getCorrespondingIdInEnteredData();

            if (correspondingIndexInEnteredData !== undefined) { // check whether the data has been already entered
                this.__caseRelatedDataInOrder[correspondingIndexInEnteredData] = dataToBeInserted; // and replace
            } else {
                this.__caseRelatedDataInOrder.push(dataToBeInserted); // save new data
            }
            this.__emmitChangeEvent();
        }
    }
    __loadDataForSelectedOption() {
        const selectedCaseComponent = this.__getSelectedCaseComponent();
        if (selectedCaseComponent) {
            const correspondingIndexInEnteredData = this.__getCorrespondingIdInEnteredData();
            const dataToBeLoaded = this.__caseRelatedDataInOrder[correspondingIndexInEnteredData];

            if (dataToBeLoaded) {
                selectedCaseComponent.dataEnteredByUser = dataToBeLoaded.dataEnteredByUser;
            } else {
                selectedCaseComponent.setDefaultValues();
            }
            selectedCaseComponent.queryFieldName(this.__selectedItemParamsMainDropDown.name);
        }
    }
    __isThisDataTypeHidden(refDataType) {
        const selectedDataType = this.__selectedItemParamsMainDropDown.dataType || 'undefined';
        return refDataType.toLowerCase() !== selectedDataType.toLowerCase();
    }
    __setHiddenIfPossible() {
        return this.__isThisDataTypeHidden('undefined') && 'hidden';
    }
    __handleMainDropDownIndexChange(event) {
        const outputIdx = event.detail.value[0];
        const setSelectedItemParams = () => {
            let outputDataType, outputName;
            if (outputIdx !== undefined) {
                const fieldDefinitionsArray = Object.values(this._data.dataShape.fieldDefinitions);

                outputDataType = outputIdx < fieldDefinitionsArray.length ? fieldDefinitionsArray[outputIdx].baseType : undefined;
                outputName = fieldDefinitionsArray[outputIdx].name;
            }
            this.__selectedItemParamsMainDropDown = { // update __selectedItemParamsMainDropDown based on the selection of mainDropDown
                idx:      outputIdx,
                dataType: outputDataType,
                name:     outputName
            };
        };

        setSelectedItemParams();

        if (outputIdx !== undefined) {
            this.__loadDataForSelectedOption();
            const selectedCaseComponent = this.__getSelectedCaseComponent();
            this.$['apply-button'].disabled = selectedCaseComponent ? !selectedCaseComponent.isFilled : 'false';
        }
    }
    __forceClickOntoApply() {
        this.$['apply-button'].click();
    }

    __clearCache(fieldName) {
        const typeElementRelatedtoChips = this.__caseRelatedDataInOrder.find((el) => el.fieldName === fieldName);
        if (typeElementRelatedtoChips && typeElementRelatedtoChips.element.clearCache) {
            typeElementRelatedtoChips.element.clearCache();
        }
    }
}

customElements.define(PTCSselector.is, PTCSselector);

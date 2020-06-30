import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-datepicker/ptcs-datepicker.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

class PTCSDatetimeCase extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PolymerElement))) {
    static get template() {
        //eslint-disable-next-line max-len
        return html`
            <style>
                :host {
                    display: flex;
                }
                :host([hidden]) {
                    display: none;
                }
                #date-picker {
                    width: var(--ptcs-chip-data-filter-selector-dropdown-base-subcomponent-width);
                    height: var(--ptcs-chip-data-filter-selector-dropdown-subcomponent-height);
                    margin: var(--subcomponent-margin-spacing) var(--subcomponent-margin-spacing) 0px 0px;
                }
            </style>
            <ptcs-datepicker
                id="date-picker"
                date-order="DMY"
                tabindex\$="[[_delegatedFocus]]"
                hint-text=[[dictionary.stringPleaseSelectDateOrRange]]
                from-and-to-fields-hint-text=[[dictionary.stringRangeHintText]]
                from-field-label=[[dictionary.stringStartDateLabel]]
                to-field-label=[[dictionary.stringEndDateLabel]]
                done-label=[[dictionary.stringDoneLabelButton]]
                label-alignment="left"
                on-date-changed="__getCurrentSelectedRange"
                date-range-selection
                format-token="[[formatToken]]"
                date-order="[[dateOrder]]"
                multiple-date-selection>
            </ptcs-datepicker>
        `;
    }
    static get is() {
        return 'ptcs-datetime-case';
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
        this.__cachedData = {formattedListoOfDates: [], date: []};
    }
    set dataEnteredByUser(newData) {
        this.__cachedData = newData;
        this.$['date-picker'].listOfSelectedDates = newData.formattedListoOfDates;
    }
    get dataEnteredByUser() {
        return Object.assign(this.__cachedData);
    }
    get query() {
        if (this.isError() || !this.__queryFieldName) {
            return null;
        }
        const parseToTimestamp = (day) => Date.parse(day);
        const filters = this.__cachedData.date.map(range => {
            return {
                type:            'Between',
                fieldName:       this.__queryFieldName,
                isCaseSensitive: true,
                from:            parseToTimestamp(range.from),
                to:              parseToTimestamp(range.to)
            };
        });

        return {
            type:    'OR',
            filters: filters
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
        this.__cachedData = {formattedListoOfDates: [], date: []};
        this.$['date-picker'].listOfSelectedDates = [];
        this.$['date-picker'].fromDate = null;
        this.$['date-picker'].toDate = null;
        this.$['date-picker'].date = '';
    }
    clearCache() {
        this.setDefaultValues();
    }
    isError() {
        return !this.$['date-picker'].listOfSelectedDates.length;
    }
    getFormatted() {
        return this.$['date-picker'].listOfSelectedDates;
    }
    __setIsFilled() {
        this._setIsFilled(!this.isError());
    }
    __getCurrentSelectedRange() {
        this.__cachedData = this.__getCurrentData();
        this.__setIsFilled();
    }
    __getCurrentData() {
        const cachedDataCopy = Object.assign(this.__cachedData);
        const datepickerFillContent = this.$['date-picker'].listOfSelectedDates;
        const startDate = this.$['date-picker'].fromDate;
        const endDate = this.$['date-picker'].toDate;

        if (datepickerFillContent && datepickerFillContent.length && startDate && endDate) {
            cachedDataCopy.formattedListoOfDates = datepickerFillContent;
            cachedDataCopy.date.push({from: startDate, to: endDate});
        }
        return cachedDataCopy;
    }
}

customElements.define(PTCSDatetimeCase.is, PTCSDatetimeCase);

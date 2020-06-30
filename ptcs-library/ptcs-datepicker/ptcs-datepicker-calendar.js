import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import 'ptcs-hbar/ptcs-hbar.js';
import 'ptcs-vbar/ptcs-vbar.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-textfield/ptcs-textfield.js';
import 'ptcs-dropdown/ptcs-dropdown.js';
import 'ptcs-shadow-style/ptcs-custom-css.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import './moment-import.js';

PTCS.DatepickerCalendar = class extends PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {
    static get template() {
        return html`
    <style>
      :host {
        display: inline-block;
        position: absolute;
        z-index: 99996;
      }

      :host([hidden]) {
        display: none;
      }

      [part=datepicker-container] {
        width: 301px;
        min-height: 344px;
        margin-top: 8px;
        padding: 8px 8px 8px 8px;
        border: 1px solid;
      }

      [part=datepicker-container] #divider {
        width: 285px;
        border: 0;
        border-top: 1px solid #d8d8de;
      }

      [part="weekdays"] {
        margin-left: 8px;
      }

      [part="weekday"] {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        box-sizing: border-box;
        width: 41px;
        height: 25px;
        user-select: none;
      }

      [part="days"] {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
        padding-left:8px;
        padding-top: 8px;
        user-select: none;
      }

      [part="day"] {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 41px;
        height: 41px;
        text-transform: none;
      }

      [part="days"][any-data] [part="day"] {
        flex-direction: column;
      }

      [part="day"]:not([disabled]) {
        cursor: pointer;
      }

      [part="header"] {
        padding-bottom: 16px;
      }

      [part="prev-month-button"],
      [part="next-month-button"] {
        margin: 8px;
        flex: none;
      }

      .time-separator {
        font-size: 20px;
        padding-top: 15px;
      }

      [part="apply-button"],
      [part="today-button"] {
        margin: 8px;
      }
      [part="today-button"][hidden] {
        display: none;
      }

      [date-only] [part="time"] {
        display: none !important;
      }

      [part="month-dropdown"] {
        width: calc(100% + 30px);
        margin: 8px;
      }

      [part="year-dropdown"] {
        width: calc(100% - 30px);
        margin: 8px;
      }

      [part="hour-dropdown"],
      [part="minute-dropdown"],
      [part="second-dropdown"] {
        width: 100%;
        margin: 8px;
      }

      [hide-seconds] .seconds-separator {
        display: none
      }

      [hide-seconds] [part="second-dropdown"] {
        margin: 0px;
        display: none
      }

      ptcs-hbar.reverse {
        flex-direction: row-reverse !important;
        justify-content: flex-start !important;
      }

      [part="time"] {
        align-items: stretch !important;
      }

      [part="day"] [part="dot"] {
        visibility: hidden;
      }

      [part="day"] [part="dot"][visible] {
        visibility: visible;
      }

      [part="days"][any-data] [part="day"] [part="dot"]{
        display: block;
      }

      [part="dot"] {
        display: none;
      }

      [part="range-inputs"]{
        display: flex;
        flex-flow: column nowrap;
        place-content: center flex-start;
        align-items: center;
      }

      [part="range-inputs"][hidden]{
        display: none;
      }

    </style>
    <div part="datepicker-container" date-only\$="[[dateOnly]]" hide-seconds\$="[[!displaySeconds]]">
    <div part="range-inputs" hidden\$="[[!dateRangeSelectionCalendar]]">
      <ptcs-textfield icon="page:calendar" tabindex\$="[[_delegatedFocus]]"
      part="date-field-from" label="{{fromFieldLabel}}" id="fromDate" text="[[fromDate.text]]" disabled\$="[[disabled]]"
        hint-text="{{hintText}}" read-only display-clear-button-on-readonly></ptcs-textfield>
      <ptcs-textfield icon="page:calendar" tabindex\$="[[_delegatedFocus]]"
      part="date-field-to"  label="{{toFieldLabel}}" id="toDate" text="[[toDate.text]]" disabled\$="[[disabled]]"
       hint-text="{{hintText}}" read-only  display-clear-button-on-readonly></ptcs-textfield>
     </div>
      <ptcs-hbar part="header" id="header" stretch="">
        <ptcs-button variant="small" icon="[[iconBackward]]" part="prev-month-button" on-click="_previousMonth"
        tabindex\$="[[_delegatedFocus]]"></ptcs-button>
        <ptcs-dropdown part="month-dropdown" id="currmonth" items="[[_months]]" selected-value="{{_selectedMonth}}"
        partmap="* month-dropdown-*" selector="name" initial-count="[[initialCount]]"
        disable-no-item-selection="" tabindex\$="[[_delegatedFocus]]"></ptcs-dropdown>
        <ptcs-dropdown part="year-dropdown" id="curryear" items="[[_years]]" selected-value="{{_selectedYear}}"
        selector="name" partmap="* year-dropdown-*" initial-count="[[initialCount]]"
        disable-no-item-selection="" tabindex\$="[[_delegatedFocus]]"></ptcs-dropdown>
        <ptcs-button variant="small" icon="[[iconForward]]" part="next-month-button"
        on-click="_nextMonth" tabindex\$="[[_delegatedFocus]]"></ptcs-button>
      </ptcs-hbar>
      <ptcs-hbar id="weekdays" part="weekdays">
        <template is="dom-repeat" items="{{_weekdays}}">
          <div part="weekday">[[item]]</div>
        </template>
      </ptcs-hbar>
      <div part="days" id="days" tabindex\$="[[_delegatedFocus]]" any-data\$="[[datePresentedByDots.length]]">
        <template id="daysTemplate" is="dom-repeat" items="{{_days}}">
          <div part="day" selected\$="[[item.selected]]" disabled\$="[[item.disabled]]" on-click="_selectDay"
          on-dblclick="_setDay" double="">[[item.date]]
          <span part="dot" visible\$="[[item.data]]"></span>
          </div>
        </template>
      </div>
      <ptcs-vbar part="time" id="time">
        <ptcs-hbar>
          <ptcs-dropdown part="hour-dropdown" label="[[capitalize(hoursLabel)]]" id="currhour" items="[[_hours]]"
          selected-value="{{_selectedHour}}" selector="displayName" initial-count="[[initialCount]]"
          disable-no-item-selection="" partmap="* hour-dropdown-*" tabindex\$="[[_delegatedFocus]]"></ptcs-dropdown>
          <span class="time-separator">[[timeSeparator]]</span>
          <ptcs-dropdown part="minute-dropdown" label="[[capitalize(minutesLabel)]]" id="currminute" items="[[_minutes]]"
          selected-value="{{_selectedMinute}}" selector="displayName" initial-count="[[initialCount]]"
          disable-no-item-selection="" partmap="* minute-dropdown-*" tabindex\$="[[_delegatedFocus]]"></ptcs-dropdown>
          <span class="seconds-separator time-separator">[[timeSeparator]]</span>
          <ptcs-dropdown part="second-dropdown" label="[[capitalize(secondsLabel)]]" id="currsecond" items="[[_seconds]]"
          selected-value="{{_selectedSecond}}" selector="displayName" initial-count="[[initialCount]]"
          disable-no-item-selection="" partmap="* second-dropdown-*" tabindex\$="[[_delegatedFocus]]"></ptcs-dropdown>
        </ptcs-hbar>
        <div>
          <hr id="divider" noshade="">
        </div>
      </ptcs-vbar>
      <ptcs-hbar part="footer" end="" class\$="{{_clsButtons(actionPosition)}}">
        <ptcs-button variant="primary" partmap="* apply-button-*" part="apply-button" on-click="_submit"
        label="[[doneLabel]]" tabindex\$="[[_delegatedFocus]]"
        disabled\$="[[!__isFromAndToSelected(dateRangeSelectionCalendar, fromDate.date, toDate.date)]]"></ptcs-button>
        <ptcs-button hidden\$="[[!showTodayButton]]" variant="tertiary" partmap="* today-button-*" part="today-button" on-click="_today"
        label="[[todayLabel]]" tabindex\$="[[_delegatedFocus]]"></ptcs-button>
      </ptcs-hbar>
    </div>
`;
    }

    static get is() {
        return 'ptcs-datepicker-calendar';
    }

    static get properties() {
        return {
            // Input
            dateTime: {
                type:     Object,
                observer: '_dateTimeChanged'
            },

            hidden: {
                type:     Boolean,
                value:    true,
                observer: '_hiddenChanged'
            },

            initialize: {
                type: Boolean
            },

            initialCount: {
                type:  Number,
                value: 5
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            // Calendar data
            _weekdays: {
                type:     Array,
                computed: '_computeWeekDaysName(weekStart)'
            },

            _days: {
                type:  Array,
                value: () => []
            },

            _years: {
                type:  Array,
                value: []
            },

            _months: {
                type:     Array,
                computed: '_computeMonths(initialize)'
            },

            _hours: {
                type:     Array,
                computed: '_computeHours(initialize, dateOnly)'
            },

            _minutes: {
                type:     Array,
                computed: '_computeMinutes(initialize, dateOnly)'
            },

            _seconds: {
                type:     Array,
                computed: '_computeSeconds(initialize, dateOnly, displaySeconds)'
            },

            // The date shown in the calendar: (year, month, !day, hour, minute, second)
            _currentDate: {
                type:  Object,
                value: moment()
            },

            // The currently selected day
            _selectedDay: {
                type:  Object,
                value: moment()
            },

            // _selectedDay as dropdown indexes
            _selectedYear: {
                type: String
            },

            _selectedMonth: {
                type: String
            },

            _selectedHour: {
                type: String
            },

            _selectedMinute: {
                type: String
            },

            _selectedSecond: {
                type: String
            },

            _focusedDay: {
                type: Number
            },

            // Config display / behaviour
            dateOnly: {
                type:  Boolean,
                value: true
            },

            displaySeconds: {
                type:  Boolean,
                value: false
            },

            yearRange: {
                type:  Number,
                value: 10,
            },

            timeSeparator: {
                type:  String,
                value: ':'
            },

            actionPosition: {
                type:  String,
                value: 'left'
            },

            weekStart: {
                type:  String,
                value: 'Monday'
            },

            iconBackward: {
                type:  String,
                value: 'chevron-left'
            },

            iconForward: {
                type:  String,
                value: 'chevron-right'
            },

            _delegatedFocus: {
                type:  String,
                value: null
            },

            // buttons
            doneLabel: {
                type:  String,
                value: 'Done'
            },

            todayLabel: {
                type:  String,
                value: 'Today'
            },

            hoursLabel: {
                type:  String,
                value: 'Hours'
            },

            minutesLabel: {
                type:  String,
                value: 'Minutes'
            },

            secondsLabel: {
                type:  String,
                value: 'Seconds'
            },

            dateRangeSelectionCalendar: {
                type:     Boolean,
                value:    false,
                observer: '__observerDateRangeSelectionCalendar'
            },

            fromDate: {
                type:     Object,
                value:    () => ({date: null, text: null, index: null}),
                observer: '__observeFromDate'

            },

            toDate: {
                type:     Object,
                value:    () => ({date: null, text: null, index: null}),
                observer: '__observeToDate'
            },

            datePresentedByDots: {
                type: Array
            },

            _daysFromPreviousAndNextMonth: {
                type: Array
            },

            dateFormat: {
                type: String
            },

            showTodayButton: {
                type: Boolean
            },

            // Hint to date editor
            hintText: {
                type: String,
            },

            fromFieldLabel: {
                type: String
            },

            toFieldLabel: {
                type: String
            },

            multipleDateSelection: {
                type: Boolean
            }

        };
    }

    capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    static get observers() {
        return [
            '_observeSelection(_selectedYear, _selectedMonth, _selectedHour, _selectedMinute, _selectedSecond, datePresentedByDots)',
            '_computeYears(initialize, _selectedYear)'
        ];
    }

    ready() {
        super.ready();
        this._updateDateTimePicker();
        this.addEventListener('keydown', ev => this._keyDown(ev));
        this._trackFocus(this.$.days, () => {
            return this._focusedDay >= 0 ? this.$.days.children[this._focusedDay] : null;
        });
    }

    _hiddenChanged(hidden) {
        if (!hidden && !this.initialize) {
            requestAnimationFrame(() => {
                this.initialize = true;
            });
        }
    }

    static range(start, end) {
        let data = [];
        for (let i = start; i <= end; i++) {
            data.push({name: i});
        }
        return data;
    }

    static rangeTime(start, end, type) {
        let data = [];
        const curr = moment();
        for (let i = start; i <= end; i++) {
            curr.set(type.name, i);
            data.push({name: i, displayName: curr.format(type.format)});
        }
        return data;
    }

    _updateDoubleBorder(days) {
        if (days.length === 0) {
            return;
        }
        for (let i = 0; i < days.length; i++) {
            if ((i + 1) % 7 !== 0) {
                days[i].style.borderRight = 'none';
            }
            if (i > 6) {
                days[i].style.borderTop = 'none';
            }
        }
    }
    _computeYears(initialize, selectedYear) {
        if (!initialize) {
            return;
        }

        const year = Number(selectedYear);

        requestAnimationFrame(() => {
            const currentYears = this._years;
            const newYears = PTCS.DatepickerCalendar.range(year - this.yearRange, year + this.yearRange);

            if (!Array.isArray(newYears)) {
                return;
            }

            // The years range changed -> update the years dropdown
            if (!Array.isArray(currentYears) || (currentYears.length !== newYears.length) ||
                (currentYears.length > 0 && newYears.length > 0 && currentYears[0].name !== newYears[0].name)) {
                this._years = newYears;
            }
        });
    }

    _computeMonths(initialize) {
        return initialize ? moment.months().map((m => {
            return {name: m};
        })) : [];
    }

    _computeHours(initialize, dateOnly) {
        return (!initialize || dateOnly) ? [] : PTCS.DatepickerCalendar.rangeTime(0, 23, {name: 'hour', format: 'HH'});
    }

    _computeMinutes(initialize, dateOnly) {
        return (!initialize || dateOnly) ? [] : PTCS.DatepickerCalendar.rangeTime(0, 59, {name: 'minute', format: 'mm'});
    }

    _computeSeconds(initialize, dateOnly, displaySeconds) {
        return (!initialize || dateOnly || !displaySeconds) ? [] : PTCS.DatepickerCalendar.rangeTime(0, 59, {name: 'second', format: 'ss'});
    }

    _computeWeekDaysName(weekStart) {
        const weekDays = moment.weekdaysMin().map(day => this.capitalize(day.slice(0, 1)));
        return weekStart.toLowerCase() === 'monday' ? [...weekDays.slice(1), weekDays[0]] : weekDays;
    }

    _observeSelection(_selectedYear, _selectedMonth, _selectedHour, _selectedMinute, _selectedSecond, datePresentedByDots) {
        this._currentDate.set('year', _selectedYear);
        this._currentDate.set('month', _selectedMonth);
        this._currentDate.set('hour', _selectedHour);
        this._currentDate.set('minute', _selectedMinute);
        this._currentDate.set('second', _selectedSecond);

        // Update Calendar
        const displayedMonth = this._currentDate;

        let month = moment(displayedMonth).month();
        let firstDayOfWeek = this.weekStart.toLowerCase() === 'monday' ? moment().weekday(1).day() : moment().weekday(0).day();
        // set current date to the calendar starting date
        let currentDay = moment(displayedMonth).date(1);

        while (currentDay.day() !== firstDayOfWeek) {
            currentDay.subtract(1, 'day');
        }

        // Date range selection
        const checkIfTheDayHasAnyData = () => datePresentedByDots.includes(moment(currentDay).format(this.dateFormat));
        const checkIfAnyIsSame = (date, from, to) => (moment(date).isSame(to, 'day') || moment(date).isSame(from, 'day'));


        // fill an array with dates and properties
        let dates = [];
        let daysFromPreviousAndNextMonth = [];
        for (let index = 0; index < 42; index++) {
            let dt = {};
            dt.disabled = month !== currentDay.month();
            if (this.dateRangeSelectionCalendar) {
                dt.date = currentDay.date();
                dt.data = datePresentedByDots ? checkIfTheDayHasAnyData() : false;
                dt.selected = !dt.disabled && checkIfAnyIsSame(currentDay, this.fromDate.date, this.toDate.date);
            } else {
                dt.date = dt.disabled ? '' : currentDay.date();
                dt.selected = currentDay.isSame(this._selectedDay, 'day') && !dt.disabled;
            }
            if (dt.disabled && index !== 0 && (currentDay.day() === firstDayOfWeek)) {
                break;
            }
            dates.push(dt);
            if (this.dateRangeSelectionCalendar && month !== currentDay.month()) {
                daysFromPreviousAndNextMonth.push(index);
            }
            currentDay = currentDay.add(1, 'day');
        }

        this._daysFromPreviousAndNextMonth = daysFromPreviousAndNextMonth;
        this._days = dates;
        this._focusedDay = -1;
        this._focusedDay = dates.findIndex(d => d.selected);
        if (this._focusedDay === -1) {
            this._focusedDay = dates.findIndex(d => !d.disabled);
        }

        if (this.dateRangeSelectionCalendar && (this.fromDate.date || this.toDate.date)) {
            this.__setSelectedDayInCurrentlyDate();
        }
        this._updateDateTimePicker();
        this.$.daysTemplate.render();
        this._updateDoubleBorder(this.$.days.querySelectorAll('[part=day]'));

    }

    _dateTimeChanged(dateTime) {
        if (this.dateRangeSelectionCalendar && (dateTime.fromDate || dateTime.toDate)) {
            const from = moment(dateTime.fromDate);
            const to = moment(dateTime.toDate);
            if ((moment(from).isSame(this.fromDate.date) && moment(to).isSame(this.toDate.date))) {
                this._currentDate = to;
                this._updateDateTimePicker();
                return;
            }
            this.__setSelectedReceivedRangeDate(from, true);
            if (!moment(from).isSame(to, 'day')) {
                this.__setSelectedReceivedRangeDate(to);
            }
        } else {
            if (dateTime.format) {
                this._selectedDay = moment(dateTime);
            } else {
                this._selectedDay = moment();
                this.__resetCalendar();
            }
            this._currentDate = moment(this._selectedDay);
            this._updateDateTimePicker();
        }
    }

    _nextMonth() {
        this._currentDate.add(1, 'month');
        this._updateDateTimePicker();
    }

    _previousMonth() {
        this._currentDate.subtract(1, 'month');
        this._updateDateTimePicker();
    }

    _updateDateTimePicker() {
        this.setProperties({
            _selectedYear:   this._currentDate.format('YYYY'),
            _selectedMonth:  this._currentDate.format('MMMM'),
            _selectedHour:   this._currentDate.format('HH'),
            _selectedMinute: this._currentDate.format('mm'),
            _selectedSecond: this._currentDate.format('ss')
        });
        /*
         * Don't set date until someone presss Today or Submit
         *
        this.dispatchEvent(new CustomEvent('calendar-date-changed', {
            bubbles:  true,
            composed: true,
            detail:
    {
        date:          moment(this._currentDate),
        closeCalendar: false
    }
        }));
        */
    }

    //
    // Event handlers
    //
    _selectDayIndex(ixNew) {
        if (!(ixNew >= 0) || this._days[ixNew].disabled) {
            return;
        }

        if (this.dateRangeSelectionCalendar) {
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            this.__beingSelected(this.__clearedFromValue && this.__isToDateSelected && this.$.fromDate);
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            this.__isfromDateSelected ? this.__setSelectedToDate(ixNew) : this.__setSelectedFromDate(ixNew, this.fromDate.date);
        } else {
            const ixOld = this._days.findIndex(item => item.selected);
            this.__selectCurrentDay(ixNew, ixOld);
        }
        this._updateDateTimePicker();
    }

    _selectDay(ev) {
        this._selectDayIndex(this.$.daysTemplate.indexForElement(ev.target));
    }

    _setDay(ev) {
        this._selectDay(ev);
        this._submit();
    }

    _submit() {
        this.dispatchEvent(new CustomEvent('calendar-date-changed', {
            bubbles:  true,
            composed: true,
            detail:   {
                date: this.dateRangeSelectionCalendar
                    ? {
                        fromDate: moment(this.fromDate.date),
                        toDate:   moment(this.toDate.date)
                    }
                    : moment(this._currentDate),

                closeCalendar: true
            }
        }));
        if (this.dateRangeSelectionCalendar && this.multipleDateSelection) {
            this.__beingSelected(this.$.fromDate);
            this.__resetCalendar();
        }
    }

    _cancel() {
        this.dispatchEvent(new CustomEvent('calendar-date-changed', {
            bubbles:  true,
            composed: true,
            detail:   {
                closeCalendar: true
            }
        }));
    }

    _today() {
        this._currentDate = moment();
        this._selectedDay = moment(this._currentDate);
        if (this.dateRangeSelectionCalendar) {
            this.__resetCalendar();
            this.__setSelectedFromDate(this.__findSelectedDateIndex(this._selectedDay), this.fromDate.date);
        }
        this._updateDateTimePicker();
        this._submit();
    }
    /*
    _goUp() {
    }

    _goDown() {
    }

    _goLeft() {
    }

    _goRight() {
    let focused = this._getFocused();
    let nextFocusedEl = focused.nextElementSibling;
    if (nextFocusedEl) {
      nextFocusedEl.focus();
    }
    }

    _navigateDays(direction) {
    let days = this.$.days;
    let day = days.getElementsByTagName('div');
    switch (direction) {
      case 'up':
        for (let i = 0; i < day.length; i++) {
          let tempDay = day[i];
          if (tempDay.hasAttribute('selected')) {
            let previousDay = day[i - 7];
            if (i - 7 < 0 || previousDay.hasAttribute('disabled')) {
              return false;
            }
            tempDay.removeAttribute('selected');
            previousDay.setAttribute("selected", true);
            this._selectedDay = moment(this._currentDate).date(previousDay.innerText);
            break;
          }
        }
        break;
      case 'down':
        for (let i = 0; i < day.length; i++) {
          let tempDay = day[i];
          if (tempDay.hasAttribute('selected')) {
            let nextDay = day[i + 7];
            if (i + 7 > day.length || nextDay.hasAttribute('disabled')) {
              return false;
            }
            tempDay.removeAttribute('selected');
            nextDay.setAttribute("selected", true);
            this._selectedDay = moment(this._currentDate).date(nextDay.innerText);
            break;
          }
        }
        break;
      case 'left':
        for (let i = 0; i < day.length; i++) {
          let tempDay = day[i];
          if (tempDay.hasAttribute('selected')) {
            let previousDay = tempDay.previousElementSibling;
            if (previousDay.hasAttribute('disabled')) {
              return false;
            }
            tempDay.removeAttribute('selected');
            previousDay.setAttribute("selected", true);
            this._selectedDay = moment(this._currentDate).date(previousDay.innerText);
            break;
          }
        }
        break;
      case 'right':
        for (let i = 0; i < day.length; i++) {
          let tempDay = day[i];
          if (tempDay.hasAttribute('selected')) {
            let previousDay = tempDay.nextElementSibling;
            if (previousDay.hasAttribute('disabled')) {
              return false;
            }
            previousDay.setAttribute("selected", true);
            tempDay.removeAttribute("selected");
            this._selectedDay = moment(this._currentDate).date(previousDay.innerText);
            break;
          }
        }
        break;
    }
    }

    _onSpacePressed(focused) {
    focused.click();
    }

    _close() {
    console.log('---Should close calendar');
    }

    _getFocused() {
    if (!document.activeElement.shadowRoot) {
      return document.activeElement;
    }

    let header = document.activeElement.shadowRoot.getElementById('header');
    let focusedElement = header.children[0];
    focusedElement.focus();
    return focusedElement;
    }

    _initKeyboardNav() {
    let focused = this._getFocused();
    if (!this.hasListener) {
      window.addEventListener('keydown', event => {
        this.hasListener = true;
        switch (event.keyCode) {
          case 27:
            console.log("ESCAPE.");
            event.preventDefault();
            this._close();
            break;
          case 32:
            console.log("SPACE.");
            event.preventDefault();
            this._onSpacePressed(focused);
            break;
          case 37:
            console.log("LEFT.");
            event.preventDefault();
            if (this._getFocused().id === 'days') {
              this._navigateDays('left');
            } else {
              this._goLeft();
            }
            break;
          case 38:
            console.log("UP.");
            event.preventDefault();
            if (this._getFocused().id === 'days') {
              this._navigateDays('up');
            } else {
              this._goUp();
            }
            break;
          case 39:
            console.log("RIGHT.");
            event.preventDefault();
            if (this._getFocused().id === 'days') {
              this._navigateDays('right');
            } else {
              this._goRight();
            }
            break;
          case 40:
            console.log("DOWN.");
            event.preventDefault();
            if (this._getFocused().id === 'days') {
              this._navigateDays('down');
            } else {
              this._goDown();
            }
            break;
        }
      });
    }
    }
    */

    _clsButtons(actionPosition) {
        return actionPosition.toLowerCase() === 'right' ? 'reverse' : '';
    }

    _keyDown(ev) {
        if (this.disabled) {
            return;
        }

        // Global keys
        switch (ev.key) {
            case 'Enter':
                if (this.dateRangeSelectionCalendar) {
                    //eslint-disable-next-line chai-friendly/no-unused-expressions
                    this.__isFromAndToSelected(this.dateRangeSelectionCalendar, this.fromDate.date, this.toDate.date) && this._submit();
                } else {
                    this._selectDayIndex(this._focusedDay);
                    this._submit();
                }
                ev.preventDefault();
                break;
            case 'Escape':
                this._cancel();
                ev.preventDefault();
        }

        if (this.shadowRoot.activeElement !== this.$.days) {
            return;
        }

        // Calendar days keys
        let fi = this._focusedDay;
        switch (ev.key) {
            case 'ArrowRight':
                fi++;
                break;
            case 'ArrowUp':
                fi -= 7;
                break;
            case 'ArrowLeft':
                fi--;
                break;
            case 'ArrowDown':
                fi += 7;
                break;
            case 'PageUp':
            case 'Home':
                fi = 0;
                break;
            case 'PageDown':
            case 'End':
                fi = this._days.length;
                break;
            case ' ':
                this._selectDayIndex(fi);
                ev.preventDefault();
                break;
        }

        // Check and fix limit errors
        if (fi < 0 || (fi < 7 && this._days[fi].disabled)) {
            fi = this._days.findIndex(d => !d.disabled);
        } else if (fi >= this._days.length || this._days[fi].disabled) {
            // eslint-disable-next-line no-empty
            for (fi = this._days.length - 1; fi >= 0 && this._days[fi].disabled; fi--) {
                // empty
            }
        }

        // Update focus
        if (fi !== this._focusedDay) {
            this._focusedDay = fi;
            ev.preventDefault();
        }
    }
    // RANGE CALENDAR

    __observerDateRangeSelectionCalendar(isDateRangeSelectionCalendarSelected) {
        if (this.multipleDateSelection) {
            this.__resetCalendar();
        }
        this.__toogleClearButtonListener(isDateRangeSelectionCalendarSelected);
    }

    __toogleClearButtonListener(dateRangeIsSelected) {
        const setClearButtonEvent = () => {
            const clearDateValueAndUpdateDatepicker = (isFrom) => {
                this._currentDate = moment(isFrom ? this.toDate.date : this.fromDate.date);
                this._updateDateTimePicker();
                this.__clearedValue = true;
                if (!isFrom) {
                    this.__isfromDateSelected = true;
                    this.toDate = this.__setEmptyFromOrToValue();
                    return;
                }
                this.fromDate = this.__setEmptyFromOrToValue();
            };

            this.__fromDateClearButtonEvent = () => {
                if (!this.toDate.date || (moment(this.toDate.date).isSame(this.fromDate.date, 'day'))) {
                    this.__resetCalendar();
                    return;
                }
                clearDateValueAndUpdateDatepicker(true);
            };
            this.__toDateClearButtonEvent = () => {
                if (!this.fromDate.date) {
                    this.__resetCalendar();
                    return;
                }
                clearDateValueAndUpdateDatepicker();
            };
        };

        const setClearButtonListener = () => {
            setClearButtonEvent();
            this.$.fromDate.shadowRoot.querySelector('#clearbutton').addEventListener('click', this.__fromDateClearButtonEvent);
            this.$.toDate.shadowRoot.querySelector('#clearbutton').addEventListener('click', this.__toDateClearButtonEvent);
        };

        const removeClearButtonListener = () => {
            this.$.fromDate.shadowRoot.querySelector('#clearbutton').removeEventListener('click', this.__fromDateClearButtonEvent);
            this.$.toDate.shadowRoot.querySelector('#clearbutton').removeEventListener('click', this.__toDateClearButtonEvent);
            this.__fromDateClearButtonEvent = this.__toDateClearButtonEvent = null;
        };

        if (dateRangeIsSelected) {
            if (!this.__fromDateClearButtonEvent && !this.__toDateClearButtonEvent) {
                setClearButtonListener();
            }
            return;
        }
        if (this.__fromDateClearButtonEvent && this.__toDateClearButtonEvent) {
            removeClearButtonListener();
        }
    }

    __beingSelected(elem) {
        const selectedAtr = 'being-active';
        if (elem) {
            const previousFocus = this.$.fromDate.hasAttribute(selectedAtr) ? this.$.fromDate : this.$.toDate;
            if (previousFocus.id === elem.id) {
                return;
            }
            elem.toggleAttribute(selectedAtr);
            previousFocus.removeAttribute(selectedAtr);
            return;
        }
        //eslint-disable-next-line chai-friendly/no-unused-expressions
        this.$.fromDate.hasAttribute(selectedAtr) ? this.$.toDate.toggleAttribute(selectedAtr) : this.$.toDate.removeAttribute(selectedAtr);
        this.$.fromDate.toggleAttribute(selectedAtr);
    }

    __resetCalendar() {
        this.__clearedValue = false;
        this.__isfromDateSelected = false;
        this.toDate = this.__setEmptyFromOrToValue();
        this.fromDate = this.__setEmptyFromOrToValue();
        this.__beingSelected(this.$.fromDate);
    }

    __setEmptyFromOrToValue() {
        return {
            date:  null,
            text:  null,
            index: null
        };
    }
    __setToFromSelectedDate(date, index, from) {
        const selectedDay = this._selectedDay = from
            ? (moment(this._currentDate).date(date)).startOf('day')
            : (moment(this._currentDate).date(date)).endOf('day');
        return {
            date:  selectedDay,
            text:  selectedDay.format(this.dateFormat),
            index: index
        };
    }

    __setSelectedDayInCurrentlyDate() {
        const from = this.fromDate.date;
        const to = this.toDate.date;
        const current = this._currentDate;
        const precision = 'month';

        if (moment(from).isSame(to, 'day') || !from || !to) {
            if (!from && moment(current).isAfter(to, precision) || moment(current).isBefore(from, precision)) {
                this.__setSelectedOrDisabledDays((() => true), {disabled: true});
            } else if (moment(current).isSame(from, precision)) {
                this.__setSelectedOrDisabledDays(((index) => index < this.fromDate.index), {disabled: true});
            } else if (moment(current).isSame(to, precision)) {
                this.__setSelectedOrDisabledDays(((index) => index > this.toDate.index), {disabled: true});
            }
            return;
        }


        if (moment(current).isSame(from, precision) && moment(current).isSame(to, precision)) {
            this.__setSelectedOrDisabledDays(((index) => index >= this.fromDate.index && index <= this.toDate.index), {selected: true});
        } else if (moment(current).isSame(from, precision)) {
            this.__setSelectedOrDisabledDays((index) => index >= this.fromDate.index, {selected: true});
        } else if (moment(current).isSame(to, precision)) {
            this.__setSelectedOrDisabledDays((index) => index <= this.toDate.index, {selected: true});
        } else if (moment(current).isBetween(from, to, precision)) {
            this.__setSelectedOrDisabledDays((() => true), {selected: true});
        }
    }

    __selectCurrentDay(ixNew, ixOld) {
        if (ixOld >= 0) {
            this.set(`_days.${ixOld}.selected`, false);
        }

        this.set(`_days.${ixNew}.selected`, true);
        this._focusedDay = ixNew;

        const date = this._days[ixNew].date;
        this._selectedDay = moment(this._currentDate).date(date);
        this._currentDate.set('date', date);
    }

    __setSelectedToDate(index) {
        this._focusedDay = index;
        const date = this._days[index].date;
        this.__isfromDateSelected = false;
        this.toDate = this.__setToFromSelectedDate(date, index);
        this._currentDate.set('date', date);
    }
    __setSelectedFromDate(index, previousFromDate) {
        this._focusedDay = index;
        const date = this._days[index].date;
        this.__isfromDateSelected = true;
        this.fromDate = this.__setToFromSelectedDate(date, index, true);
        if (!this.toDate.date || previousFromDate) {
            this.__preventCallObserveToDateMethod = true;
            this.toDate = this.__setToFromSelectedDate(date, index);
            this.__preventCallObserveToDateMethod = false;
        }
        this._currentDate.set('date', date);
    }

    __isFromAndToSelected(dateRangeSelectionCalendar, from, to) {
        return dateRangeSelectionCalendar ? (from && to) : true;
    }


    __observeToDate(to) {
        if (!this.dateRangeSelectionCalendar) {
            return;
        }
        const ixOld = this._days.findIndex(item => item.selected);
        if (this.__preventCallObserveToDateMethod || to.index && this.__isfromDateSelected && to.index === ixOld) {
            return;
        }
        // Remove selected days and set disabled days after clearing to date
        if (!to.date && this.fromDate.date) {
            this.__setSelectedOrDisabledDays((index) => index > this.fromDate.index, {selected: false}, {disabled: true});
            this.__setSelectedOrDisabledDays((index) => index === this.fromDate.index, {selected: true});
            return;
        }
        this.__setDefualtCalendarDaysProperties();
        if (to.index === ixOld && !this.__isfromDateSelected) {
            this.__resetCalendar();
            return;
        }
        // Set again selected range after clearing to date
        if (this.__clearedValue) {
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            moment(this.fromDate.date).isSame(this._currentDate, 'month')
                ? this.__setSelectedOrDisabledDays(((index) => index <= to.index && index >= ixOld), {selected: true})
                : this.__setSelectedOrDisabledDays(((index) => index <= to.index), {selected: true});
            this.__clearedValue = false;
            return;
        }
        // Set selected and disabled days before to date
        this.set(`_days.${to.index}.selected`, true);
        this.__setSelectedOrDisabledDays((index) => index >= ixOld && index <= to.index, {selected: true}, {disabled: false});
    }

    __observeFromDate(from) {
        if (!this.dateRangeSelectionCalendar) {
            return;
        }
        const ixOld = this._days.findIndex(item => item.selected);
        // Remove selected days and set disabled days after clearing from date
        if (!from.date && this.toDate.date) {
            this.__setSelectedOrDisabledDays((index) => index < this.toDate.index, {selected: false}, {disabled: true});
            this.__setSelectedOrDisabledDays((index) => index === this.toDate.index, {selected: true});
            return;
        }
        this.__setDefualtCalendarDaysProperties();
        if (!this.toDate.date && !from.date) {
            return;
        }
        // Set again selected range after clearing from date
        if (this.__clearedValue) {
            if (from.index === ixOld) {
                this.__resetCalendar();
                return;
            }
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            moment(this.toDate.date).isSame(this._currentDate, 'month')
                ? this.__setSelectedOrDisabledDays(((index) => index >= from.index && index <= ixOld), {selected: true})
                : this.__setSelectedOrDisabledDays(((index) => index <= from.index), {selected: true});
            this.__isfromDateSelected = false;
            this.__clearedValue = false;
            return;
        }
        // Set selected and disabled days before from date
        this.set(`_days.${from.index}.selected`, true);
        this.__setSelectedOrDisabledDays((index) => index < from.index, {disabled: true});
    }

    __setDefualtCalendarDaysProperties() {
        this.__setSelectedOrDisabledDays(() => true, {disabled: false});
    }

    __setSelectedOrDisabledDays(condition, ifConditionIsMet, ifConditionIsNotMet) {
        if (!this._days.length) {
            return;
        }
        const setDayProperties = (properties, index) => {
            this.set(`_days.${index}.disabled`, properties.disabled ? properties.disabled : false);
            this.set(`_days.${index}.selected`, properties.selected ? properties.selected : false);
        };
        const setDaysInCurrentMonth = (index) => {
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            condition(index)
                ? setDayProperties(ifConditionIsMet, index)
                : ifConditionIsNotMet && setDayProperties(ifConditionIsNotMet, index);
        };
        const setDisabledDaysFromPreviousAndNextMonth = (index) => this.set(`_days.${index}.disabled`, true);

        this._days.forEach((elem, index) => {
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            !this._daysFromPreviousAndNextMonth.includes(index)
                ? setDaysInCurrentMonth(index)
                : setDisabledDaysFromPreviousAndNextMonth(index);
        });
    }

    __findSelectedDateIndex(selectedDate) {
        return this._days.findIndex(day => !day.disabled && day.date === moment(selectedDate).date());
    }

    __setSelectedReceivedRangeDate(date, isFrom) {
        //eslint-disable-next-line chai-friendly/no-unused-expressions
        this[isFrom ? 'fromDate' : 'toDate'].date = date;
        this._currentDate = date;
        this._updateDateTimePicker();
        if (isFrom) {
            this.__setSelectedFromDate(this.__findSelectedDateIndex(date), this.fromDate.date);
        } else {
            this.__setSelectedToDate(this.__findSelectedDateIndex(date));
        }
        //eslint-disable-next-line chai-friendly/no-unused-expressions
        this.__beingSelected(this.$[!isFrom ? 'fromDate' : 'toDate']);
    }

    // END OF RANGE CALENDAR
};

customElements.define(PTCS.DatepickerCalendar.is, PTCS.DatepickerCalendar);

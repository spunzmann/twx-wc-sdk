import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import 'ptcs-hbar/ptcs-hbar.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-textfield/ptcs-textfield.js';
import 'ptcs-dropdown/ptcs-dropdown.js';
import './ptcs-datepicker-calendar.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import './ptcs-datepicker-input-labels.js';
import './moment-import.js';

PTCS.Datepicker = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))))) {
    static get template() {
        return html`
    <style>
      :host {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        align-content: stretch;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }

      :host(:not([label=""])) [part="label"] {
        display: block;
        padding-bottom: 4px;
      }

      [part="label-container"] {
        display: contents;;
      }

      [part="label"] {
        flex: 0 0 auto;
        width: 100%;

        flex-shrink: 0;
      }

      [part="label"][no-label] {
        display: none;
      }

      [part="date-field"],
      [part="date-field-label"] {
        width: 100%;
        height: 100%;
        position: relative;
      }
      [part="date-field"][hidden],
      [part="date-field-label"][hidden] {
          display: none;
      }

      [part="date-field"][disabled] {
        pointer-events: none;
      }

      [part="date-field"][has-text]:not([disabled])::part(clear-button) {
        display: inline-flex;
        overflow: visible;
        }

    </style>

    <div part="label-container">
        <ptcs-label part="label" id="label" label="{{label}}" no-label\$="[[!label]]"
        multi-line="" horizontal-alignment="[[labelAlignment]]" disable-tooltip></ptcs-label>
    </div>
    <ptcs-textfield hidden\$="[[multipleDateSelection]]" icon="page:calendar" part="date-field" id="datetext" text="[[date]]"
    disabled\$="[[disabled]]" hint-text="{{hintText}}" read-only="" display-clear-button-on-readonly="" partmap="* date-field-*"
    tabindex\$="[[_delegatedFocus]]" tooltip="[[tooltip]]" tooltip-icon="[[tooltipIcon]]" being-active\$="[[_opened]]"></ptcs-textfield>
    <ptcs-datepicker-input-labels hidden\$="[[!multipleDateSelection]]" part="date-field-label" id="datelabel"
    tabindex\$="[[_delegatedFocus]]" labels="{{listOfSelectedDates}}" disabled\$="[[disabled]]"
    placeholder="{{hintText}}" being-active\$="[[_opened]]"></ptcs-datepicker-input-labels>`;
    // <ptcs-datepicker-calendar> is added on-demand by _setupCalendar
    }

    static get is() {
        return 'ptcs-datepicker';
    }

    static get properties() {
        return {
            // buttons
            doneLabel: {
                type:  String,
                value: 'Done'
            },

            todayLabel: {
                type:  String,
                value: 'Today'
            },

            // other labels
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

            // Label for datepicker
            label: {
                type:               String,
                value:              '',
                defaultValue:       '',
                reflectToAttribute: true
            },

            labelAlignment: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            // disabled?
            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            // The actual data, as a string
            date: {
                type:               String,
                observer:           '_dateChanged',
                reflectToAttribute: true,
                notify:             true
            },

            // The actual data, as Date object
            dateTime: {
                type:     Date,
                notify:   true,
                observer: '_observeDateTime'
            },

            // The selected date as a moment object
            selectedDate: {
                type:   Object,
                notify: true,
                value:  () => ({})
            },

            // How should selectedDate be formatted?
            _dateFormat: {
                type:     String,
                computed: '_computeDateFormat(_dateOnly, displaySeconds, dateDelimiter, monthFormat, dateOrder, formatToken)',
                observer: '_dateFormatChanged'
            },

            // Hint to date editor
            hintText: {
                type: String,
            },

            // Initialize date with current time?
            initWithCurrentDateTime: {
                type:     Boolean,
                observer: '_initWithCurrentDateTimeChanged'
            },

            // Properties (attributes) that defines _dateFormat
            dateOnly: {
                type: Boolean
            },

            showTime: {
                type:  Boolean,
                value: false // Boolean attributes "must" be false by default
            },

            _dateOnly: {
                type:     Boolean,
                computed: '_computeDateOnly(dateOnly, showTime, dateRangeSelection)'
            },

            displaySeconds: {
                type:  Boolean,
                value: false
            },

            dateDelimiter: {
                type:  String,
                value: '-'
            },

            monthFormat: {
                type:  String,
                value: 'full' // full, short, numeric
            },

            dateOrder: {
                type:  String,
                value: 'YMD' //  auto, YMD, MDY, DMY (auto - is default format)
            },

            // Full override of format
            formatToken: {
                type: String
            },

            // Is calendar open?
            _opened: {
                type:     Boolean,
                value:    false,
                observer: '_openedChanged'
            },

            // The actual calendar (attached to <body>)
            // undefined: not ready to be configured
            // null:      ready to be configured
            __calendarObj: {
                type: HTMLElement
            },

            // First day of week
            weekStart: {
                type:  String,
                value: 'Monday'
            },

            // Create a unique ID (only for testing, I think)
            _calendarId: {
                type: String
            },

            // Type specifier for this.interval
            intervalType: {
                type:  String,
                value: 'h', //  h - Hours, m - Minutes, s - Seconds, d - Days
            },

            interval: {
                type:  Number,
                value: 0,
            },

            // The last interval that was assigned to dateTime
            _intervalOld: {
                type: Object
            },

            yearRange: {
                type:  Number,
                value: 10,
            },

            actionPosition: {
                type:  String,
                value: ''
            },

            dateRangeSelection: {
                type: Boolean
            },

            // This functionality its only for chip-based-date-filter widget
            multipleDateSelection: {
                type:     Boolean,
                value:    false,
                observer: '__observerMultipleDateSelection'
            },

            // FocusBehavior should simulate a click event when space is pressed
            _spaceActivate: {
                type:     Boolean,
                value:    true,
                readOnly: true
            },

            _delegatedFocus: {
                type:  String,
                value: null
            },

            listOfSelectedDates: {
                type:  Array,
                value: () => []
            },

            daysContainingAnyData: {
                type:  Array,
                value: () => []
            },

            showTodayButton: {
                type:  Boolean,
                value: true
            },

            _rangeDate: {
                type:     Object,
                observer: '_observeRangeDate'
            },

            fromDate: {
                type:     Date,
                notify:   true,
                observer: '_observeFromDate'
            },

            toDate: {
                type:     Date,
                notify:   true,
                observer: '_observeToDate'
            },

            fromFieldLabel: {
                type: String
            },

            toFieldLabel: {
                type: String
            },

            fromAndToFieldsHintText: {
                type: String
            },

            invalidDateRangeMessage: {
                type: String
            }

        };
    }

    static get observers() {
        return [
            '_observeInterval(intervalType, interval)',
            '_observeListOfSelectedDates(listOfSelectedDates)',
            '_observeDaysContainingAnyData(daysContainingAnyData)',
            '_observeTodayButtonAndDateRange(showTodayButton, dateRangeSelection)'
        ];
    }

    // Find element in event context
    static _findEl(ev, match) {
        for (let el = ev.srcElement; el; el = el.parentNode) {
            if (match(el)) {
                return el;
            }
        }

        return null;
    }

    ready() {
        super.ready();
        this.tooltipFunc = this._monitorTooltip.bind(this);
        this.$.datetext.tooltipFunc = this.tooltipFunc;

        this._untrackHover(this);
        // Listen to clear button. (TODO: A proper clear event from the text-field)
        requestAnimationFrame(() => {
            this.$[this.multipleDateSelection ? 'datelabel' : 'datetext'].$.clearbutton.addEventListener('click', (e) => {
                this.blur();
                if (this.multipleDateSelection) {
                    this.listOfSelectedDates = [];
                    this.date = '';
                }
                this.dateTime = this.toDate = this.fromDate = null;
                e.stopPropagation();
                requestAnimationFrame(() => {
                    this._tooltipClose();
                    this._tooltipEnter(this.$.datetext, e.clientX, e.clientY, this.tooltipFunc);
                    this._opened = false;
                });
            });
        });

        this.addEventListener('click', () => this._toggleCalendar());
        this._trackHover(this.$.datetext);
        this.__calendarObj = null; // Ready to be assigned
    }

    connectedCallback() {
        super.connectedCallback();

        if (this.__calendarObj) {
            document.body.appendChild(this.__calendarObj);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this.__calendarObj) {
            document.body.removeChild(this.__calendarObj);
        }
    }

    get _calendar() {
        if (this.__calendarObj) {
            // Ready and available
            return this.__calendarObj;
        }
        if (this.__calendarObj === undefined) {
            // Not ready to be created
            return null;
        }
        // Set it up
        this._setupCalendar();
        console.assert(this.__calendarObj);
        return this.__calendarObj;
    }

    // Exception safe
    _protectedCall(blocker, cb) {
        console.assert(!this[blocker]);
        this[blocker] = true;
        try {
            cb();
        } finally {
            this[blocker] = false;
        }
    }

    // Hard assign with no interval adjustment
    _assignDateTime(dateTime) {
        // Prevent interval adjustment of dateTime
        this._protectedCall('__protectDateTime', () => {
            this.dateTime = dateTime;
        });
    }

    _assignRangeDate(date) {
        // Prevent adjustment of range date
        this._protectedCall('__protectFromToDate', () => {
            this.fromDate = date.fromDate.toDate();
            this.toDate = date.toDate.toDate();
        });
        this._rangeDate = date;
    }

    _adjustTime(date, op, arg) {
        switch (arg.intervalType) {
            case 'h': date[op](arg.interval, 'hours'); break;
            case 'm': date[op](arg.interval, 'minutes'); break;
            case 's': date[op](arg.interval, 'seconds'); break;
            case 'd': date[op](arg.interval, 'days'); break;
        }
    }

    _observeDateTime(dateTime, old) {
        if (!dateTime) {
            // No date
            this._protectedCall('__protectDate', () => {
                this.selectedDate = {};
                this.date = '';
            });
            return;
        }
        // eslint-disable-next-line max-len
        if (old && old.dateTime && dateTime.dateTime && dateTime.getTime() === old.getTime() && (this.__protectDateTime || !this.interval)) {
            return; // Unchanged date that should not be interval adjusted
        }
        if (!this.__protectDateTime) {
            // Apply interval to dateTime and store the applied interval
            this._intervalOld = this.interval ? {intervalType: this.intervalType, interval: this.interval} : null;
            if (this._intervalOld) {
                const dateTime2 = moment(dateTime);
                this._adjustTime(dateTime2, 'add', this._intervalOld);
                this._assignDateTime(dateTime2.toDate());
                return; // This callback will be invoked by _assignDateTime, with the updated date
            }
        }

        this._protectedCall('__protectDate', () => {
            this.selectedDate = moment(dateTime);
            const date = this.selectedDate.format(this._dateFormat);
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            this.multipleDateSelection && this.push('listOfSelectedDates', date);
            this.date = date;
        });
    }

    _observeFromDate(from) {
        if (!this.multipleDateSelection && !this.__protectFromToDate) {
            this._rangeDate = {fromDate: from ? moment(from) : from, toDate: moment(this.toDate ? this.toDate : from)};
        }
    }

    _observeToDate(to) {
        if (this.fromDate && !this.multipleDateSelection && !this.__protectFromToDate) {
            this._rangeDate = {fromDate: moment(this.fromDate), toDate: to ? moment(to) : to};
        }
    }

    _observeRangeDate({fromDate, toDate}) {
        this._protectedCall('__protectDate', () => {
            if (this._fromOrToDateIsClearedOrDateRangeIsInvalid(fromDate, toDate)) {
                return;
            }
            const sameDateSelected = moment(fromDate).isSame(toDate, 'day');
            let date;
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            sameDateSelected
                ? date = moment(fromDate).format(this._dateFormat)
                : date = `${fromDate.format(this._dateFormat)} - ${toDate.format(this._dateFormat)}`;

            this.selectedDate = {
                fromDate: sameDateSelected ? fromDate : fromDate,
                toDate:   sameDateSelected ? fromDate : toDate,
            };
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            this.multipleDateSelection && this.push('listOfSelectedDates', date);
            this.date = date;
        });
    }

    _observeTodayButtonAndDateRange(todayButton, dateRange) {
        if (dateRange && todayButton) {
            this.showTodayButton = false;
        }
    }

    _dateChanged(date) {
        if (this.__protectDate) {
            return;
        }

        // Client has changed the date property
        if (typeof date === 'string' && date !== '') {
            let newDate = moment(date, this._dateFormat, true);
            if (!newDate.isValid()) {
                newDate = moment(date);
                if (!newDate.isValid()) {
                    newDate = moment();
                }
            }
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            this.dateRangeSelection ? this.fromDate = newDate.toDate() : this._assignDateTime(newDate.toDate());
        }
    }

    _dateFormatChanged(_dateFormat) {
        if (this.selectedDate && this.selectedDate.isValid && this.selectedDate.isValid()) {
            this._protectedCall('__protectDate', () => {
                this.date = this.selectedDate.format(this._dateFormat);
            });
        }
    }

    _observeInterval(intervalType, interval) {
        if (!this._intervalOld && !interval) {
            return; // Interval has no effect
        }
        if (!this.dateTime) {
            this._intervalOld = null;
            return; // No date to adjust
        }
        const dateTime = moment(this.dateTime);
        if (this._intervalOld) {
            this._adjustTime(dateTime, 'subtract', this._intervalOld);
            this._intervalOld = null;
        }

        // Apply date and get new interval
        this.dateTime = dateTime;
    }

    _observeListOfSelectedDates() {
        // eslint-disable-next-line chai-friendly/no-unused-expressions
        this.multipleDateSelection && requestAnimationFrame(() => {
            this.$.datelabel.$.text_mask_cursor.focus();
        });
    }

    _observeDaysContainingAnyData(newData) {
        if (this._calendar && newData.length) {
            this._calendar.datePresentedByDots = this.__parseArrayStringToArrayDate(newData);
        }
    }

    _computeDateOnly(dateOnly, showTime, dateRangeSelection) {
        //eslint-disable-next-line chai-friendly/no-unused-expressions,no-nested-ternary
        return dateRangeSelection ? dateRangeSelection : (dateOnly !== undefined) ? dateOnly : !showTime;
    }

    _computeDateFormat(_dateOnly, displaySeconds, dateDelimiter, monthFormatSpec, dateOrder, formatToken) {
        if (formatToken) {
            return formatToken; // Explicit formatting
        }

        const _mflc = monthFormatSpec.toLowerCase();
        let monthTemp;
        if (_mflc === 'short') {
            monthTemp = 'MMM';
        } else if (_mflc === 'numeric') {
            monthTemp = 'MM';
        } else {
            monthTemp = 'MMMM';
        }
        //const monthFormat = (_mflc === 'short' ? 'MMM' : _mflc === 'numeric' ? 'MM' : 'MMMM');
        const monthFormat = monthTemp;
        const timeFormat = _dateOnly ? '' : (' HH:mm' + (displaySeconds ? ':ss' : ''));
        let str;

        switch (dateOrder.toUpperCase()) {
            case 'DMY':
                return `DD${dateDelimiter}${monthFormat}${dateDelimiter}YYYY${timeFormat}`;

            case 'MDY':
                return `${monthFormat}${dateDelimiter}DD${dateDelimiter}YYYY${timeFormat}`;

            case 'AUTO':
                if (displaySeconds) {
                    str = ' LTS';
                } else {
                    str = ' LT';
                }
                str = _dateOnly ? '' : str;
                return 'LL' + str;

            //case 'YMD':
            default:
                return `YYYY${dateDelimiter}${monthFormat}${dateDelimiter}DD${timeFormat}`;
        }
    }

    // Automatically assign the selected date to "now"?
    _initWithCurrentDateTimeChanged(initWithCurrentDateTime) {
        if (initWithCurrentDateTime) {
            const today = moment().toDate();
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            this[this.dateRangeSelection ? 'fromDate' : 'dateTime'] = today;
        }
    }

    /*
    <ptcs-datepicker-calendar
        part="calendar"
        hidden\$="[[!_opened]]"  -- assigned by by _openedChanged

        date-time="[[selectedDate]]"
        week-start="[[weekStart]]"
        date-only="[[_dateOnly]]"
        display-seconds="[[displaySeconds]]"
        year-range="[[yearRange]]"
        disabled\$="[[disabled]]"
        done-label="[[doneLabel]]"
        today-label="[[todayLabel]]"
        hours-label="[[hoursLabel]]"
        minutes-label="[[minutesLabel]]"
        seconds-label="[[secondsLabel]]"
        tabindex\$="[[_delegatedFocus]]"
        action-position="[[actionPosition]]"
        date-range-selection-calendar="[[dateRangeSelection]]"
        date-format="[[_dateFormat]]"
        show-today-button="[[showTodayButton]]"
        multiple-date-selection="[[multipleDateSelection]]"

        //
        // I am almost certain that these really should be one-way binding
        //
        from-field-label="{{fromFieldLabel}}"
        to-field-label="{{toFieldLabel}}"
        hint-text="{{fromAndToFieldsHintText}}"

        on-calendar-date-changed="_calendarChanged"
        ></ptcs-datepicker-calendar>
    */
    _setupCalendar() {
        console.assert(!this.__calendarObj);

        // properties in calendar that should be assigned by properties in this
        const toObj = {
            dateTime:                   'selectedDate',
            weekStart:                  'weekStart',
            dateOnly:                   '_dateOnly',
            displaySeconds:             'displaySeconds',
            yearRange:                  'yearRange',
            disabled:                   'disabled',
            doneLabel:                  'doneLabel',
            todayLabel:                 'todayLabel',
            hoursLabel:                 'hoursLabel',
            minutesLabel:               'minutesLabel',
            secondsLabel:               'secondsLabel',
            tabIndex:                   '_delegatedFocus', // tabIndex is the browser property
            actionPosition:             'actionPosition',
            dateRangeSelectionCalendar: 'dateRangeSelection',
            dateFormat:                 '_dateFormat',
            showTodayButton:            'showTodayButton',
            multipleDateSelection:      'multipleDateSelection',
            fromFieldLabel:             'fromFieldLabel',
            toFieldLabel:               'toFieldLabel',
            hintText:                   'fromAndToFieldsHintText'
        };

        // properties in calendar that should assign properties in this
        const fromObj = {
            /* not used - because they are almost certainly incorrecty mapped above
            fromFieldLabel: 'fromFieldLabel',
            toFieldLabel:   'toFieldLabel',
            hintText:       'fromAndToFieldsHintText'
            */
        };

        // Move calendar to <body>
        const calendar = this.__calendarObj = document.createElement('ptcs-datepicker-calendar');
        calendar.setAttribute('hidden', ''); // Always start as hidden
        calendar.setAttribute('part', 'calendar');

        // Output from calendar object
        for (const srcName in fromObj) {
            const dstName = fromObj[srcName];
            calendar.addEventListener(`${window.camelToDashCase(srcName)}-changed`, ev => {
                //console.log(`${window.camelToDashCase(srcName)}-changed: ${JSON.stringify(ev.detail)}`);
                const value = ev.detail.value;
                if (ev.detail.path) {
                    this.notifyPath(ev.detail.path);
                } else if (value && value.indexSplices instanceof Array) {
                    this.notifySplices(dstName, value.indexSplices);
                } else {
                    this[dstName] = value;
                }
            });
        }

        // Input to calendar object
        for (const dstName in toObj) {
            const srcName = toObj[dstName];
            const methodName = `$__${srcName}Changed`;
            this[methodName] = function(value) {
                this.__calendarObj[dstName] = value;
            };
            this._createPropertyObserver(srcName, methodName, false);

            // Initial call, if property already have a value
            if (this[srcName] !== undefined) {
                this[methodName](this[srcName]);
            }
        }

        // Explicit events
        calendar.addEventListener('calendar-date-changed', ev => this._calendarChanged(ev));

        this.setExternalComponentId();

        document.body.appendChild(this.__calendarObj);

        // TODO: this should be handled with a proper ptcs-style-unit
        const dropdowns = calendar.shadowRoot.querySelectorAll('ptcs-dropdown');
        for (const dd of dropdowns) {
            const cdd = document.body.querySelector('#' + dd._listId);
            const cddl = cdd ? cdd.shadowRoot.querySelector('[part=list-container]') : null;
            if (cddl) {
                cddl.style.maxHeight = '221px';
            }
        }

        if (this.daysContainingAnyData && this.daysContainingAnyData.length) {
            calendar.datePresentedByDots = this.__parseArrayStringToArrayDate(this.daysContainingAnyData);
        }
    }

    _toggleCalendar() {
        /*
         * Don't set dateTime just because we open the datepicker
         *
        if (!this.dateTime) {
            this._assignDateTime(moment().toDate());
        }
        */

        if (this.disabled || this.isIDE) {
            return;
        }

        this._opened = !this._opened;
    }

    _getDimension() {
        return {
            // Get window dimension
            windowWidth:  window.innerWidth,
            windowHeight: window.innerHeight,
            // Get current scroll offset
            scrollDx:     document.documentElement.scrollLeft + document.body.scrollLeft,
            scrollDy:     document.documentElement.scrollTop + document.body.scrollTop,
            // Where is the dropdown box?
            box:          this.multipleDateSelection ? this.$.datelabel.getBoundingClientRect() : this.$.datetext.getBoundingClientRect()
        };
    }

    _diffDimension(r1, r2) {
        if (r1.windowWidth !== r2.windowWidth || r1.windowHeight !== r2.windowHeight) {
            return true;
        }
        if (r1.scrollDx !== r2.scrollDx || r1.scrollDy !== r2.scrollDy) {
            return true;
        }
        if (r1.box.top !== r2.box.top || r1.box.bottom !== r2.box.bottom || r1.box.left !== r2.box.left) {
            return true;
        }

        return false;
    }

    _setCalendarPosition(dim) {
        const calendarDim = this._calendar.getBoundingClientRect();
        let x = dim.box.left;
        let y = dim.box.bottom;

        if (x + calendarDim.width > dim.windowWidth) {
            x = dim.windowWidth - calendarDim.width;
        }

        if (x < 0) {
            x = 0;
        }

        if (y + calendarDim.height > dim.windowHeight) {
            y = dim.box.top - calendarDim.height - 6;
        }

        if (y < 0) {
            y = 0;
        }

        // Start at default position
        this._calendar.style.top = (y + dim.scrollDy) + 'px';
        this._calendar.style.left = (x + dim.scrollDx) + 'px';
    }

    // Keep track of calendar position, if the datepicker box is moved or the view is scrolled
    _trackPosition(rOld) {
        if (this._opened) {
            const rNew = this._getDimension();

            /* Do not move the calendar unless the browser window height is greater than the calendar height: Without this
                check, the calendar will "jump" back to the top when user tries to interact with overflowing calendar parts */
            if (rNew.windowHeight > this._calendar.clientHeight) {
                if (this._diffDimension(rOld, rNew)) {
                    this._setCalendarPosition(rNew);
                }
            }

            setTimeout(() => this._trackPosition(rNew), 500);
        }
    }

    _openedChanged(_opened) {
        if (!this._calendar) {
            return;
        }

        if (!_opened) {
            this._calendar.setAttribute('hidden', '');

            if (this.closeEvent) {
                document.removeEventListener('mousedown', this.closeEvent);
                this.closeEvent = null;
            }
            if (this.keydownEvent) {
                this._calendar.removeEventListener('keydown', this.keydownEvent);
                this.keydownEvent = null;
            }
            return;
        }

        this._calendar.removeAttribute('hidden');

        const dim = this._getDimension();

        this._setCalendarPosition(dim);

        requestAnimationFrame(() => {
            if (this._opened) {
                if (!this.closeEvent) {
                    // Close the dropdown if the user clicks anywhere outside of it
                    this.closeEvent = e => {
                        const leaveOpen = e.composedPath().find(el => el.tagName === 'PTCS-DATEPICKER-CALENDAR' ||
                            (el.id && el.id.indexOf('ptcs-dropdown-list') === 0));

                        if (!leaveOpen) {
                            // Clicked outside of calendar
                            this._opened = false;
                        }
                    };
                    // using 'mousedown' here instead of 'click' due to integration problems with MUB
                    document.addEventListener('mousedown', this.closeEvent);
                }
                if (!this.keydownEvent) {
                    // Close the dropdown if the user tabs away from it
                    this.keydownEvent = ev => {
                        if (ev.key !== 'Tab') {
                            return;
                        }
                        const root = this._calendar.shadowRoot;
                        let elem;
                        if (this.dateRangeSelection) {
                            elem = ev.shiftKey
                                ? root.querySelector('[part=date-field]')
                                : root.querySelector('[part=apply-button]');
                        } else {
                            elem = ev.shiftKey
                                ? root.querySelector('[part=prev-month-button]')
                                : root.querySelector('[part=today-button]');
                        }
                        if (root.activeElement === elem) {
                            this.focus();
                            this._opened = false;
                            ev.preventDefault();
                        }
                    };

                    this._calendar.addEventListener('keydown', this.keydownEvent);
                }
                this._trackPosition(dim);
            }
        });

        // TODO: BehaviorFocus
        if (this.multipleDateSelection) {
            this.$.datelabel.$.text_mask_cursor.focus();
            return;
        }
        //eslint-disable-next-line chai-friendly/no-unused-expressions
        this.dateRangeSelection ? this._focusBeingSelectedField() : this._calendar.focus();
    }

    _focusBeingSelectedField() {
        const selectedAtr = 'being-active';
        const calendar$ = this._calendar.$;
        return calendar$.fromDate.hasAttribute(selectedAtr) ? calendar$.fromDate.focus() : calendar$.toDate.focus();
    }

    _calendarChanged(ev) {
        // Copy the new date
        let dispatchDate = ev.detail;

        if (dispatchDate.date) {
            // eslint-disable-next-line chai-friendly/no-unused-expressions
            this.dateRangeSelection
                ? this._assignRangeDate(dispatchDate.date)
                : this._assignDateTime(dispatchDate.date.toDate());
            this.dispatchEvent(new CustomEvent('calendar-date-changed', {
                bubbles:  true,
                composed: true,
                detail:   dispatchDate
            }));
        }

        if (ev.detail.closeCalendar) {
            if (this.multipleDateSelection) {
                requestAnimationFrame(() => {
                    this.$.datelabel.$.text_mask_cursor.focus();
                });
            } else {
                this.focus();
            }
            this._opened = false;
        }
    }

    getExternalComponentId() {
        return this._calendarId;
    }

    /*
     * Sets an id for external component
       NOTE: This is a public method, used e.g. by the widget wrapper. Don't remove
     */
    setExternalComponentId(id) {
        if (id) {
            this._calendarId = id;
        } else if (!this._calendarId) {
            this._calendarId = 'ptcs-datepicker-calendar-' + performance.now().toString().replace('.', '');
        }

        if (this.__calendarObj) {
            this.__calendarObj.setAttribute('id', this._calendarId);
        }
    }

    __parseArrayStringToArrayDate(daysContainingAnyData) {
        if (daysContainingAnyData && Array.isArray(daysContainingAnyData)) {
            return daysContainingAnyData
                .map(day => {
                    const dateOfDay = moment(day).format(this._dateFormat);
                    if (!moment(dateOfDay).isValid()) {
                        console.error(`Incorrect data: ${day}`);
                        return null;
                    }
                    return dateOfDay;
                })
                .filter(day => day);
        }
        return [];
    }

    _fromOrToDateIsClearedOrDateRangeIsInvalid(from, to) {
        if (!from || from && !to) {
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            this.date = from ? moment(from).format(this._dateFormat) : from;
            this.selectedDate = {
                fromDate: from,
                toDate:   from,
            };
            return true;
        }
        // End date is before Start date
        if (moment(to).isBefore(from, 'day')) {
            this.date = this.invalidDateRangeMessage; // TODO: Prepare valid message if from-date is after to-date
            this.selectedDate = {};
            return true;
        }
        return false;
    }
    __observerMultipleDateSelection(isMultipleDateSelectionSelected) {
        //eslint-disable-next-line chai-friendly/no-unused-expressions
        isMultipleDateSelectionSelected && this._setDateLabelFieldKeydownListener();
    }

    _setDateLabelFieldKeydownListener() {
        this.$.datelabel.addEventListener('keydown', (ev) => {
            switch (ev.key) {
                case 'Delete':
                case 'Backspace':
                    if (this.multipleDateSelection && this.listOfSelectedDates.length) {
                        this.listOfSelectedDates = [];
                        this.date = '';
                    }
                    break;
                case 'Tab':
                    if (this._opened) {
                        this._calendar.focus();
                        ev.preventDefault();
                    }
                    break;
                case 'Escape':
                    this._opened = false;
                    break;
            }
            ev.stopPropagation();
        });
    }

    // Implements ptcs-datepickers's tooltip behavior
    _monitorTooltip() {
        // The textfield may display date or hint text
        const el = this.$.datetext;
        // The <input> element
        const inp = el.shadowRoot.querySelector('[part=text-value]');
        let inputW = inp.scrollWidth;
        if (PTCS.isEdge && el.text) {
            /* if el.text is not empty the datepicker contains a date string. Edge doesn't provide true scrollWidth value
               for <input> text so evaluating scrollWidth of a temp <div> styled the same way as <input> */
            const cs = window.getComputedStyle(inp);
            let tmp = document.createElement('div');
            Array.from(cs).forEach(key => tmp.style.setProperty(key, cs.getPropertyValue(key), cs.getPropertyPriority(key)));
            tmp.innerText = el.text;
            // The div needs to be in the DOM in order to get scrollWidth but cannot be displayed as such
            tmp.style.visiblity = 'hidden';
            document.body.appendChild(tmp);
            inputW = tmp.scrollWidth;
            // Remove the temp div
            document.body.removeChild(tmp);
        }
        // Truncated date text to be added to tooltip?
        if (el && el.text && (el.offsetWidth < inputW - 1 || inp.scrollWidth > inp.offsetWidth)) {
            // There is truncation and we are showing a date
            if (!this.tooltip) {
                // We don't have a tooltip, show truncated text
                return el.text;
            } else if (this.tooltip !== el.text) {
                // if tooltip is different from the date textp, show both:
                return el.text + '\n\n' + this.tooltip;
            }
            // Return the truncated date as tooltip
            return el.text;
        }
        if (el && !el.text && el.offsetWidth < el.scrollWidth - 1) {
            // No date, but there is truncation of hint text
            if (!this.tooltip) {
                // No tooltip, return the truncated hint text
                return el.hintText;
            }
            // Return hint text and tooltip
            return el.hintText + '\n\n' + this.tooltip;
        }
        // No truncation overflow
        if (this.tooltip) {
            if (this.tooltip === this.label) {
                // Don't show tooltip if identical to datepicker label
                return '';
            } else if (this.tooltip === this.hintText && el && el.text === '') {
                // Don't show tooltip if identical to hint text being shown
                return '';
            } else if (el && el.text === this.tooltip) {
                // Don't show tooltip if identical to the date being shown
                return '';
            }
        }
        // Return tooltip if any
        return this.tooltip || '';
    }

};

customElements.define(PTCS.Datepicker.is, PTCS.Datepicker);

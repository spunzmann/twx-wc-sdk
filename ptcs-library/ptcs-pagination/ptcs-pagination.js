import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import './components/ptcs-input-number/ptcs-pagination-input-number.js';
import './components/ptcs-pagination-carousel/ptcs-pagination-carousel.js';
import 'ptcs-icon/ptcs-icon.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-dropdown/ptcs-dropdown.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';


const MIN_WIDTH_OF_MEDIUM_SIZE = 445;
const MIN_WIDTH_OF_MAXIMUM_SIZE = {
    oneElement:    555,
    twoElements:   625,
    threeElements: 725,
    allElements:   855
};
PTCS.Pagination = class extends PTCS.BehaviorFocus(PTCS.BehaviorStyleable(
    PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(PolymerElement)))) {

    static get template() {
        return html`
            <style>
                :host {
                    display: flex;
                }
                :host([enable-responsive-behavior]) {
                    flex-wrap: wrap;
                }
                [part="direct-link"] {
                    display: flex;
                    align-items: center;
                }
                [part="page-break-and-total-results-container"] {
                    display: flex;
                    justify-content: flex-end;
                }
                [part="page-break-control"] {
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                }
                [part="page-break-control"][hidden],
                [part="total-results"][hidden],
                [part="direct-link"][hidden] {
                    display: none;
                }
                [part="total-results"] {
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                }
                :host([size=medium]) {
                    justify-content: center;
                }
                :host([size=medium]) [part="carousel"] {
                    width: 100%;
                    order: 1;
                }
                :host([size=medium]) [part="direct-link"] {
                    order: 3;
                }
                :host([size=medium]) [part="page-break-and-total-results-container"] {
                    order: 2;
                }
                :host([size=minimum]) {
                    align-items: center;
                    flex-direction: column;
                }
                :host([size=minimum]) [part="carousel"] {
                    width: 100%;
                    order: 1;
                }
                :host([size=minimum]) [part="page-break-and-total-results-container"] {
                    order: 2;
                }
                :host([size=minimum]) [part="direct-link"] {
                    order: 3;
                }
            </style>
            <div id="page-break-control-and-total-results-container" part="page-break-and-total-results-container">
                <div id="page-break-control" part="page-break-control" hidden\$="[[!showPageBreak]]">
                    <div>
                        <ptcs-label part="string-show-label" id="string-show" label="[[stringShow]]" disable-tooltip></ptcs-label>
                    </div>
                    <ptcs-dropdown
                        tabindex\$="[[_delegatedFocus]]"
                        id="main-drop-down" part="page-results-dropdown"
                        selected-value="[[__getPageSizeStringRepresentation(pageSize)]]"
                        on-selected-value-changed="__handleMainDropDownChange">
                    </ptcs-dropdown>
                </div>
                <div id="total-results" part="total-results" hidden\$="[[!showTotalResults]]">
                    <ptcs-label  part="total-results-label"  disable-tooltip
                    label="[[__getTotalResultsLabel(showPageBreak, totalNumberOfElements)]]"></ptcs-label>
                </div>
            </div>
                <ptcs-pagination-carousel
                    tabindex\$="[[_delegatedFocus]]"
                    id="carousel" part="carousel"
                    current-page="[[pageNumber]]"
                    total-number-of-pages="[[__totalNumberOfPages]]"
                    on-change="__handleCarouselOrInputNumberChange">
                </ptcs-pagination-carousel>
                <div id="direct-link" part="direct-link" hidden\$="[[!showDirectLink]]">
                    <ptcs-label part="string-jump-to-label" id="string-jump-to" label="[[stringJumpToPage]]: " disable-tooltip></ptcs-label>
                    <ptcs-pagination-input-number
                    tabindex\$="[[_delegatedFocus]]"
                    id='input-number' part="input-number"
                    on-value-approved="__handleCarouselOrInputNumberChange"
                    total-number-of-pages="[[__totalNumberOfPages]]"
                    error-message="[[stringMax]]">
                </ptcs-pagination-input-number>
            </div>
        `;
    }
    static get properties() {
        return {
            pageNumber: {
                type:     Number,
                notify:   true,
                readOnly: true,
                value:    1
            },
            pageSize: {
                type:   Number,
                value:  1,
                notify: true
            },
            __pageBreaks: {
                type:     Array,
                computed: '__parseObjectToArray(firstBreak, secondBreak, thirdBreak, fourthBreak, fifthBreak)',
                observer: '__setItemsInDropdown'
            },
            // PageBreaks
            firstBreak: {
                type:  Number,
                value: 10
            },
            secondBreak: {
                type:  Number,
                value: 25
            },
            thirdBreak: {
                type:  Number,
                value: 50
            },
            fourthBreak: {
                type:  Number,
                value: 75
            },
            fifthBreak: {
                type:  Number,
                value: 100
            },
            totalNumberOfElements: {
                type: Number
            },
            showPageBreak: {
                type:  Boolean,
                value: false
            },
            showTotalResults: {
                type:  Boolean,
                value: false
            },
            showDirectLink: {
                type:  Boolean,
                value: false
            },
            __numberOfEnabledElements: {
                type:     Number,
                computed: '__getNumberOfEnabledElements(showPageBreak, showTotalResults, showDirectLink)',
                observer: '__setSizeOfComponent'
            },
            stringOf: {
                type:  String,
                value: 'of'
            },
            stringShow: {
                type:  String,
                value: 'Show'
            },
            stringResults: {
                type:  String,
                value: 'Results'
            },
            stringJumpToPage: {
                type:  String,
                value: 'Jump to page'
            },
            stringMax: {
                type:  String,
                value: 'Max'
            },
            _delegatedFocus: {
                type:  String,
                value: null
            },
            // Allows to disable the different arrangement of pagination components relative to the container size
            enableResponsiveBehavior: {
                type:               Boolean,
                value:              true,
                reflectToAttribute: true,
                observer:           '__enableResponsiveBehavior'
            }
        };
    }
    static get observers() {
        return [
            '__handleTotalNumberOfElementsOrPageSizeChange(pageSize, totalNumberOfElements)'
        ];
    }
    static get is() {
        return 'ptcs-pagination';
    }
    constructor() {
        super();
        this.__totalNumberOfPages = 1;
        // https://github.com/ag-grid/ag-grid/issues/2588
        const debouncedSetSizeOfComponent = this.__setDebounce(this.__setSizeOfComponent);
        this.__containerResizeObserver = new ResizeObserver(debouncedSetSizeOfComponent);
    }
    connectedCallback() {
        super.connectedCallback();
        this.__enableResponsiveBehavior(this.enableResponsiveBehavior);
    }

    disconnectedCallback() {
        this.__containerResizeObserver.unobserve(this);
        super.disconnectedCallback();
    }
    __handleCarouselOrInputNumberChange(event) {
        const pageNo = event.detail.pageNo;

        this._setPageNumber(pageNo);
        event.stopPropagation();
    }
    __handleTotalNumberOfElementsOrPageSizeChange() {
        if (this.pageSize > 0 && this.totalNumberOfElements > 0) {
            this.__totalNumberOfPages = Math.ceil(this.totalNumberOfElements / this.pageSize);
        } else {
            this.__totalNumberOfPages = 1;
        }
        if (this.__totalNumberOfPages < this.$['input-number'].value) {
            this.$['input-number'].reset();
        }
    }
    /*
        main-drop-down index change might happen when:
        1. User itself hase selected an item
        2. pageBreak param has been updated
    */
    __handleMainDropDownChange() {
        const mainDropDownSelectedItem = this.$['main-drop-down'].selectedValue;
        if (mainDropDownSelectedItem !== undefined) {
            this.pageSize = Number(mainDropDownSelectedItem);
        }
    }

    __getPageSizeStringRepresentation(pageSize) {
        return pageSize.toString();
    }

    __setItemsInDropdown(pageBreak) {
        this.$['main-drop-down'].items = pageBreak.slice();
    }

    __setSizeOfComponent() {
        if (!this.enableResponsiveBehavior) {
            return;
        }
        // Responsitivity depending on the number of visible elements
        const minWidthOfMaximumSize = Object.values(MIN_WIDTH_OF_MAXIMUM_SIZE)[this.__numberOfEnabledElements];

        this.$.carousel.minSize = this.offsetWidth < MIN_WIDTH_OF_MEDIUM_SIZE;
        if (this.offsetWidth < MIN_WIDTH_OF_MEDIUM_SIZE) {
            this.setAttribute('size', 'minimum');
            return;
        }
        if (this.offsetWidth > MIN_WIDTH_OF_MEDIUM_SIZE && this.offsetWidth < minWidthOfMaximumSize) {
            this.setAttribute('size', 'medium');
            return;
        }
        this.setAttribute('size', 'maximum');
    }

    __parseObjectToArray(...pageBreaks) {
        return [...new Set(Object.values(pageBreaks).filter(elem => elem))];
    }

    __getTotalResultsLabel(showPageBreak) {
        const result = this.stringResults.toLowerCase();
        if (!showPageBreak) {
            return `${this.totalNumberOfElements} ${result}`;
        }
        return `${this.stringOf} ${this.totalNumberOfElements} ${result}`;
    }

    __getNumberOfEnabledElements(...elements) {
        return elements.filter(elem => elem).length;
    }

    __setDebounce(func, wait) {
        let timeout, result;
        const later = function(context, args) {
            timeout = null;
            if (args) {
                result = func.apply(context, args);
            }
        };
        const delay = function(...args) {
            return setTimeout(function() {
                return later.apply(null, args);
            }, wait);
        };
        const debounced = () => {
            //eslint-disable-next-line chai-friendly/no-unused-expressions
            timeout && clearTimeout(timeout);
            timeout = delay(this, arguments);
            return result;
        };
        return debounced;
    }

    __enableResponsiveBehavior(allow) {
        this.removeAttribute('size');
        this.__containerResizeObserver.unobserve(this);
        if (allow) {
            // When the observation starts, the '__setSizeOfComponent' method is executed which sets the 'size' attribute
            this.__containerResizeObserver.observe(this);
        }
    }
};

customElements.define(PTCS.Pagination.is, PTCS.Pagination);

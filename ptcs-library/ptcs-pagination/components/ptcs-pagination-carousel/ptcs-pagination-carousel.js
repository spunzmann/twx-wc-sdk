import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-icons/page-icons.js';
import 'ptcs-label/ptcs-label.js';


const MIN_NEIGHBOUR_NO = 1;
const MAX_NEIGHBOUR_NO = 4;
//conceptual solution to match the container to the font size
const SCALE_SIZE_OF_PAGE_BUTTON = {
    micro:  2.43,
    small:  2.86,
    medium: 3.43,
    big:    4
};
PTCS.Carousel = class extends PTCS.BehaviorFocus(PTCS.BehaviorStyleable(PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(PolymerElement)))) {
    static get is() {
        return 'ptcs-pagination-carousel';
    }
    static get properties() {
        return {
            currentPage: {
                type: Number
            },
            minSize: {
                type:     Boolean,
                observer: '__handleMinSizeChange'
            },
            totalNumberOfPages: {
                type:     Number,
                value:    1,
                observer: '__handleTotalNumberOfPagesChange'
            },
            _delegatedFocus: {
                type:  String,
                value: null
            },
        };
    }
    static get template() {
        return html`
            <style>
                :host {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                [hidden] {
                    display: none;
                }
            </style>
            <ptcs-button part="left-arrow" on-click="__handleClickOnArrow" variant="small" icon="page:chevron-left" content-align="center" mode="icon"
                id="left-arrow" tabindex\$="[[_delegatedFocus]]">
            </ptcs-button>
            <template is="dom-repeat" items="[[__getItems(__currentPage, totalNumberOfPages, __neighbourNumber, __pivot)]]" as="item"
                on-dom-change="__markEdgeValues">
                <ptcs-label id="three-dots" part="three-dots" label="[[item.value]]" hidden\$="[[!__areThreeDots(item)]]"></ptcs-label>
                <ptcs-button id="page-number-button" part="page-number-button" tabindex\$="[[_delegatedFocus]]"
                style$="width: [[__getButtonSize(item)]]px" variant="transparent"
                hidden\$="[[__areThreeDots(item)]]" on-click="__handleClickOnNumber"
                label="[[item.value]]" data-label\$="[[item.value]]" selected\$="[[__isSelected(item)]]">
                </ptcs-button>
            </template>
            <ptcs-button part="right-arrow" on-click="__handleClickOnArrow" variant="small" icon="page:chevron-right"
            content-align="center" mode="icon" id="right-arrow" tabindex\$="[[_delegatedFocus]]">
            </ptcs-button>
            `;
    }
    static get observers() {
        return [
            '__handleArrowAppearance(totalNumberOfPages, __currentPage)',
            '__emmitChangeEvent(__currentPage)'
        ];
    }
    constructor() {
        super();
        this.__currentPage = 1;
        this.__pivot = 1; // the axis around which the button list is generated
        this.__doesItGoRight = true; // affects the position of ellipsis -> 1 2 3 4 5 ... 100, if false then 1 ... 96 97 98 99 100
        this.__neighbourNumber = MAX_NEIGHBOUR_NO; // number of buttons arround the piviot before ellipsis
        this.__muteChangeEvent = true;
    }
    ready() {
        super.ready();
        this.__muteChangeEvent = false;
    }
    set currentPage(newPageNo) {
        newPageNo = Number(newPageNo);
        if (this.totalNumberOfPages >= newPageNo && newPageNo > 0) {
            this.__updateDirection(newPageNo);
            this.__currentPage = this.__pivot = newPageNo;
        } else {
            console.error('Cannot set the new pivot. Enter a number from the desired currNeighboursNo.');
        }
    }
    get currentPage() {
        return this.__currentPage;
    }
    __handleMinSizeChange(value) {
        this.__pivot = this.__currentPage;
        this.__neighbourNumber = value ? MIN_NEIGHBOUR_NO : MAX_NEIGHBOUR_NO;
    }
    __isSelected(item) {
        return Number(item.value) === this.__currentPage;
    }
    __updateDirection(pageNo) {
        if (pageNo === 1) {
            this.__doesItGoRight = true;
            return;
        }
        if (pageNo === this.totalNumberOfPages) {
            this.__doesItGoRight = false;
        }
    }
    /* Examples:
        1 2 3 4 5 ... 121 -> edge values are: 1 & 5 & 121
        1 ... 34 35 36 37 38 -> edge values are 1 & 34 & 38
        1 2 3 4 5 6 7 // edge values are 1 & 7
    */
    __markEdgeValues() {
        const buttons = Array.from(this.shadowRoot.querySelectorAll('ptcs-button[part="page-number-button"]:not([hidden])'));
        if (buttons.length === 0) {
            return;
        }
        buttons.forEach(button => button.removeAttribute('data-edge'));

        buttons[0].setAttribute('data-edge', '');
        buttons[buttons.length - 1].setAttribute('data-edge', '');
        buttons.forEach((button, index) => {
            if (buttons[index + 1] && Number(buttons[index + 1].label) - Number(buttons[index].label) !== 1) {
                buttons[index].setAttribute('data-edge', '');
                buttons[index + 1].setAttribute('data-edge', '');
            }
        });
    }
    __areThreeDots(label) {
        return label.value === '...';
    }
    __handleArrowAppearance() {
        this.$['left-arrow'].disabled = this.totalNumberOfPages < 1 || this.__currentPage === 1;
        this.$['right-arrow'].disabled = this.totalNumberOfPages < 1 || this.__currentPage === this.totalNumberOfPages;
    }
    __handleClickOnNumber(event) {
        const clickedButton = event.target;
        const clickedNumber = Number(clickedButton.label);

        this.__updateDirection(clickedNumber);
        if (clickedButton.hasAttribute('data-edge')) {
            this.__pivot = clickedNumber;
        }
        this.__currentPage = clickedNumber;
    }
    __handleClickOnArrow(event) {
        /* eslint-disable chai-friendly/no-unused-expressions */
        const arrowId = event.target.id;
        const canGoLeft = arrowId === 'left-arrow' && this.__currentPage > 1;
        const canGoRight = arrowId === 'right-arrow' && this.__currentPage < this.totalNumberOfPages;

        if (canGoLeft || canGoRight) {
            let tempCurrentPage = this.__currentPage;
            canGoLeft && tempCurrentPage--;
            canGoRight && tempCurrentPage++;

            this.__updateDirection(tempCurrentPage);
            const theNewPageButton = this.shadowRoot.querySelector(`[data-label="${tempCurrentPage}"]`);
            (theNewPageButton === null || theNewPageButton.hasAttribute('data-edge')) && (this.__pivot = tempCurrentPage);
            this.__currentPage = tempCurrentPage;
        }
        /* eslint-enable chai-friendly/no-unused-expressions */
    }
    __emmitChangeEvent() {
        if (!this.__muteChangeEvent) {
            this.dispatchEvent(new CustomEvent('change', {
                bubbles:  true,
                composed: true,
                detail:   {
                    pageNo: this.__currentPage
                }
            }));
        }
    }
    __getNeighbours(buttonArray) {
        if (this.totalNumberOfPages < 1) {
            return;
        }
        let leftPointerIdx = this.__pivot, rightPointerIdx = this.__pivot;
        let isLeftPtrNotBlocked = true, isRightPtrNotBlocked = true;
        let currNeighboursNo = 0;
        const totalNumberOfPages = this.totalNumberOfPages;
        const neighbourNumber = this.__neighbourNumber;

        function findNeighbourOnTheRigthSide() {
            if (currNeighboursNo < neighbourNumber && isRightPtrNotBlocked && rightPointerIdx + 1 >= 1 && rightPointerIdx + 1 <= totalNumberOfPages) {
                rightPointerIdx++;
                currNeighboursNo++;
            } else {
                isRightPtrNotBlocked = false;
            }
        }
        function findNeighbourOnTheLeftSide() {
            if (currNeighboursNo < neighbourNumber && isLeftPtrNotBlocked && leftPointerIdx - 1 >= 1 && leftPointerIdx - 1 <= totalNumberOfPages) {
                leftPointerIdx--;
                currNeighboursNo++;
            } else {
                isLeftPtrNotBlocked = false;
            }
        }
        while (currNeighboursNo < neighbourNumber && (isLeftPtrNotBlocked || isRightPtrNotBlocked)) {
            if (this.__doesItGoRight) {
                findNeighbourOnTheRigthSide();
                findNeighbourOnTheLeftSide();
            } else {
                findNeighbourOnTheLeftSide();
                findNeighbourOnTheRigthSide();
            }
        }

        for (let i = 0; i < rightPointerIdx - leftPointerIdx + 1; ++i) {
            buttonArray[i] = {value: leftPointerIdx + i};
        }
        // UX requirement
        // remove one element if there are at least 2 elements and all button labels are > 10000
        if (this.__neighbourNumber > 1) {
            const areAllElementsGreaterThan9999 = buttonArray.every(el => el.value > 9999);
            if (areAllElementsGreaterThan9999) {
                buttonArray.shift();
            }
        }
    }
    /*
        the function returns variable number of items, it computes their number based on digit number, e.g.
            x there are 4 items if all (on the opposite side of '...') of them have 5 digits
                11234, 11235, 11236, 11237 ... 11545
                1 ... 11234, 11235, 11236, 11237
                12222, 12223, 12224, 12225 ... 12256
            x there are 5 items if at least one item (on the opposite side of '...') has less than 4 digits
                123, 124, 125, 126, 127 ... 1500
                1 ... 123 124 125 126 127
                998, 999, 1000, 1001, 1002 ... 12000
    */
    __getItems() {
        if (this.__pivot === undefined) {
            return [];
        }

        const buttonArray = []; // the array that represents the button values
        this.__getNeighbours(buttonArray);
        this.__addRemainingElements(buttonArray);
        return buttonArray;
    }
    __getButtonSize(label) {
        const clickedButtonNumber = Number(label.value);
        const fontSizeOfButton = this.shadowRoot.querySelector('[part="page-number-button"]');
        if (!isNaN(clickedButtonNumber) && fontSizeOfButton) {
            //conceptual solution to match the container to the font size
            const buttonLabel = fontSizeOfButton.shadowRoot.querySelector('[part=label]');
            const computedFontSize = Number(window.getComputedStyle(buttonLabel).fontSize.slice(0, -2));

            if (clickedButtonNumber < 100) {
                return computedFontSize * SCALE_SIZE_OF_PAGE_BUTTON.micro;
            }
            if (clickedButtonNumber < 1000) {
                return computedFontSize * SCALE_SIZE_OF_PAGE_BUTTON.small;
            }
            if (clickedButtonNumber < 10000) {
                return computedFontSize * SCALE_SIZE_OF_PAGE_BUTTON.medium;
            }
            return computedFontSize * SCALE_SIZE_OF_PAGE_BUTTON.big;
        }
        return '';
        // if (!isNaN(clickedButtonNumber)) {
        //     if (clickedButtonNumber < 100) {
        //         return 'microSize';
        //     }
        //     if (clickedButtonNumber < 1000) {
        //         return 'smallSize';
        //     }
        //     if (clickedButtonNumber < 10000) {
        //         return 'mediumSize';
        //     }
        //     return 'bigSize';
        // }
        // return '';
    }
    __handleTotalNumberOfPagesChange() {
        if (!Number.isInteger(this.totalNumberOfPages) || this.totalNumberOfPages < 1) {
            console.error('Incorrect value of total number of pages');
            this.__doesItGoRight = true;
            this.__currentPage = this.__pivot = 1;
            return;
        }
        if (this.__currentPage > this.totalNumberOfPages || this.totalNumberOfPages < this.__pivot) {
            this.__doesItGoRight = true;
            this.__currentPage = this.__pivot = 1;
            return;
        }
        this.__pivot = this.__currentPage;
    }
    __addRemainingElements(buttonArray) {
        if (buttonArray.length === 0) {
            return;
        }
        if (this.__doesItGoRight) {
            const lastButtonLabel = buttonArray[buttonArray.length - 1].value;
            if (lastButtonLabel + 1 === this.totalNumberOfPages) {
                buttonArray.push({value: this.totalNumberOfPages}); // instead of 3 dots
                return;
            }
            if (lastButtonLabel + 2 === this.totalNumberOfPages) {
                buttonArray.push({value: this.totalNumberOfPages - 1}); // instead of 3 dots
                buttonArray.push({value: this.totalNumberOfPages});
                return;
            }
            if (lastButtonLabel !== this.totalNumberOfPages) {
                buttonArray.push({value: '...'});
                buttonArray.push({value: this.totalNumberOfPages});
            }
        } else {
            if (buttonArray[0].value === 2) {
                buttonArray.unshift({value: 1}); // instead of 3 dots
                return;
            }
            if (buttonArray[0].value === 3) {
                buttonArray.unshift({value: 2}); // instead of 3 dots
                buttonArray.unshift({value: 1});
                return;
            }
            if (buttonArray[0].value !== 1) {
                buttonArray.unshift({value: '...'});
                buttonArray.unshift({value: 1});
            }
        }
    }
};
customElements.define(PTCS.Carousel.is, PTCS.Carousel);

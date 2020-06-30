import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

import './ptcs-chip-data-filter-chip-child.js';

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';

const partialWidthOfChipsFromStartToRefChip = (chipChildNodeList, refChip) => {
    let partialSum = 0;
    let refChipId = refChip.getAttribute('data-id');
    Array.prototype.some.call(chipChildNodeList, (chip, chipIndex) => {
        let chipWidth = chip.offsetWidth;
        partialSum += chipWidth;
        if (chip.getAttribute('data-id') === refChipId) {
            return true;
        }
        return false;
    });
    return partialSum;
};

class PTCSchipDataFilterChipContainer extends PTCS.BehaviorFocus(
    PTCS.ShadowPart.ShadowPartMixin(PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement)))) {
    static get is() {
        return 'ptcs-chip-data-filter-chip-container';
    }
    static get template() {
        return html`
            <style>
               :host {
                   display: block;
                }
                [part="container"] {
                    display: flex;
                    flex-wrap: wrap;
                    padding-top: 1em;
                }
                [part="less-more-button"] {
                    flex-shrink: 0; /* prevents from wrapping */
                }
                [part="less-more-button"]:hover {
                    cursor: pointer;
                }
                .display-none {
                    display: none;
                }
            </style>
            <div class="font-spec" id="container" part="container">
                <template is="dom-repeat" items="[[data]]" on-dom-change="__setVisibilityOfChipsAndLessMoreButton">
                    <ptcs-chip-data-filter-chip-child part="chip-child" content="[[item.content]]" 
                     data-id\$="[[item.id]]" field-name\$="[[item.fieldName]]"></ptcs-chip-data-filter-chip-child>
                </template>
                <div id="less-more-button" part="less-more-button" on-click="__handleShowLessButtonClick">
                    [[__getLessMoreButtonText(expanded, dictionary.stringShowMore, dictionary.stringShowLess)]]
                </div>
            </div>
        `;
    }
    static get properties() {
        return {
            dictionary: {
                type: Object
            },
            data: {
                type:  Array,
                value: () => []
            },
            expanded: {
                type:               Boolean,
                reflectToAttribute: true,
                value:              false,
                observer:           '__setVisibilityOfChipsAndLessMoreButton'
            }
        };
    }
    ready() {
        super.ready();

        this.__containerResizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => this.__setVisibilityOfChipsAndLessMoreButton());
        });
    }
    connectedCallback() {
        super.connectedCallback();
        this.__containerResizeObserver.observe(this.$.container);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.__containerResizeObserver.unobserve(this.$.container);
    }
    __setVisibilityOfChipsAndLessMoreButton() {
        const wasAtLeastOneChipNotDisplayedInOneLine = this.__setChipVisibility();
        if (!wasAtLeastOneChipNotDisplayedInOneLine) {
            this.$['less-more-button'].classList.add('display-none');
        }
    }
    __isChipVisibileIntoOneLine(chip, isLastChip) {
        const containerWidth = this.$.container.clientWidth;
        const chipChildNodeList = this.shadowRoot.querySelectorAll('ptcs-chip-data-filter-chip-child');

        chip.classList.remove('display-none');
        const partialWidthOfChips = partialWidthOfChipsFromStartToRefChip(chipChildNodeList, chip);
        const lessMoreButtonWidth = this.$['less-more-button'].offsetWidth;
        if (partialWidthOfChips + lessMoreButtonWidth <= containerWidth ||
            partialWidthOfChips <= containerWidth && isLastChip) {
            return true;
        }
        return false;
    }
    __setChipVisibility() {
        this.$['less-more-button'].classList.remove('display-none');
        /*
            In the application of chip container with chip based filter widget, if its width is not set, i.e. it is automtic
            (comes from the width of its inernal childs) then, it is helpfpul to hide all chips first. Thanks to the above,
            it is possible to determine the better position of 'Show more/less' button.
        */
        const chipChildNodeList = this.shadowRoot.querySelectorAll('ptcs-chip-data-filter-chip-child');
        Array.prototype.forEach.call(chipChildNodeList, chip => chip.classList.add('display-none'));
        let wasAtLeastOneChipNotDisplayedInOneLine = false;
        Array.prototype.forEach.call(chipChildNodeList, (chip, chipIndex, chipArray) => {
            if (wasAtLeastOneChipNotDisplayedInOneLine && !this.expanded) {
                return;
            }
            let isLastChip = chipArray.length - 1 === chipIndex;
            if (!this.__isChipVisibileIntoOneLine(chip, isLastChip)) {
                wasAtLeastOneChipNotDisplayedInOneLine = true;
                chip.classList.toggle('display-none', !this.expanded);
            }
        });
        return wasAtLeastOneChipNotDisplayedInOneLine;
    }
    __getLessMoreButtonText() {
        return this.dictionary && (this.expanded ? this.dictionary.stringShowLess : this.dictionary.stringShowMore);
    }
    __handleShowLessButtonClick() {
        this.expanded = !this.expanded;
    }
}
customElements.define(PTCSchipDataFilterChipContainer.is, PTCSchipDataFilterChipContainer);

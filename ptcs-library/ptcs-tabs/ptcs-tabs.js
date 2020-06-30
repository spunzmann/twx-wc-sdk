import {html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import {TabsElement} from '@vaadin/vaadin-tabs/src/vaadin-tabs.js';
import 'ptcs-dropdown/ptcs-dropdown.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="ptcs-tabs-default-theme" theme-for="vaadin-tabs ptcs-tabs">
  <template>
    <style>

      [part=tabs-list] {
        width: auto;
      }

      :host {
        -webkit-tap-highlight-color: transparent;
      }

      :host([orientation="horizontal"]) {
        min-height: 34px;
        line-height: initial;
      }

      [part="tabs"] ::slotted(ptcs-tab) {
        white-space: nowrap;
        color: var(--theme-color-mid-01, #80858E);
        border-color: var(--theme-color-light-01, #D8DBDE);
        border-width: 2px;
        font-size: 16px;
        text-align: left;
      }

      :host(:not([disabled])) [part="tabs"] ::slotted(ptcs-tab) {
        cursor: pointer;
      }

      :host [part="tabs"] ::slotted(ptcs-tab:hover) {
        color: var(--theme-color-dark-01, #232b2d);
      }

      /* Horizontal tabs styles */
      /* Firefox requires the extra [part="tabs"] before the ::slotted */
      :host([orientation="horizontal"]) [part="tabs"] ::slotted(ptcs-tab) {
        display: flex;
        justify-content: center;
        border-bottom: 2px solid transparent;
        position: relative;
        z-index: 11;
        padding: 0px;
        margin-left: 24px;
        margin-right: 24px;
        font-weight: normal;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      :host([orientation="horizontal"]) [part="tabs"] ::slotted(ptcs-tab:first-of-type) {
        margin-left: 0px;
      }

      :host([orientation="horizontal"]) [part="tabs"] ::slotted(ptcs-tab:last-of-type) {
        margin-right: 0px;
      }

      :host([orientation="horizontal"]) [part="tabs"] ::slotted(ptcs-tab[selected]) {
        color: var(--theme-color-dark-01, #232b2d);;
        border-color: var(--theme-color-primary-mid-01, #0094C8);
        font-weight: 600;
        z-index: 13;
      }

      /* Vertical tab styles */
      /* Per design system, vertical is not supported - should we turn this off somehow? */
      :host([orientation="vertical"]) [part="tabs"] ::slotted(ptcs-tab) {
        border-left: 2px solid transparent;
      }

      :host([orientation="vertical"]) [part="tabs"] ::slotted(ptcs-tab[selected]) {
        border-left-color: currentColor;
      }

      :host [part="back-button"],
      :host [part="forward-button"] {
        align-items: stretch;
        cursor: pointer;
        padding: 8px;
        pointer-events: initial;
      }

      :host([disabled]) [part="back-button"],
      :host([disabled]) [part="forward-button"] {
        cursor: default;
        pointer-events: none;
      }

      :host [part="back-button"]:after,
      :host [part="forward-button"]:after {
        content: 	'';
      }

      :host [part="tabs-list"] {
        opacity:0;
        visibility: hidden;
        z-index: 12;
      }

      :host([overflow]) [part="tabs-list"] {
        opacity: 1;
        visibility: visible;
      }

      :host [part="back-button"],
      :host [part="forward-button"] {
        display: flex;
        flex: 0 0 auto;
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
let template = null;

PTCS.Tabs = class extends PTCS.BehaviorStyleable(PTCS.ShadowPart.ShadowPartMixin(TabsElement)) {
    static get is() {
        return 'ptcs-tabs';
    }

    // Style back and foward buttons as chevrons, and add tabs dropdown list
    static get template() {
        if (template) {
            return template;
        }
        let stemplate = super.template.cloneNode(true);

        let fbutton = document.createElement('ptcs-button');
        fbutton.setAttribute('direction', 'right');
        fbutton.setAttribute('icon', 'chevron-right');
        fbutton.setAttribute('variant', 'small');
        fbutton.setAttribute('part', 'forward-ptcsbutton');
        fbutton.setAttribute('disabled', '[[disabled]]');
        stemplate.content.querySelector('[part="forward-button"]').appendChild(fbutton);

        let bbutton = document.createElement('ptcs-button');
        bbutton.setAttribute('direction', 'left');
        bbutton.setAttribute('icon', 'chevron-left');
        bbutton.setAttribute('variant', 'small');
        bbutton.setAttribute('part', 'back-ptcsbutton');
        bbutton.setAttribute('disabled', '[[disabled]]');
        stemplate.content.querySelector('[part="back-button"]').appendChild(bbutton);

        template = html`
      ${stemplate}
      <ptcs-dropdown id="tabslist" part="tabs-list" partmap="* tabs-list-*" display-mode="small"
      items="[[nameItems]]" disabled="[[disabled]]" state-selector="[[_itemStateSelector]]"
      selector="name" value-selector="value" selected-value="[[selectedValue]]" on-selected-indexes-changed="handleTabsList"
      value-hide="true" disable-no-item-selection></ptcs-dropdown>
      `;

        return template;
    }

    static get properties() {
        return {
            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },
            nameItems: {
                type:  Array,
                value: () => []
            },
            selected: {
                type:     Number,
                value:    0,
                observer: '_handleTabsDropdownSync'
            },
            selectedValue: {
                type: String
            }
        };
    }

    _itemStateSelector(item) {
        if (!item) {
            return undefined;
        }

        if (typeof item.visible !== undefined && item.visible === false) {
            return 'hidden';
        } else if (item.disabled) {
            return 'disabled';
        }

        return undefined;
    }

    // Keep selected tab in sync with the dropdown
    _handleTabsDropdownSync(selected) {
        if (this.nameItems && selected !== undefined && this.nameItems[selected] !== undefined) {
            this.selectedValue = this.nameItems[selected].value;
        }
    }

    // Keep selected item in dropdown list in sync with selected tab
    handleTabsList(event) {

        if (this.disabled) {
            return;
        }

        let selectedCandidate = event.detail.value[0];
        if (selectedCandidate !== undefined && this.items && this.items[selectedCandidate] && !this.items[selectedCandidate].disabled) {
            this.selected = selectedCandidate;
        } else {
            requestAnimationFrame(() => this._handleTabsDropdownSync(this.selected));
        }
    }

    /**
   * Override because a single tab with a long name should have ellipsis and we don't wantto show partially visible tabs
   *
   */
    _updateOverflow() {
    // TW-52587: Buttons should be visible in disabled mode too
    //if (this.disabled) {
    //  return;
    //}

        super._updateOverflow();

        let width = this.innerWidth || this.scrollWidth; // try to get parent (tabs element width)
        if (width && this.items && this.items.length > 0) {
            this._setMaxWidth();

            if (this.bScrollAllowed === undefined) {
                this.bScrollAllowed = true; // at init state this function will be called twice.
                // ignore first call since styles aren't ready yet (MB support)
                return;
            }

            // if we are first time calculalting truncation - we need to re-call _scrollTo function
            if (this.selected !== undefined && this.selected !== -1 && this.selected < this.items.length &&
          this.items[this.selected].isVisible === undefined) {
                this._scrollToItem(this.selected); // in case selected was set before tab sizes/visibility was set
            }
        }
    }

    /**
   * mark items as visible/not-visible on current view
   */
    _calculateVisibility() {
        if (!this.items || this.items.length === 0 || !this.bScrollAllowed) {
            return false;
        }

        // limit tabs to max size of visible area and get bounding box of visible area
        let scrollBoundingBox = this._setMaxWidth();
        // enlarge borders by 1 pixel (to fix double -> int conversion)
        scrollBoundingBox.left -= 1;
        scrollBoundingBox.right += 1;
        // debug       console.log('tabs: _updateOverflow: scrollBoundingBox: ', scrollBoundingBox);

        let tab = null;
        let tabBoundingBox = null;

        // sometimes (especially after resize) we don't fully show both - leftmost and rightmost tabs
        // and in case we have only 2 visible tabs - they both marked as non-visible
        // bNoVisibleItemsFound and maxNumberOfTries helps us to fix the state.
        // In case no fully visible items detected - we scroll left till the beginning and retry calculation
        // In case it doesn't help - we set first item as visible (even it's not true)
        let bNoVisibleItemsFound = true;
        for (let maxNumberOfTries = 0; maxNumberOfTries < 2 && bNoVisibleItemsFound; maxNumberOfTries++) {
            for (let i = 0; i < this.items.length; i++) {
                tab = this.items[i];
                tabBoundingBox = this._getBoundingBox(tab);

                if (tabBoundingBox.left >= scrollBoundingBox.left &&
                    tabBoundingBox.right <= scrollBoundingBox.right) { // fully visible
                    tab.isVisible = true;
                    bNoVisibleItemsFound = false;
                } else { // only tail is visible
                    tab.isVisible = false;
                }
                // debug         console.log('tabs: _calculateVisibility: tab \'' + tab.labelContent + '\', isVisible=' +
                //  tab.isVisible + ', tabBoundingBox: ', tabBoundingBox);
            }

            if (!bNoVisibleItemsFound) {
                break;
            }

            // debug         console.log('tabs: _calculateVisibility: bNoVisibleItemsFound found. So scroll left till the end (-30000)');
            this._scroll(-30000); // scroll left for huge number to be sure we are at the beginning
        }

        if (bNoVisibleItemsFound) {
            this.items[0].isVisible = true;
        }

        return true;
    }

    _scrollToTab(item) {
        if (!item) {
            return;
        }
        const scrollBoundingBox = this._getBoundingBox(this.shadowRoot.querySelector('#scroll'));
        const tabBoundingBox = this._getBoundingBox(item);
        this._scroll(tabBoundingBox.left - scrollBoundingBox.left);
    }

    /**
   * overwritten from vaadin-list-mixin - '>' button click. We are scrolling 1-tab every time (vaadin scrolls by page)
   * @private
   */
    _scrollForward() {
        if (!this._calculateVisibility()) {
            return;
        }

        this._scrollToTab(this.items[this._getFirstVisibleIndex() + 1]);
    }

    /**
   * overwritten from vaadin-list-mixin - '<' button click. We are scrolling 1-tab every time (vaadin scrolls by page)
   * @private
   */
    _scrollBack() {
        if (!this._calculateVisibility()) {
            return;
        }

        this._scrollToTab(this.items[this._getFirstVisibleIndex() - 1]);
    }

    /**
   * overwritten from vaadin-list-mixin
   * do nothing if tab already visible on the screen
   * otherwise - try to make idx item to become first visible
   * @private
   */
    _scrollToItem(index) {
        if (!this._calculateVisibility()) {
            return;
        }

        const item = this.items[index];
        if (!item || item.isVisible !== false) {
            return;
        }

        this._scrollToTab(item);
    }

    _getFirstVisibleIndex() {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].isVisible !== false) {
                return i;
            }
        }

        return 0; // if no visible items exist - assume that first one should be visible
    }

    _getLastVisibleIndex() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].isVisible !== false) {
                return i;
            }
        }

        return this.items.length - 1; // if no visible items exist - assume that last one should be visible
    }

    _calculateLeftMargin() {
        let scrollBoundingBox = this._getBoundingBox(this.shadowRoot.querySelector('#scroll'));
        let scrollOffset = scrollBoundingBox.left;
        let firstVisibleOffset = this._getBoundingBox(this.items[this._getFirstVisibleIndex()]).left;

        return firstVisibleOffset - scrollOffset;
    }

    _getBoundingBox(el) {
        let box = el.getBoundingClientRect();

        let roundedBox = {
            left:  box.left | 0,
            right: box.right | 0
        };
        roundedBox.width = roundedBox.right - roundedBox.left;

        return roundedBox;
    }

    /**
   * restores maxWidth as a width of visible area (used before any scroll operation
   * @returns {{left, right, width}|*} of the visible area
   * @private
   */
    _setMaxWidth() {
        let scrollBoundingBox = this._getBoundingBox(this.shadowRoot.querySelector('#scroll'));
        let scrollWidth = scrollBoundingBox.width + 'px';

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].style.maxWidth = scrollWidth;
        }

        return scrollBoundingBox;
    }
};
customElements.define(PTCS.Tabs.is, PTCS.Tabs);

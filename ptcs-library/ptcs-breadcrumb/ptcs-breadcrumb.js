import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import '@polymer/iron-icons/iron-icons.js';
import 'ptcs-hbar/ptcs-hbar.js';
import 'ptcs-link/ptcs-link.js';
import 'ptcs-dropdown/ptcs-dropdown.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import {closeTooltip} from 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';

PTCS.Breadcrumb = class extends PTCS.BehaviorFocus(PTCS.BehaviorStyleable(
    PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(PolymerElement)))) {
    static get template() {
        return html`
      <style>

        :host
        {
          display: inline-block;
          box-sizing: border-box;
          overflow: hidden;
        }

        #root
        {
          position: relative;
          box-sizing: content-box;
        }

        #list
        {
          flex: 1 1 auto;
          overflow: hidden;
        }

        [part="separator"]:last-of-type
        {
          display: none;
        }

        [part="separator"]
        {
          flex: 0 0 auto;
          min-width: 0px;
          text-align: center;
        }

        ptcs-button
        {
          flex: 0 0 auto;
        }

        ptcs-link::part(label)
        {
          text-overflow: ellipsis;
        }

        ptcs-link
        {
          flex: 0 0 auto;
          position: relative;
          white-space: nowrap;
        }

        ptcs-link[hidden]
        {
          display: none;
        }

        ptcs-button[hidden]
        {
          display: none;
        }

        ptcs-dropdown[hidden]
        {
          display: none;
        }

        #leftbutton
        {
          margin-right: 8px;
        }

        #rightbutton
        {
          margin-left: 8px;
        }

        #dropdown
        {
          width: 20px;
        }

        #dropdown:not([disabled])
        {
          cursor: pointer;
        }

        [part=dropdown]
        {
          min-height: 0;
          border: none;
        }

        ptcs-dropdown::part(select-box)
        {
          min-height: 0;
          border: none;
        }
        ptcs-dropdown::part(item-value)
        {
          display: none;
        }

        ptcs-dropdown::part(icon)
        {
          min-height: 0;
          pointer-events: auto;
        }
      </style>

      <ptcs-hbar id="root" part="root">
        <ptcs-button id="leftbutton" part="leftbutton" variant="small" icon="[[leftButtonIcon]]"
        disabled="[[disabled]]" hidden\$="[[_leftButtonHidden]]" on-click="_scrollLeft"></ptcs-button>
        <ptcs-hbar part="body" id="list" class="body" on-scroll="_scroll">
          <template id="body" is="dom-repeat" items="[[items]]">
            <ptcs-link part="link" on-click="_clickOnLink" href="[[_getUrlFromObject(item, selectorUrl)]]"
            hidden\$="[[_hideCurrentLevel(index, item, _currentLevel, showCurrentLevel)]]"
            disabled="[[_isCurrentLevel(index, item, _currentLevel, showCurrentLevel, disabled)]]"
            text-maximum-width="[[_linkTruncation(linkTruncation, linkTruncationLength, _maxLenCrumb)]]"
            single-line="" variant="secondary" label="[[_getLabelFromObject(item, selector)]]"
            partmap="* link-*"></ptcs-link>
            <span part="separator">/</span>
          </template>
        </ptcs-hbar>
        <ptcs-button id="rightbutton" part="rightbutton" variant="small" icon="[[rightButtonIcon]]"
        disabled="[[disabled]]" hidden\$="[[_rightButtonHidden]]" on-click="_scrollRight"></ptcs-button>
        <ptcs-dropdown id="dropdown" part="dropdown" items="[[items]]" selector="[[selector]]"
        selected="{{_selectedDropdownItem}}" disabled="[[disabled]]" value-hide=""
        disable-no-item-selection="" display-mode="small" hidden\$="[[_dropdownButtonHidden]]"
        partmap="* dropdown-*"></ptcs-dropdown>
        <span id="filler">&nbsp;</span>
      </ptcs-hbar>
`;
    }

    static get is() {
        return 'ptcs-breadcrumb';
    }

    static get properties() {
        return {

            items: // items assigned
              {
                  type:  Array,
                  value: () => []
              },

            selector: // Name of the property in each item object that contains the 'label'
              {
                  type:  String,
                  value: ''
              },

            selectorUrl: // Name of the property in each item object that contains the 'href'
              {
                  type:  String,
                  value: ''
              },

            showCurrentLevel: // Show/hide the "current" level?
              {
                  type:               Boolean,
                  reflectToAttribute: true,
                  value:              true
              },

            linkTruncation: // Truncate the label of long links?
              {
                  type:  Boolean,
                  value: false,
              },

            linkTruncationLength: // If link truncation is active, what should be the max width?
              {
                  type:  Number,
                  value: 120
              },

            leftButtonIcon:
              {
                  type:  String,
                  value: 'chevron-left'
              },

            rightButtonIcon:
              {
                  type:  String,
                  value: 'chevron-right'
              },

            lastClickedIndex:
              {
                  type:  Number,
                  value: -1
              },

            disabled:
              {
                  type:  Boolean,
                  value: false
              },

            ////////////////////////////////////////////////////////////////
            //  P r i v a t e
            ////////////////////////////////////////////////////////////////
            _currentLevel: // Index of the "current" level
              {
                  type:  Number,
                  value: 0
              },

            _leftButtonHidden: // Should the left scroll button be hidden?
              {
                  type:  Boolean,
                  value: true
              },

            _rightButtonHidden: // Should the left scroll button be hidden?
              {
                  type:  Boolean,
                  value: true
              },

            _dropdownButtonHidden: // Should the left scroll button be hidden?
              {
                  type:  Boolean,
                  value: true
              },

            _maxLenCrumb: // Size of the crumb area, items wider than this should be auto-truncated
              {
                  type:  Number,
                  value: 2000
              },

            _selectedDropdownItem: // The selected item # in the dropdown list
              {
                  type:     Number,
                  value:    -1,
                  observer: '_clickInDropdown'
              },

            // Item with keyboard focus
            _focusedItem: {
                type:  Number,
                value: 0
            },

            _hasFocus: Boolean
        };
    }

    static get observers() {
        return [
            '_items(items.*)'
        ];
    }

    ready() {
        super.ready();

        this._calcButtonVisibility();

        // For keyboard navigation / managing focus
        this.addEventListener('keydown', ev => this._keyDown(ev));
    }

    connectedCallback() {
        super.connectedCallback();
        this._timerHandle = setInterval(() => {
            this._calcButtonVisibility();
        }, 1000);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this._timerHandle);
    }

    _getLabelFromObject(item, selector) {
        if (!item) {
            return '';
        }

        if (!selector) {
            return item || '';
        }

        if (typeof selector === 'string') {
            return item[selector] || '';
        }

        if (selector && selector.constructor && selector.call && selector.apply) {
            return selector(item);
        }

        console.error('Invalid selector');

        // Fallback
        return item || '';
    }

    _getUrlFromObject(item, selector) {
        if (!item) {
            return '';
        }

        if (!selector) {
            return '';
        }

        if (typeof selector === 'string') {
            return item[selector] || '';
        }

        if (selector && selector.constructor && selector.call && selector.apply) {
            return selector(item);
        }

        console.error('Invalid url selector');

        // Fallback
        return '';
    }

    _scrollLeft() {
        const el = this.$.list;
        const leftEdge = el.scrollLeft;
        const links = el.querySelectorAll('ptcs-link');
        requestAnimationFrame(closeTooltip);

        if (links && links.length > 0) {
            const firstLinkOffs = links[0].offsetLeft;

            // Process the links "backwards", starting with the rightmost one
            for (let i = links.length - 1; i >= 0; i--) {
                const l = links[i];

                // Hidden ones have zero offset/width, just ignore those
                if (l.offsetWidth) {
                    const linkOffs = l.offsetLeft - firstLinkOffs;

                    if (linkOffs < leftEdge) {
                        // OK, we've found the first item that should be scrolled to...
                        el.scrollLeft = linkOffs;

                        // No need to scan any further
                        return;
                    }
                }
            }
        }
    }

    _scrollRight() {
        const el = this.$.list;
        const links = el.querySelectorAll('ptcs-link');
        requestAnimationFrame(closeTooltip);

        if (links && links.length > 0) {
            const firstLinkOffs = links[0].offsetLeft;
            for (let i = 0; i < links.length; i++) {

                const l = links[i];

                // Hidden ones have zero offset/width, so just ignore those
                if (l.offsetWidth) {
                    const linkOffs = l.offsetLeft - firstLinkOffs;
                    const linkRight = linkOffs + l.offsetWidth;
                    const rightEdge = el.clientWidth + el.scrollLeft;

                    if (rightEdge < linkRight) {
                        // Here we have found the "next" right-side link to scroll to...

                        // Make sure the left button is visible NOW before we do the calculations
                        this._leftButtonHidden = false;

                        // Set the new scroll value
                        el.scrollLeft = linkRight - el.clientWidth;

                        // No need to scan any further
                        return;
                    }
                }
            }

            // Special case if we get to this point without finding a "proper" next right item: If we
            // are hiding the "current" level, then the last separator should be the rightmost thing showing...
            if (this.showCurrentLevel === false) {
                if (links.length > 2) {
                    const lastLinkIdx = links.length - 2;
                    const seps = el.querySelectorAll('span');
                    if (seps && seps.length > lastLinkIdx) {
                        const lastSep = seps[lastLinkIdx];
                        const lastSepOffs = lastSep.offsetLeft - firstLinkOffs;
                        const lastSepRight = lastSepOffs + lastSep.offsetWidth;

                        const rightEdge = el.clientWidth + el.scrollLeft;

                        if (lastSepRight > rightEdge) {
                            // Show the left button now, it changes the clientWidth
                            this._leftButtonHidden = false;

                            el.scrollLeft = lastSepRight - el.clientWidth;
                        }
                    }
                }
            }
        }
    }

    _scroll() {
        // Do this right away, don't wait for the timer
        this._calcButtonVisibility();
    }

    _linkTruncation(linkTruncation, linkTruncationLength, _maxLenCrumb) {
        if (linkTruncation) {
            return '' + this.linkTruncationLength;
        }

        // Default to the "max" possible value
        return _maxLenCrumb > linkTruncationLength ? ('' + _maxLenCrumb) : '';
    }

    // eslint-disable-next-line no-unused-vars
    _hideCurrentLevel(index, item, currentLevel, showCurrentLevel) {
        const numItems = this.items ? this.items.length : 0;

        if (numItems > 0) {
            if (index === (numItems - 1)) {
                if (!this.showCurrentLevel) {
                    return true;
                }
            }
        }

        return false;
    }

    // eslint-disable-next-line no-unused-vars
    _isCurrentLevel(index, item, currentLevel, showCurrentLevel, disabled) {
        if (disabled === true) {
            return true;
        }

        const numItems = this.items ? this.items.length : 0;

        if (numItems > 0) {
            if (index === (numItems - 1)) {
                return true;
            }
        }

        return false;
    }

    _calcButtonVisibility() {
        const el = this.$.list;

        // The 'left' button should be visible if we are scrolled to the right
        const _leftButtonHidden = this.items.length === 0 || el.scrollLeft === 0;

        // The 'right' button will be visible if there are more content that doesn't fit
        const _rightButtonHidden = this.items.length === 0 || (el.scrollWidth - el.scrollLeft <= el.clientWidth);

        // The dropdown should be hidden if *both* the other buttons are hidden
        const _dropdownButtonHidden = _leftButtonHidden && _rightButtonHidden;

        // Also store the width of the entire area (to be able to "auto-truncate" long crumbs),
        // use the #root element and not the #list to prevent that the length of the
        // truncated element changes as the left/right/down buttons appear/disappear...
        const root = this.$.root;
        const _maxLenCrumb = root.offsetWidth > 100 ? root.offsetWidth - 100 : 100;

        // Set all properties in one call, to minimize recomputations
        this.setProperties({_leftButtonHidden, _rightButtonHidden, _dropdownButtonHidden, _maxLenCrumb});
    }

    _clickOnLink(ev) {
        if (this.disabled || (ev.target && ev.target.disabled)) { // ev.target is the actual ptcs-link
            return;
        }

        const index = this.$.body.indexForElement(ev.target);

        if (index >= 0 && index < this.items.length && index !== null) {
            this.lastClickedIndex = index;

            setTimeout(() => {
                // Click on Link gets lost if you splice without a timeout. The reason in that the link becomes disabled after selection.
                this.splice('items', this.lastClickedIndex + 1);
            });

            this.dispatchEvent(new CustomEvent('ptcs-breadcrumb', {bubbles: true, composed: true, detail: {index, item: this.$.body.items[index]}}));
        } else {
            this.lastClickedIndex = -1;
        }
    }

    _clickInDropdown(index) {
        if (this.disabled) {
            return;
        }

        if (index >= 0 && index < this.items.length && index !== null) {
            this.lastClickedIndex = index;
            // Before we generate the event, first see if we have a URL attached and, if so, navigate to the same href...
            const el = this.$.list;
            const links = el.querySelectorAll('ptcs-link');
            if (links && links.length > 0) {
                // The last item in the list should NOT be treated as a link
                if (index + 1 < links.length) {
                    const link = links[index];
                    // If the link has an associated href, then just open it the same way as if the link itself would have
                    // been clicked...
                    if (link.href && PTCS.validateURL(link.href)) {
                        PTCS.openUrl('open', link.href, link.target ? link.target : '_self');
                    }
                }
            }

            this.splice('items', this.lastClickedIndex + 1);

            this.dispatchEvent(new CustomEvent('ptcs-breadcrumb', {bubbles: true, composed: true, detail: {index, item: this.$.body.items[index]}}));
        } else {
            this.lastClickedIndex = -1;
        }
    }

    _items(changeRecord) {
        const items = changeRecord.base;
        const len = items.length;

        // Set the _currentLevel to have the items correctly updated
        this._currentLevel = Math.max(len - 1, 0);

        // Keyoard focus on the first item
        this._focusedItem = 0;

        if (this._hasFocus) {
            requestAnimationFrame(() => {
                if (this._hasFocus && items === this.items && len === this.items.length) {
                    // Start at the focused item
                    this.scrollIntoView(this._focusedItem);
                } else {
                    // Start at the "beginning"
                    this.$.list.scrollLeft = 0;
                }
            });
        } else {
            // Start at the "beginning"
            this.$.list.scrollLeft = 0;
        }
    }

    _getItemEl(index) {
        return this.$.list.querySelector(`ptcs-link:nth-of-type(${index + 1})`);
    }

    // Callback for BehaviorFocus
    _initTrackFocus() {
        this._trackFocus(this, () => {
            // Make sure focusItem has a proepr value (it _should_ have)
            const maxItem = Math.max(0, this.items.length - (this.showCurrentLevel ? 1 : 2));
            if (this._focusedItem >= maxItem) {
                this._focusedItem = maxItem;
            }
            return this._getItemEl(this._focusedItem);
        });
    }

    scrollIntoView(index) {
        const el = this._getItemEl(index);
        if (!el) {
            return;
        }
        // Add extra space before / after item
        const extra = 48;
        const b1 = this.$.list.getBoundingClientRect();
        const b2 = el.getBoundingClientRect();
        if (b1.left + extra > b2.left) {
            // Make link the fist visible item
            this.$.list.scrollLeft -= b1.left + extra - b2.left;
        } else if (b1.right - extra < b2.right) {
            // Make link the last visible item, but make sure start of link is still visible
            let d = b2.right - b1.right + extra;
            if (b1.left + d > b2.left) {
                d = b2.left - b1.left;
            }
            if (d > 0) {
                this.$.list.scrollLeft += d;
            }
        }
    }

    _notifyFocus() {
        this._hasFocus = true;
        this.scrollIntoView(this._focusedItem);
    }

    _notifyBlur() {
        this._hasFocus = false;
    }

    _keyDown(ev) {
        if (this.disabled) {
            return;
        }

        const maxItem = Math.max(0, this.items.length - (this.showCurrentLevel ? 1 : 2));
        let fi = this._focusedItem;
        switch (ev.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                fi--;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                fi++;
                break;
            case 'PageUp':
            case 'Home':
                fi = 0;
                break;
            case 'PageDown':
            case 'End':
                fi = maxItem;
                break;
            case ' ': {
                // Click on focused item
                const el = this._getItemEl(fi);
                if (el) {
                    el.click();
                }
                ev.preventDefault();
                break;
            }
        }

        // loop back scrolling
        if (fi < 0) {
            fi = maxItem;
        } else if (fi > maxItem) {
            fi = 0;
        }

        if (fi !== this._focusedItem) {
            this._focusedItem = fi;
            this.scrollIntoView(fi);
            ev.preventDefault();
        }
    }
};

customElements.define(PTCS.Breadcrumb.is, PTCS.Breadcrumb);

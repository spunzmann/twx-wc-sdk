import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-modal-overlay/ptcs-modal-overlay.js';
import './ptcs-value-container.js';
import {closeTooltip} from 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<style>

/* Pop-up styling, when the pop-up has been copied to become child of body */
div[part=popup-container] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
    z-index: 99998;
  }

 div[part="value-display-popup"] {
    display: flex;
    flex-direction: column;
    background-color: white;
    box-sizing: border-box;
    position: relative;
    z-index: 99998;
    pointer-events: auto;
    border: solid silver 1px;
  }

  div[part="live-contents-area-popup"] {
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  ptcs-value-container[part="value-container-popup"] {
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    padding-top: 8px; /* To allow the box-shadow of header some space */
    position: relative;
    overflow: auto;
    z-index: 99998;
  }

  div[part="popup-close-button-container"] {
    align-self: flex-end;
    position: fixed;
    height: 34px;
    padding-right: 16px;
    padding-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99998;
  }

  div[part="disclosure-button-container"] {
    align-self: flex-end;
    height: 34px;
    width: 34px;
  }

  div[part="popup-close-button"] {
    padding: 8px;
  }

  ptcs-label[part="value-display-label-popup"] {
    margin-top: 42px;
    padding-left: 24px;
    padding-right: 24px;
    margin-bottom: 8px;
    box-shadow: 0px 8px 8px white;
    min-height: 26px;
    box-sizing: border-box;
    position: static;
    z-index: 99998;
    display: block;
    background: inherit;
  }

</style>`;

document.head.appendChild($_documentContainer.content);

PTCS.ValueDisplay = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))))) {
    static get is() {
        return 'ptcs-value-display';
    }

    static get template() {
        return html`
        <style>
        :host
        {
            display: inline-block;
            box-sizing: border-box;
            overflow: auto;
        }

        :host([_overflow]) {
            overflow: auto;
        }

        :host([_value-type="image"]) {
            overflow: hidden;
        }

        :host([_fallback]:not([_default-text])) [part=overflow-control]::after {
            content: var(--ptcs-value-display-ide-string);
            display: block;
            text-align: center !important;
            width: 100%;
            font-weight: 600;
            font-size: 14px;
            order: 3;
        }

        :host([_fallback]:not([_default-text])) [part=value-container] {
            display: none;
        }

        :host([_fallback]:not([_default-text])) [part=overflow-control] {
            padding: 0px;
        }

        [part=root] {
            width: 100%;
            height: 100%;
        }

        [part=value-display-area] {
            display: flex;
            flex-direction: column;
        }

        [part=overflow-control] {
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }

        :host([_overflow][_show-all]) [part=overflow-control] {
            overflow: visible;
        }

        :host([_value-type='image'][_overflow]:not([overflow-option=showmore])) [part=value-container] {
            min-width: 36px;
            min-height: 61px;
        }

        [part=value-display-label][label=''] {
            display: none;
            padding: 0px;
        }

        [part=disclosure-button-overlay] {
            display: none;
        }

        [part=value-display-label]{
            display: block;
            box-sizing: border-box;
            height: fit-content;
            flex-shrink: 0;
            order: 1;
        }

        [part=value-display-label][variant=header]{
            min-height: 35px;
        }

        [part=value-container] {
            order: 2;
            overflow: visible;
        }

        :host([_showpopup][_overflow]) [part=disclosure-button-overlay] {
            pointer-events: none;
        }

        :host([_overflow][overflow-option=disclosure]) [part=disclosure-button-overlay] {
            position: absolute;
            order: 3;
            display: flex;
            justify-content: flex-end;
            bottom: 0px;
            height: 34px;
            width: 100%;
            z-index: 1;
        }

        :host([_fallback][_overflow]) [part=disclosure-button-overlay] {
            display: none;
        }

        :host([_overflow]) [part=disclosure-button-container] {
          align-self: flex-end;
          height: 34px;
          width: 34px;
        }

        /* ptcs-modal-image-popup has its own disclosure button */
        :host([_value-type='image'][_overflow]:not([overflow-option=showmore])) [part=disclosure-button-overlay] {
            display: none;
        }

        [part=popup-close-button] {
          margin: 8px;
        }

        [part=popup-container] {
            display: none;
          }

        [part=value-display-popup] {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            position: relative;
            z-index: 99998;
            pointer-events: auto;
            border: solid silver 1px;
          }

          [part=live-contents-area-popup] {
            display: flex;
            flex-direction: column;
          }

       :host([_overflow][overflow-option=showmore]) [part=show-button]
       {
          position: absolute;
          order: 3;
          display: flex;
          justify-content: flex-end;
          bottom: 0px;
          width: 100%;
          z-index: 1;
        }

        :host([_overflow][_fallback][overflow-option=showmore]) [part=show-button]
        {
          display: none;
        }

        :host([overflow-option=showmore][_show-all]) [part=show-button] {
        box-shadow: initial;
        background-color: transparent;
        text-align: right;
        order: 3;
        display: flex;
        justify-content: flex-end;
        position: relative;
       }

       [part=show-button] {
            display: none;
        }

        :host(:not([disabled]))  [part=show-button] {
            cursor: auto;
        }

        :host(:not([disabled]))  [part=text-link]::before {
            pointer-events: auto;
            cursor: pointer;
        }

        :host(:not([_show-all])) [part=text-link]::before {
            content: var(--ptcs-label-show-button--more, "Show More");
        }

        :host([_show-all]) [part=text-link]::before {
            content: var(--ptcs-label-show-button--less, "Show Less");
            background: transparent;
            box-shadow: none;
       }

       :host([_show-all]:not([disabled])) [part=show-button]::before {
        pointer-events: auto;
        }

       :host([disabled]) [part=overflow-control] {
             pointer-events: none;
       }

        :host([disabled]) [part=disclosure-button-overlay] {
            pointer-events: none;
        }

        :host([disabled]) [part=disclosure-button] {
            pointer-events: none;
        }

        :host([disabled]) [part=show-button] {
            pointer-events: none;
        }

       :host([_overflow][overflow-option=showmore][_show-all][disabled]) [part=show-button] {
            pointer-events: none;
       }

        </style>
          <div part="root" id="valueroot">
              <div part="value-display-area" id="valuedisplayarea">
                  <div part="overflow-control" id="overflowcontrol"
                       tooltip="[[tooltip]]" tooltip-icon="[[tooltipIcon]]">
                      <ptcs-label part="value-display-label" id="keylabel" partmap="* label-*" label\$="[[label]]"
                        variant="[[valueDisplayType]]" multi-line="" horizontal-alignment="[[labelAlignment]]"
                        max-width="[[resolvedMaxWidth]]" disable-tooltip></ptcs-label>
                      <ptcs-value-container id="valuecontainer" part="value-container"
                        label="[[_label(data, selector)]]"
                        item-meta="[[itemMeta]]"
                        value-type="[[_valueType]]"
                        disabled="[[disabled]]" text-wrap="[[textWrap]]" alignment="[[alignment]]"
                        overflow-option="[[overflowOption]]"
                        label-height="[[labelHeight]]"
                        max-width="[[resolvedMaxWidth]]"
                        max-height="[[resolvedMaxHeight]]"
                        backdrop-color="[[backdropColor]]"
                        backdrop-opacity="[[backdropOpacity]]"
                        default-text="[[defaultText]]">
                      </ptcs-value-container>
                  </div>
                </div>
          </div>
         `;
    }

    static get properties() {
        return {

            // Input data
            data: {
                type:     Object,
                observer: 'dataChanged'
            },

            selector: {
                value: null
            },

            twNumberFormatToken: {
                type:     String,
                observer: '_twNumberFormatTokenChanged'
            },

            itemMeta: {
                type:     Object,
                value:    {type: 'text'},
                observer: '_itemMetaChanged'
            },

            // The key label above the value
            label: {
                type:  String,
                value: '' // Needed so that ptcs-label won't default to "Label"
            },

            labelHeight: { // Actual height of the label
                type:  Number,
                value: 0
            },

            // Label Horizontal Alignment: 'left', 'center', 'right'
            labelAlignment: {
                type:  String,
                value: 'left'
            },

            // Label variant (header, sub-header, label, body)
            valueDisplayType: {
                type:  String,
                value: 'label'
            },

            // Horizontal Alignment within renderer
            horizontalAlignment: {
                type:     String,
                value:    'left',
                observer: '_horizontalAlignmentChanged'
            },

            // Vertical Alignment within renderer
            verticalAlignment: {
                type:     String,
                value:    'flex-start',
                observer: '_verticalAlignmentChanged'
            },

            // Allow text content to wrap in the renderer?
            textWrap: {
                type:  Boolean,
                value: false
            },

            // Default Textual Contents (if there is no data to render)
            defaultText: {
                type:     String,
                observer: '_defaultTextChanged'
            },

            // height in pixels
            height: {
                type: Number
            },

            // width in pixels
            width: {
                type: Number
            },

            // Max height in pixels
            maxHeight: {
                type: Number
            },

            // Smallest of maxHeight / dynamicHeight when both exist, otherwise height
            resolvedMaxHeight: {
                type:     Number,
                computed: '_computeresolvedHeight(maxHeight, dynamicHeight, height)'
            },

            // Max width in pixels
            maxWidth: {
                type: Number
            },

            // Smallest of maxWidth / dynamicWidth when both exist, otherwise width
            resolvedMaxWidth: {
                type:     Number,
                computed: '_computeresolvedWidth(maxWidth, dynamicWidth, width)'
            },

            // Modal pop-up dialog height in pixels
            modalHeight: {
                type:  Number,
                value: 380
            },

            // Modal pop-up dialog width in pixels
            modalWidth: {
                type:  Number,
                value: 600
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            // Modal backdrop color
            backdropColor: {
                type: String
            },

            // Modal backdrop opacity
            backdropOpacity: {
                type: Number
            },

            // Controls whether to show disclosure button (default), horizontal ellipsis, or 'Show More' on overflow
            overflowOption: {
                type:               String, // 'disclosure' | 'ellipsis' | 'showmore'
                reflectToAttribute: true,
                value:              'disclosure'
            },

            // Data type of the value: 'text' | 'image' | ...
            _valueType: {
                type:               String,
                reflectToAttribute: true,
                computed:           '_computeType(itemMeta)'
            },

            // Toggle to show or hide the modal pop-up dialog
            _showpopup: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // State of the show more / show less. When true, we are showing all and display 'Show Less' link.
            _showAll: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            // To keep track of size change
            _resizeObserver: {
                type: ResizeObserver
            },

            // Set when the value height exceeds the allotted display area height
            _overflow: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            // Set if we have no data to display; we may have defaultText to show
            _fallback: {
                type:               Boolean,
                reflectToAttribute: true,
                observer:           '_fallbackChanged',
                computed:           '_showFallback(data, selector)'
            },

            // Height set dynamically
            dynamicHeight: {
                type: Number
            },

            // Width set dynamically
            dynamicWidth: {
                type: Number
            }

        };
    }

    static get observers() {
        return [
            '_observeShowMoreOption(overflowOption, _valueType)',
            '_observeVariables(_showAll, height, width, maxHeight, maxWidth, _valueType, data, defaultText)',
            '_observeOverflow(_overflow, overflowOption)'
        ];
    }

    ready() {
        super.ready();
        this._resizeObserver = new ResizeObserver(entries => {
            if (this._dynamicSize && typeof this._dynamicSize === 'function') {
                this._dynamicSize();
            }
            if (!this._showAll) { // We are not in an expanded show all state
                if (this._valueType !== 'image') {
                    this.dynamicHeight = Math.min(entries[0].contentRect.height, this.dynamicHeight);
                    this.dynamicWidth = Math.min(entries[0].contentRect.width, this.dynamicWidth);
                    requestAnimationFrame(() => {
                        this._updateWidgetConstraints();
                        this._determineOverflow();
                    });
                }
            }
        });
        this.tooltipFunc = this._monitorTooltip.bind(this);
        this.$.overflowcontrol.tooltipFunc = this._monitorTooltip.bind(this);
        this._trackFocus(this, this.$.overflowcontrol);
        this._untrackHover(this);
        this._trackHover(this.$.overflowcontrol);
        // Listen to keypress events when the 'Show More' "button" has focus...
        this.addEventListener('keypress', ev => {
            const key = ev.which || ev.keyCode;
            if (key === 32) {
                this._activateVD();
                ev.preventDefault();
            }
        });

        // This is dispatched from the Property Display when <space> has been pressed (since Edge
        // has issues with passing on the "real" KeyboardEvent)
        this.addEventListener('space-activate', ev => {
            this._activateVD();
            ev.preventDefault();
        });

        // This is dispatched from the ptcs-value-container when the value or default fallback text changes
        this.addEventListener('check-overflow', ev => {
            requestAnimationFrame(() => {
                this._determineOverflow();
            });
            ev.preventDefault();
        });

        // Complement the resize observer to monitor size changes of the browser window itself: When you grab
        // the lower right corner of the browser and resize the browser window, the resizeObserver is not getting
        // invoked because the value display itself is not being resized. But Mashup-Builder resizes the
        // container ancestors.This listener complements monitoring the size changes.
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => {
                if (this._dynamicSize && typeof this._dynamicSize === 'function') {
                    this._dynamicSize();
                }
                this._updateWidgetConstraints();
                this._determineOverflow();
            });
        });
    }

    _activateVD() {
        if (!this.disabled) {
            if (this._valueType === 'image') {
                let elPopup = this.shadowRoot.querySelector('ptcs-modal-image-popup');
                if (elPopup) {
                    elPopup.open();
                }
            } else if (this._valueType === 'link') {
                let elLink = this.shadowRoot.querySelector('ptcs-link');
                if (elLink) {
                    const elA = elLink.shadowRoot.querySelector('[part=link]');
                    if (elA) {
                        elA.click();
                    }
                }
            } else if (this._overflow) {
                if (this.overflowOption === 'showmore') {
                    requestAnimationFrame(closeTooltip);
                    this._showAll = !this._showAll;
                } else if (this.overflowOption === 'disclosure') {
                    // This is the equivalent of a click on the disclosure button
                    this.open();
                }
            }
        }
    }


    connectedCallback() {
        super.connectedCallback();
        this._resizeObserver.observe(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._resizeObserver.unobserve(this);
        if (this._dialog) {
            document.body.removeChild(this._dialog);
        }
    }

    _monitorTooltip() { // Implements ptcs-value-display's tooltip behavior on truncation

        const el = this.$.valuecontainer.querySelector('[part=item-value]');

        if (el && typeof el.tooltipFunc === 'function') { // Does the container have a function to deliver the tooltip contents?
            const containerTooltip = el.tooltipFunc();
            if (containerTooltip) {
                if (this.tooltip) {
                    if (this.tooltip !== this.label) {
                        return containerTooltip + '\n\n' + this.tooltip;
                    }
                }
                return containerTooltip;
            }
        }
        // Default to element tooltip proper
        if (this.tooltip !== this.label) {
            return this.tooltip || '';
        }
        return '';
    }

    dataChanged(data) {
        if (!data) {
            this._showAll = false;
        }
    }

    _showFallback(data, selector) {
        return (this._label(data, selector) === '');
    }

    _fallbackChanged(val) {
        if (val) {
            this._showAll = false;
            requestAnimationFrame(() => {
                this._determineOverflow();
            });
        }
    }

    _defaultTextChanged(val) {
        // Set Boolean attribute _default-text on WC when there is a fallback text defined
        if (val) {
            this.setAttribute('_default-text', '');
        } else {
            this.removeAttribute('_default-text');
        }
    }

    _determineOverflow() {
        if (this.$.valueroot.scrollHeight > 0) { // Ready?
            // Set the labelHeight used by ptcs-value-container
            this.labelHeight = this.$.keylabel.scrollHeight;
            const valuecontainerHeight = this.$.valuecontainer.querySelector('[part=item-value-container]').scrollHeight;
            if (valuecontainerHeight > 0 && !this._showAll) {
                let style = window.getComputedStyle(this.$.overflowcontrol);
                this._overflow = (valuecontainerHeight + this.labelHeight) >
                    (this.$.valuedisplayarea.clientHeight - PTCS.cssDecodeSize(style.paddingTop) - PTCS.cssDecodeSize(style.paddingBottom));
            }
        }
    }

    _updateWidgetConstraints() {
        // maxHeight / maxWidth are properties of the widget. dynamicHeight / dynamicWidth can be provided externally,
        // or by resizeObserver. This is to allow the component to adapt to a container size without getting explicit
        // size constraints. The dynamically computed size constraint does not go below 34 x 34 pixels.
        if (this._valueType !== 'image') {
            let mh, mw;
            if (this.maxHeight > 0) {
                mh = this.maxHeight;
            } else if (this.dynamicHeight > 0) {
                mh = Math.max(34, this.dynamicHeight);
            }
            if (this.maxWidth > 0) {
                mw = this.maxWidth;
            } else if (this.dynamicWidth > 0) {
                mw = Math.max(34, this.dynamicWidth);
            }
            this.$.valuedisplayarea.style.height = this.height > 0 ? this.height + 'px' : '100%';
            this.$.valuedisplayarea.style.width = this.width > 0 ? this.width + 'px' : '100%';
            this.$.valuedisplayarea.style.maxHeight = mh > 0 ? mh + 'px' : '';
            this.$.valuedisplayarea.style.maxWidth = mw > 0 ? mw + 'px' : '';
        }
    }

    _observeShowMoreOption(option, _valueType) {
        if (_valueType === 'image') {
            this._showAll = true; // Always show the thumbnail and its disclosure button
            this.overflowOption = 'disclosure'; // disclosure is always true for image
            this.style.height = ''; // Image thumbnail height varies depending on its width
        }
    }

    // Create overflow related UI component dynamically when needed
    _observeOverflow(_overflow, overflowOption) {
        if (overflowOption) {
            this.$.valuecontainer.overflowOption = overflowOption;
        }
        if (_overflow && this._valueType !== 'image') {
            if (overflowOption === 'disclosure') {
                // Create the disclosure button container dynamically when needed
                if (!this.shadowRoot.querySelector('#disclosurebuttonoverlay')) {
                    // <div part="disclosure-button-overlay" id="disclosurebuttonoverlay">
                    //     <div part="disclosure-button-container" on-click="open">
                    //         <ptcs-button variant="small" partmap="* open-button-*" id="open" part="disclosure-button" mode="icon"
                    //             icon="page:expand-larger"></ptcs-button>
                    //     </div>
                    // </div>

                    // div part=disclosure-button-container
                    let dbc = document.createElement('div');
                    dbc.part = 'disclosure-button-container';
                    dbc.addEventListener('click', () => this.open());
                    // ptcs-button part=disclosure-button
                    let pb = document.createElement('ptcs-button');
                    pb.variant = 'small';
                    pb.partmap = '* open-button-*';
                    pb.id = 'open';
                    pb.part = 'disclosure-button';
                    pb.mode = 'icon';
                    pb.icon = 'page:expand-larger';
                    dbc.appendChild(pb);

                    // div part=disclosure-button-overlay
                    let dbo = document.createElement('div');
                    dbo.part = 'disclosure-button-overlay';
                    dbo.id = 'disclosurebuttonoverlay';
                    dbo.appendChild(dbc);

                    this.$.overflowcontrol.appendChild(dbo);
                }
            } else if (overflowOption === 'showmore') {
                if (!this.shadowRoot.querySelector('#show')) {
                    // Create the Show More container
                    // <div part="show-button" id="show">
                    //     <div part="text-link" id="textlink" on-click='_clickShow'></div>
                    // </div>
                    // div part=text-link
                    let tl = document.createElement('div');
                    tl.part = 'text-link';
                    tl.id = 'textlink';
                    tl.addEventListener('click', () => this._clickShow());

                    // div part=show-button
                    let sb = document.createElement('div');
                    sb.part = 'show-button';
                    sb.id = 'show';
                    sb.appendChild(tl);

                    this.$.overflowcontrol.appendChild(sb);
                }
            }
        }
    }

    // Observer monitors more variables than it uses itself to be invoked whenever the value somehow is affected
    _observeVariables(_showAll, height, width, maxHeight, maxWidth, _valueType, data, defaultText) {
        if (_valueType !== '') { // Do we have a data binding?
            if (_showAll) { // We are showing all
                // Remove height constraints on the value display area container to allow it to be shown in full
                this.$.valuedisplayarea.style.maxHeight = '';
                this.$.valuedisplayarea.style.height = '';
            } else { // Resetting to state 'Show More' (if applicable)
                this._updateWidgetConstraints();
            }
            this._determineOverflow();
            if (_valueType === 'image') {
                // Special handling of image thumbnail size in MB, to prevent disclosure button from being clipped
                this.style.height = '';
            }
        }
    }

    // The component size can be constrained by max height / max width, a dynamic constraint, or an explicit height / width.
    // The resolved value is passed to descendants like the ptcs-label.
    _computeresolvedWidth(maxWidth, dynamicWidth, width) {
        if (maxWidth > 0) {
            return dynamicWidth > 0 ? Math.min(maxWidth, dynamicWidth) : maxWidth;
        }
        if (dynamicWidth > 0) {
            return dynamicWidth;
        }
        return width;
    }

    _computeresolvedHeight(maxHeight, dynamicHeight, height) {
        if (maxHeight > 0) {
            return dynamicHeight > 0 ? Math.min(maxHeight, dynamicHeight) : maxHeight;
        }
        if (dynamicHeight > 0) {
            return dynamicHeight;
        }
        return height;
    }
    _itemMetaChanged(meta) {
        this._updateFormattingByBaseType();
    }

    _twNumberFormatTokenChanged() {
        this.itemMeta._isFormatted = false;
        this.selector = null;

        this._updateFormattingByBaseType();
    }

    _computeType(meta) {
        if (!meta) {
            return '';
        }
        if (meta.type) {
            return meta.type;
        }
        if (!meta.baseType) {
            return '';
        }

        if (!meta.formatterStruct) {
            meta.formatterStruct = {renderer: meta.baseType};
            if (this.meta) {
                this.meta = meta.formatterStruct;
            }
        }
        meta.type = PTCS.Formatter.getContainerType(meta.baseType, meta.formatterStruct);
        if (this.meta) {
            this.meta.type = meta.type;
        }
        return meta.type;
    }

    open() {
        if (!this.disabled) {
            // Create the modal overlay and style it
            let mdl = document.createElement('ptcs-modal-overlay');
            if (this.backdropColor) {
                mdl.backdropColor = this.backdropColor;
            }
            if (this.backdropOpacity) {
                mdl.backdropOpacity = this.backdropOpacity;
            }
            document.body.appendChild(mdl); // Insert backdrop as child of body
            if (this._dialog) {
                document.body.removeChild(this._dialog);
            }
            // Generate the <div part=popup-container dynamically each time the disclosure button is clicked (if some property was updated)
            //
            // <div part="popup-container">
            //    <div part="value-display-popup" style\$="[[_computeModalSize(modalHeight, modalWidth)]]">
            //       <div part="live-contents-area-popup">
            //          <div part="popup-close-button-container" on-click="close">
            //              <ptcs-button variant="small" partmap="* close-button-*" id="close" part="popup-close-button" mode="icon"
            //                    icon="page:alt-close"></ptcs-button>
            //          </div>
            //          <ptcs-label part="value-display-label-popup" partmap="* label-*" label\$="[[label]]"
            //                      variant="[[valueDisplayType]]" multi-line="" horizontal-alignment="[[labelAlignment]]"></ptcs-label>
            //          <ptcs-value-container part="value-container-popup"
            //                 label="[[_label(data, selector)]]"
            //                 item-meta="[[itemMeta]]"
            //                 value-type="[[_valueType]]"
            //                 disabled="[[disabled]]"
            //                 text-wrap="[[textWrap]]"
            //                 alignment="[[alignment]]"
            //                 max-width="[[modalWidth]]"
            //                 backdrop-color="[[backdropColor]]"
            //                 backdrop-opacity="[[backdropOpacity]]">
            //             </ptcs-value-container>
            //         </div>
            //     </div >
            //   </div >

            // div part=popup-close-button-container
            let pcbc = document.createElement('div');
            pcbc.part = 'popup-close-button-container';
            pcbc.addEventListener('click', () => this.close());
            // ptcs-button part=popup-close-button
            let pb = document.createElement('ptcs-button');
            pb.variant = 'small';
            pb.partmap = '* close-button-*';
            pb.id = 'close';
            pb.part = 'popup-close-button';
            pb.mode = 'icon';
            pb.icon = 'page:alt-close';
            pcbc.appendChild(pb);

            // div part=live-contents-area-popup
            let lcap = document.createElement('div');
            lcap.part = 'live-contents-area-popup';

            // ptcs-label part=value-display-label-popup
            let vdlp = document.createElement('ptcs-label');
            vdlp.part = 'value-display-label-popup';
            vdlp.partmap = '* label-*';
            vdlp.label = this.label;
            vdlp.variant = this.valueDisplayType;
            vdlp.multiLine = '';
            vdlp.horizontalAlignment = this.labelAlignment;

            // ptcs-value-container part=value-container-popup
            let vcp = document.createElement('ptcs-value-container');
            vcp.part = 'value-container-popup';
            vcp.label = this._label(this.data, this.selector) || this.defaultText;
            vcp.itemMeta = this.itemMeta;
            vcp.valueType = this._valueType;
            vcp.disabled = this.disabled;
            vcp.textWrap = this.textWrap;
            vcp.alignment = this.alignment;
            vcp.maxWidth = this.modalWidth;
            vcp.backdropColor = this.backdropColor;
            vcp.backdropOpacity = this.backdropOpacity;

            // Populate div part=live-contents-area-popup
            lcap.appendChild(pcbc);
            lcap.appendChild(vdlp);
            lcap.appendChild(vcp);

            // div part=value-display-popup
            let vdp = document.createElement('div');
            vdp.part = 'value-display-popup';
            vdp.setAttribute('style', this._computeModalSize(this.modalHeight, this.modalWidth));
            vdp.appendChild(lcap);

            // root div part=popup-container
            let pc = document.createElement('div');
            pc.part = 'popup-container';
            pc.appendChild(vdp);
            this._dialog = document.body.appendChild(pc);

            // Copy custom styling of value
            const cs = window.getComputedStyle(this.shadowRoot.querySelector('[part=item-value]'));
            let iv = this._dialog.querySelector('[part=item-value]');
            iv.style.color = cs.getPropertyValue('color');
            iv.style.fontFamily = cs.getPropertyValue('font-family');
            iv.style.fontSize = cs.getPropertyValue('font-size');
            iv.style.fontStyle = cs.getPropertyValue('font-style');
            iv.style.fontWeight = cs.getPropertyValue('font-weight');
            iv.style.letterSpacing = cs.getPropertyValue('letter-spacing');
            iv.style.lineHeight = cs.getPropertyValue('line-height');

            this._showpopup = true;

            // Store the current 'focus' element (in a PD, this is the PD itself and not the VD)
            this.__prevFocusElt = document.activeElement;

            if (this.__prevFocusElt) {
                // "Un-focus" while the popup is open
                this.__prevFocusElt.blur();
            }

            // Add an event listener that prevents the user from tabbing out of the modal dialog and
            // allows closing it with <ESC> or <Space>
            requestAnimationFrame(() => {
                if (!this._captureTab) {
                    this._captureTab = (ev) => {
                        switch (ev.which) {
                            case 27: // <ESC>
                            case 32: // <Space>
                                this.close();
                                // Fall through to next case (preventDefault())
                            case 9: // <TAB>
                                ev.preventDefault();
                                break;
                        }
                    };
                }
                document.addEventListener('keydown', this._captureTab);
            });
        }
    }

    close() { // Close the dialog, delete the modal background overlay and emit popup-close-action event
        if (this._showpopup) { // Close the dialog and remove the modal background overlay
            const mdl = document.body.querySelector('ptcs-modal-overlay');
            mdl.parentNode.removeChild(mdl); // Remove the modal overlay
            this._dialog.style.display = 'none';
            this._showpopup = false;
            this.dispatchEvent(new CustomEvent('popup-close-action'), {
                bubbles:  true,
                composed: true
            });

            // Remove the "global" event listener for the "modal" popup
            document.removeEventListener('keydown', this._captureTab);

            // Restore focus to "main" part of the component
            if (this.__prevFocusElt) {
                this.__prevFocusElt.focus();
                this.__prevfocusElt = undefined;
            }
        }
    }

    _clickShow() {
        if (!this.disabled) {
            this._showAll = !this._showAll;
            requestAnimationFrame(closeTooltip);
        }
    }

    _horizontalAlignmentChanged(horizontalAlignment) {
        this.$.valuedisplayarea.style.textAlign = horizontalAlignment;
    }

    _verticalAlignmentChanged(verticalAlignment) {
        this.$.valuedisplayarea.style.justifyContent = verticalAlignment;
    }

    _computeModalSize(modalHeight, modalWidth) {
        const w = modalWidth ? 'width:' + modalWidth + 'px;' : '';
        const h = modalHeight ? 'height:' + modalHeight + 'px;' : '';
        return h + w;
    }

    _label(item, selector) {
        if (item === null || item === '' || item === undefined) {
            return '';
        }

        let retLabel = '';
        if (!selector) {
            retLabel = item;
        } else if (typeof selector === 'string') {
            retLabel = item[selector];
        } else if (selector.constructor && selector.call && selector.apply) {
            retLabel = selector(item);
        } else {
            console.error('Invalid ptcs-value-display value selector', selector);
        }

        if (retLabel === undefined || retLabel === null) {
            retLabel = '';
        } else if ((!this.itemMeta || (this.itemMeta.type !== 'link' && this.itemMeta.type !== 'function')) && typeof retLabel !== 'string') {
            retLabel = retLabel.toString();
        }

        return retLabel;
    }

    _updateFormattingByBaseType() {
        var meta = this.itemMeta;

        if (!meta || meta._isFormatted || !meta.baseType) {
            return;
        }
        meta._isFormatted = true;

        meta.formatterStruct = meta.formatterStruct || {renderer: meta.baseType};
        meta.formatterStruct.numberFormatString = this.twNumberFormatToken ? '[[' + this.twNumberFormatToken + ']]' : this.twNumberFormatToken;

        let formattingInfo = PTCS.Formatter.getFormaterFunc(meta.baseType, this.selector, meta.formatterStruct);
        if (typeof formattingInfo === 'function') {
            this.selector = formattingInfo;
        } else if (formattingInfo) {
            _.forEach(formattingInfo, (value, key) => {
                if (typeof value === 'function') {
                    this.selector = value;
                } else {
                    meta[key] = value;
                }
            });
            this._determineOverflow();
        } else {
            //console.log('WARN: ptcs-value-display: Unknown formatter type: ' + meta.baseType);
        }
    }

};

customElements.define(PTCS.ValueDisplay.is, PTCS.ValueDisplay);

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-icon/ptcs-icon.js';
import 'ptcs-button/ptcs-button.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';

/* eslint-disable max-len */

// IE and Edge has a different opinion about how SVG should be interpreted.
// Ugly fixes are unfortunately needed.
(() => {
    const _hdr = `w="18" h="18" viewBox="0 0 34 34" stroke="none" stroke-width="1" transform="translate(8 ${PTCS.isIE ? 6 : 8})"`;
    const iconset = document.createElement('iron-iconset-svg');
    iconset.setAttribute('name', 'dpanel');
    iconset.setAttribute('size', '24');
    iconset.innerHTML = `<svg>
<g id="chevron-open" ${_hdr}>
<polygon part="img" fill-rule="nonzero" points="10 15.5735294 3.81916329 8.82352941 10 2.07352941 8.09716599 0 0 8.82352941 8.09716599 17.6470588"/>
<polygon part="img" fill-rule="nonzero" points="18 15.5735294 11.8191633 8.82352941 18 2.07352941 16.097166 0 8 8.82352941 16.097166 17.6470588"/>
</g>
<g id="chevron-left" ${_hdr}>
<polygon part="img" transform="translate(9.5, 9.726667) rotate(-270) translate(-6.5, -9.726667)"
points="13.385 4.16916667 6.5 11.0391667 -0.385 4.16916667 -2.5 6.28416667 6.5 15.2841667 15.5 6.28416667"/>
</g>
<g id="close" ${_hdr}>
<polygon part="img" points="18 15.462 15.462 18 9 11.538 2.538 18 0 15.462 6.462 9 0 2.538 2.538 0 9 6.462 15.462 0 18 2.538 11.538 9"/>
</g>
<g id="add" ${_hdr}>
<polygon part="img" points="10.8,0 7.2,0 7.2,7.2 0,7.2 0,10.8 7.2,10.8 7.2,18 10.8,18 10.8,10.8 18,10.8 18,7.2 10.8,7.2 "/>
</g>
<g id="remove" ${_hdr}>
<polygon part="img" points="18,11 0,11 0,7 18,7 "/>
</g>
<defs>
</defs>
</svg>`;

    document.head.appendChild(iconset);
})();


PTCS.DynamicPanel = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))))) {
    static get template() {
        return html`
        <style>
        :host {
            /* If not relative then the collapsed panel will not be hidden in fly-over mode. MB tries to change position to static */
            position: relative !important;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: stretch;
            align-content: stretch;
            box-sizing: border-box;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }

        :host([disabled]) {
            pointer-events: none;
        }

        :host([sizing]) {
            user-select: none;
            -ms-user-select: none;
        }

        :host([sizing]) ::slotted(*) {
            user-select: none;
            -ms-user-select: none;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }

        :host([anchor=top]) {
            flex-direction: column;
        }

        :host([anchor=right]) {
            flex-direction: row-reverse;
        }

        :host([anchor=bottom]) {
            flex-direction: column-reverse;
        }

        :host([anchor=left]) {
            flex-direction: row;
        }

        .panel-cntr {
            position: relative;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: stretch;
            align-content: stretch;
            flex: 0 0 auto;
            background: inherit;
        }

        :host([transition][panel-size=auto]) .panel-cntr,
        :host([transition]:not([panel-size])) .panel-cntr {
            overflow: hidden;
        }

        .panel-cntr[mode=flyover] {
            position: absolute;
            z-index: 20000;
        }

        :host([anchor=top]) > .panel-cntr {
            flex-direction: column;
        }

        :host([anchor=right]) > .panel-cntr {
            flex-direction: row-reverse;
        }

        :host([anchor=bottom]) > .panel-cntr {
            flex-direction: column-reverse;
        }

        :host([anchor=left]) > .panel-cntr {
            flex-direction: row;
        }

        .panel-cntr[tuck] {
            justify-content: flex-end;
        }

        /* IE fix */
        :host([ie-fix]) .panel-cntr[tuck] {
            overflow: hidden;
        }

        [part~=panel] {
            position: relative;
            box-sizing: border-box;
            overflow: auto;
        }

        .panel-cntr:not([tuck]) [part~=panel] {
            flex: 1 1 auto;
        }

        .panel-cntr[tuck] [part~=panel] {
            flex: 0 0 auto;
        }

        .container-wrapper {
            display: flex;
            position: relative;
            flex: 1 1 auto;
            box-sizing: border-box;
            overflow: hidden;
        }

        [part~=scrim] {
            position: absolute;
            box-sizing: border-box;
            left: 0px;
            top: 0px;
            right: 0px;
            bottom: 0px;
            z-index: 2000;
        }

        [part~=container] {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            overflow: auto;
            background: inherit;
        }

        :host([collapsed]) [part~=separator] {
            pointer-events: none;
        }

        [part~=separator] {
            position: relative;
            flex: 0 0 auto;
        }

        .hitarea {
            position: absolute;
            z-index: 20000;
            /*background: rgba(192,92,92,0.3);*/
        }

        :host([collapsed]) .hitarea {
            display: none;
        }

        [part~=separator][anchor=left] .hitarea {
            width: 20px;
            top: 0px;
            bottom: 0px;
            right: calc(50% - 10px);
            cursor: ew-resize;
        }

        [part~=separator][anchor=right] .hitarea {
            width: 20px;
            top: 0px;
            bottom: 0px;
            left: calc(50% - 10px);
            cursor: ew-resize;
        }

        [part~=separator][anchor=top] .hitarea {
            height: 20px;
            bottom: calc(50% - 10px);
            left: 0px;
            right: 0px;
            cursor: ns-resize;
        }

        [part~=separator][anchor=bottom] .hitarea {
            height: 20px;
            top: calc(50% - 10px);
            left: 0px;
            right: 0px;
            cursor: ns-resize;
        }

        :host([hide-thumb]) .hitarea {
            cursor: default !important;
            pointer-events: none;
        }

        [part~=thumb] {
            position: absolute;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            fill: currentColor;
        }

        :host([hide-thumb]) [part~=thumb] {
            display: none;
        }

        :host([transition]) .hitarea {
            display: none !important;
        }

        [part~=trigger][hidden] {
            display: none;
        }

        [part~=trigger] {
            position: absolute;
            box-sizing: border-box;
            cursor: pointer;
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
        }


        /*
         * Shady DOM fix: "> div > div >" - or the styling leaks into sub-dynamic-panels
         */

        :host([collapsed]) > div > div > [part~=trigger]:not(.reflex) {
            opacity: 0;
            pointer-events: none;
        }
        :host(:not([collapsed])) > div > div > .reflex[part~=trigger] {
            opacity: 0;
            pointer-events: none;
        }

        :host([anchor=left]) > div > div > [part~=trigger][pos=top] {
            top: 0px;
            right: 0px;
        }
        :host([anchor=left]) > div > div > [part~=trigger][pos=center] {
            top: calc(50% - 17px);
            right: 0px;
        }
        :host([anchor=left]) > div > div > [part~=trigger][pos=bottom] {
            bottom: 0px;
            right: 0px;
        }
        :host([anchor=right]) > div > div > [part~=trigger][pos=top] {
            top: 0px;
            left: 0px;
        }
        :host([anchor=right]) > div > div > [part~=trigger][pos=center] {
            top: calc(50% - 17px);
            left: 0px;
        }
        :host([anchor=right]) > div > div > [part~=trigger][pos=bottom] {
            bottom: 0px;
            left: 0px;
        }
        :host([anchor=top]) > div > div > [part~=trigger][pos=left] {
            bottom: 0px;
            left: 0px;
        }
        :host([anchor=top]) > div > div > [part~=trigger][pos=center] {
            bottom: 0px;
            left: calc(50% - 17px);
        }
        :host([anchor=top]) > div > div > [part~=trigger][pos=right] {
            bottom: 0px;
            right: 0px;
        }
        :host([anchor=bottom]) > div > div > [part~=trigger][pos=left] {
            top: 0px;
            left: 0px;
        }
        :host([anchor=bottom]) > div > div > [part~=trigger][pos=center] {
            top: 0px;
            left: calc(50% - 17px);
        }
        :host([anchor=bottom]) > div > div > [part~=trigger][pos=right] {
            top: 0px;
            right: 0px;
        }

        /* Reflex trigger */
        :host([anchor=left]) > div > div > .reflex[part~=trigger][pos=top] {
            right: unset;
            left: 0px;
        }
        :host([anchor=left]) > div > div > .reflex[part~=trigger][pos=center] {
            right: unset;
            left: 0px;
        }
        :host([anchor=left]) > div > div > .reflex[part~=trigger][pos=bottom] {
            right: unset;
            left: 0px;
        }
        :host([anchor=right]) > div > div > .reflex[part~=trigger][pos=top] {
            left: unset;
            right: 0px;
        }
        :host([anchor=right]) > div > div > .reflex[part~=trigger][pos=center] {
            left: unset;
            right: 0px;
        }
        :host([anchor=right]) > div > div > .reflex[part~=trigger][pos=bottom] {
            left: unset;
            right: 0px;
        }
        :host([anchor=top]) > div > div > .reflex[part~=trigger][pos=left] {
            bottom: unset;
            top: 0px;
        }
        :host([anchor=top]) > div > div > .reflex[part~=trigger][pos=center] {
            bottom: unset;
            top: 0px;
        }
        :host([anchor=top]) > div > div > .reflex[part~=trigger][pos=right] {
            bottom: unset;
            top: 0px;
        }
        :host([anchor=bottom]) > div > div > .reflex[part~=trigger][pos=left] {
            top: unset;
            bottom: 0px;
        }
        :host([anchor=bottom]) > div > div > .reflex[part~=trigger][pos=center] {
            top: unset;
            bottom: 0px;
        }
        :host([anchor=bottom]) > div > div > .reflex[part~=trigger][pos=right] {
            top: unset;
            bottom: 0px;
        }

        /* Icons */
        :host([anchor=left][trigger-type=type1]) > div > div > [part~=trigger] {
            transform: rotate(0deg);
        }
        :host([anchor=left][trigger-type=type1]) > div > div > .reflex[part~=trigger] {
            transform: rotate(180deg);
        }
        :host([anchor=right][trigger-type=type1]) > div > div > [part~=trigger] {
            transform: rotate(180deg);
        }
        :host([anchor=right][trigger-type=type1]) > div > div > .reflex[part~=trigger] {
            transform: rotate(0deg);
        }
        :host([anchor=top][trigger-type=type1]) > div > div > [part~=trigger] {
            transform: rotate(90deg);
        }
        :host([anchor=top][trigger-type=type1]) > div > div > .reflex[part~=trigger] {
            transform: rotate(-90deg);
        }
        :host([anchor=bottom][trigger-type=type1]) > div > div > [part~=trigger] {
            transform: rotate(-90deg);
        }
        :host([anchor=bottom][trigger-type=type1]) > div > div > .reflex[part~=trigger] {
            transform: rotate(90deg);
        }

        :host([anchor=left][trigger-type=type2]) > div > div > .reflex[part~=trigger] {
            transform: rotate(180deg);
        }
        :host([anchor=right][trigger-type=type2]) > div > div > .reflex[part~=trigger] {
            transform: rotate(0deg);
        }
        :host([anchor=top][trigger-type=type2]) > div > div > .reflex[part~=trigger] {
            transform: rotate(-90deg);
        }
        :host([anchor=bottom][trigger-type=type2]) > div > div > .reflex[part~=trigger] {
            transform: rotate(90deg);
        }

        :host([anchor=left][trigger-type=type3]) > div > div > [part~=trigger]:not(.reflex) {
            transform: rotate(0deg);
        }
        :host([anchor=right][trigger-type=type3]) > div > div > [part~=trigger]:not(.reflex) {
            transform: rotate(180deg);
        }
        :host([anchor=top][trigger-type=type3]) > div > div > [part~=trigger]:not(.reflex) {
            transform: rotate(90deg);
        }
        :host([anchor=bottom][trigger-type=type3]) > div > div > [part~=trigger]:not(.reflex) {
            transform: rotate(-90deg);
        }

        :host([anchor=left][trigger-type=type3]) > div > div > .reflex[part~=trigger] {
            transform: rotate(180deg);
        }

        :host([anchor=right][trigger-type=type3]) > div > div > .reflex[part~=trigger] {
            transform: rotate(0deg);
        }

        :host([anchor=top][trigger-type=type3]) > div > div > .reflex[part~=trigger] {
            transform: rotate(-90deg);
        }

        :host([anchor=bottom][trigger-type=type3]) > div > div > .reflex[part~=trigger] {
            transform: rotate(90deg);
        }

        .slot-wrapper:not([flex]) {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            overflow: auto;
        }
        </style>

        <div id="panelcntr" class="panel-cntr" mode\$="[[pushBehavior]]" tuck\$="[[_tuck(transition, _collapsed)]]"
            on-transitionstart="_transitionStart" on-transitioncancel="_transitionCancel" on-transitionend="_transitionEnd">
            <div id="panel" part="panel">
                <div id="trigger" part="trigger" on-click="toggle" hidden\$="[[_hideTrigger(_trigger)]]" pos\$="[[_trigger]]">
                    <ptcs-button id="triggerbutton" part="trigger-button" variant="small" icon="[[_triggerIcon1(triggerType)]]"
                                 tooltip="[[triggerTooltip]]" tooltip-icon="[[triggerTooltipIcon]]"></ptcs-button>
                </div>
                <div part="panel-wrapper" class="slot-wrapper" flex\$="[[flex]]"><slot name="panel"></slot></div>
            </div>
            <div id="separator" part="separator" anchor\$="[[anchor]]" hover\$="[[hoverThumb]]" on-mousedown="_mouseDown">
                <div class="hitarea" on-mouseenter="_mouseEnter" on-mouseleave="_mouseLeave"
                     tooltip="[[thumbTooltip]]" tooltip-icon="[[thumbTooltipIcon]]"><div id="thumb" part="thumb" anchor\$="[[anchor]]" hover\$="[[hoverThumb]]">
                <svg width="11px" height="8px" viewBox="0 0 11 8">
                    <g stroke="none" stroke-width="1" transform="translate(5.5, 4) rotate(-90) translate(-3.5, -5)">
                        <path d="M1.02508179,5.83333333 L0,6.8125 L3.32969829,10 L6.66666667,6.8125 L5.63431479,5.83333333 L3.32969829,8.03472222 L1.02508179,5.83333333 Z M5.64158488,4.16666667 L6.66666667,3.1875 L3.33696838,0 L0,3.1875 L1.03235187,4.16666667 L3.33696838,1.96527778 L5.64158488,4.16666667 Z"></path>
                    </g>
                </svg></div></div>
            </div>
        </div>
        <div class="container-wrapper">
            <div part="scrim" id="scrim" hidden\$="[[_hideScrim(scrim, _collapsed)]]"></div>
            <div part="container" on-click="cntrClick">
                <div id="trigger2" part="trigger" class="reflex" on-click="toggle" hidden\$="[[_hideTrigger(_trigger)]]" pos\$="[[_trigger]]">
                    <ptcs-button id="triggerbutton2" part="trigger-button" variant="small" icon="[[_triggerIcon2(triggerType)]]"
                                 tooltip="[[triggerTooltip]]" tooltip-icon="[[triggerTooltipIcon]]"></ptcs-button>
                </div>
                <div part="panel-wrapper" class="slot-wrapper" flex\$="[[flex]]"><slot></slot></div>
             </div>
        </div>`;

    }

    static get is() {
        return 'ptcs-dynamic-panel';
    }

    static get properties() {
        return {
            disabled: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // "top", "right", "bottom", "left"
            anchor: {
                type:               String,
                value:              'left',
                reflectToAttribute: true
            },

            hideThumb: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // "top", "right", "bottom", "left", "center", "middle", "none", "panel"
            trigger: {
                type:  String,
                value: 'top'
            },
            triggerTooltip: {
                type: String
            },
            triggerTooltipIcon: {
                type: String
            },

            // "type1", "type2", "type3", "type4"
            triggerType: {
                type:               String,
                value:              'type1',
                reflectToAttribute: true
            },

            hideTrigger: {
                type: Boolean
            },

            // "top", "right", "bottom", "left", "center", "none", "panel"
            _trigger: {
                type:     String,
                computed: '_computeTrigger(trigger, anchor, hideTrigger)'
            },

            collapsed: {
                type:               Boolean,
                value:              false,
                notify:             true,
                reflectToAttribute: true,
                observer:           '_collapsedChanged'
            },

            // Internal value, that allow us to do pre-work before starting the collapse / expand process
            _collapsed: {
                type: Boolean
            },

            // Saved panel height when panel is hidden,
            // so it can animate the expand process
            _hideSize: {
                type: String
            },

            // Is panel in transition? (collapsed property)
            transition: {
                type:               Boolean,
                reflectToAttribute: true
            },

            // "push", "flyover"
            pushBehavior: {
                type:               String,
                value:              'push',
                reflectToAttribute: true
            },

            // Enable scrim
            scrim: {
                type: Boolean
            },

            collapsedPanelSize: {
                type:  String,
                value: '0px'
            },

            minPanelSize: {
                type:  String,
                value: '34px'
            },

            maxPanelSize: {
                type:  String,
                value: '100%'
            },

            panelSize: {
                type:               String,
                value:              '280px',
                observer:           '_panelSizeChanged',
                reflectToAttribute: true
            },

            // Is panelSize === 'auto' and the UI user has not yet
            // dragged the resize thumb?
            _autoPanel: {
                type: Boolean
            },

            // The actual panelSize
            _panelLength: {
                type:  String,
                value: '280px'
            },

            // Is the resize thumb currently dragged?
            sizing: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            speed: {
                type:  String,
                value: '200ms'
            },

            // Such an awkward name...
            clickOutsideToClose: {
                type: Boolean
            },

            disableOutsideClickForMashupIDE: {
                type:  Boolean,
                value: false
            },

            _connected: {
                type: Boolean
            },

            // Flex mode? (Probably = is the height of the component not "auto"?)
            flex: {
                type: Boolean
            },

            // Workaround for the theme engine to detect when the thumb is hovered via the hitarea
            hoverThumb: {
                type: Boolean
            },

            thumbTooltip: {
                type: String
            },
            thumbTooltipIcon: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_panelLengthConfig(_panelLength, pushBehavior, anchor, _collapsed, collapsedPanelSize)',
            '_minmaxSize(anchor, _collapsed, transition, minPanelSize, maxPanelSize)',
            '_animationSpeed(speed, sizing)',
            '_clickOutsideToClose(clickOutsideToClose, _connected, _collapsed, disableOutsideClickForMashupIDE)'
        ];
    }

    ready() {
        super.ready();
        if (PTCS.isIE) {
            this.setAttribute('ie-fix', '');
        }
        this.addEventListener('keydown', ev => this._keyDown(ev));
        this._trackFocus(this, () => {
            if (!this.hideTrigger && this.trigger !== 'none' && this.trigger !== 'panel') {
                if (this.collapsed) {
                    return this.$.triggerbutton2;
                }
                return this.$.triggerbutton;
            }
            // Trigger not visible, highlight the entire thing
            return this;
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;

        if (this.flex === undefined) {
            const style = window.getComputedStyle(this);
            this.flex = (style.height === 'auto');
        }
    }

    disconnectedCallback() {
        this._connected = false;
        super.disconnectedCallback();
    }

    applyProps(style, opt) {
        for (const k in opt) {
            style[k] = opt[k];
        }
    }

    _tuck(transition, _collapsed) {
        return transition || _collapsed;
    }

    _hideScrim(scrim, _collapsed) {
        return !scrim || _collapsed;
    }

    static _triggerType(triggerType) {
        return typeof triggerType === 'string' ? triggerType.replace(/\s/g, '').toLowerCase() : '';
    }

    _triggerIcon1(triggerType) {
        switch (PTCS.DynamicPanel._triggerType(triggerType)) {
            case 'type1':
            case 'doublecarets':
                return 'dpanel:chevron-open';
            case 'type2':
            case 'close':
                return 'dpanel:close';
            case 'type3':
            case 'singlecaret':
                return 'dpanel:chevron-left';
            case 'type4':
            case 'plus/minus':
                return 'dpanel:remove';
        }
        return false;
    }

    _triggerIcon2(triggerType) {
        switch (PTCS.DynamicPanel._triggerType(triggerType)) {
            case 'type1':
            case 'doublecarets':
                return 'dpanel:chevron-open';
            case 'type2':
            case 'close':
                return 'dpanel:chevron-left';
            case 'type3':
            case 'singlecaret':
                return 'dpanel:chevron-left';
            case 'type4':
            case 'plus/minus':
                return 'dpanel:add';
        }
        return false;
    }

    // Unit-less sizes should explicitly use the 'px' unit
    static _size(size) {
        const m = typeof size === 'string' ? /^([0-9.]+)(.*)$/.exec(size) : undefined;
        return m && m[2] === '' ? size + 'px' : size;
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }

    cntrClick() {
        if (this._trigger === 'panel' && !this.disabled) {
            this.toggle();
        }
    }

    _panelSizeChanged(panelSize) {
        if (panelSize === 'auto' || !panelSize) {
            this.$.panel.style.overflow = 'hidden';
            this.setProperties({
                _autoPanel:   true,
                _panelLength: 'auto'
            });
        } else {
            this.$.panel.style.overflow = '';
            this.setProperties({
                _autoPanel:   false,
                _panelLength: PTCS.DynamicPanel._size(panelSize)
            });
        }
    }

    _hideTrigger(_trigger) {
        return _trigger === 'none' || _trigger === 'panel';
    }

    _computeTrigger(trigger, anchor, hideTrigger) {
        if (hideTrigger) {
            return 'none';
        }
        if (trigger === 'none' || trigger === 'panel') {
            return trigger;
        }
        if (trigger === 'middle' || trigger === 'center') {
            return 'center';
        }
        if (anchor === 'left' || anchor === 'right') {
            if (trigger !== 'top' && trigger !== 'bottom') {
                return 'top';
            }
        } else if (anchor === 'top' || anchor === 'bottom') {
            if (trigger !== 'left' && trigger !== 'right') {
                return 'right';
            }
        }
        return trigger;
    }

    _panelLengthConfig(_panelLength, pushBehavior, anchor, _collapsed, collapsedPanelSize) {
        const vert = anchor === 'left' || anchor === 'right';
        const style = this.$.panelcntr.style;
        const opt = {top: '', left: '', bottom: '', right: '', width: '', height: ''};

        if (pushBehavior === 'flyover') {
            switch (anchor) {
                case 'left':
                    opt.top = opt.bottom = opt.left = '0px';
                    break;
                case 'right':
                    opt.top = opt.bottom = opt.right = '0px';
                    break;
                case 'top':
                    opt.top = opt.left = opt.right = '0px';
                    break;
                case 'bottom':
                    opt.bottom = opt.left = opt.right = '0px';
                    break;
            }
        }

        const length = _collapsed ? PTCS.DynamicPanel._size(collapsedPanelSize) : _panelLength;
        if (length !== 'auto') {
            if (vert) {
                opt.width = length;
            } else {
                opt.height = length;
            }
        }

        // Assign styling
        this.applyProps(style, opt);
    }

    _minmaxSize(anchor, _collapsed, transition, minPanelSize, maxPanelSize) {
        const vert = anchor === 'left' || anchor === 'right';
        const opt1 = {minWidth: '', minHeight: '', maxWidth: '', maxHeight: ''};
        const opt2 = {width: '', height: '', maxWidth: '', maxHeight: ''};
        const minSize = PTCS.cssDecodeSize(minPanelSize, this, vert);
        const _minPanelSize = minSize < 34 ? '34px' : PTCS.DynamicPanel._size(minPanelSize);
        const _maxPanelSize = PTCS.DynamicPanel._size(maxPanelSize);

        if (!this._tuck(transition, _collapsed)) {
            // Panel is collapsed and not in transition
            if (vert) {
                opt1.minWidth = _minPanelSize;
                opt1.maxWidth = _maxPanelSize;
            } else {
                opt1.minHeight = _minPanelSize;
                opt1.maxHeight = _maxPanelSize;
            }
        } else if (vert) {
            opt2.width = this._hideSize || '';
        } else {
            opt2.height = this._hideSize || '';
        }

        // Assign styling
        this.applyProps(this.$.panelcntr.style, opt1);
        this.applyProps(this.$.panel.style, opt2);
    }

    // Some pre-work is needed when expanding / collapsing
    _collapsedChanged(collapsed) {
        const vert = this.anchor === 'left' || this.anchor === 'right';

        // Cofigure opacity transition
        this._opacityAnim(this.speed, this._collapsed);

        // Save current panel size
        if (collapsed) {
            // Panel is about to collapse. Store the current dimension
            const dimKey = vert ? 'width' : 'height';
            this._hideSize = `${this.$.panel.getBoundingClientRect()[dimKey]}px`;
            if (this._hideSize === '0px') {
                this._hideSize = '';
            }
        } else if (!this._hideSize) {
            // Exapand, without a panel size. Fallback behavior
            const d = PTCS.cssDecodeSize(this.panelSize, this, vert);
            this._hideSize = `${Math.max(d, PTCS.DynamicPanel._minPanelSize)}px`;
        }

        // Start the expand / collapse process
        this._collapsed = collapsed;
        if (this.transition !== undefined) {
            this.transition = true;
        }
    }

    _resize(ev, x0, y0) {
        const r = this.getBoundingClientRect();
        const f = (a, b, c) => {
            const min = PTCS.DynamicPanel._minPanelSize + this.$.panelcntr[c] - this.$.panel[c];
            return a < min ? `${min}px` : `${Math.max(0, Math.min((100 * a) / b, 100))}%`;
        };
        let length;

        switch (this.anchor) {
            case 'left':
                length = f(ev.clientX - r.left + x0, r.width, 'offsetWidth');
                break;
            case 'right':
                length = f(r.width - ev.clientX + r.left + x0, r.width, 'offsetWidth');
                break;
            case 'top':
                length = f(ev.clientY - r.top + y0, r.height, 'offsetHeight');
                break;
            case 'bottom':
                length = f(r.height - ev.clientY + r.top + y0, r.height, 'offsetHeight');
                break;
            default:
                return;
        }
        this.setProperties({
            _autoPanel:   false,
            _panelLength: length
        });
        this.dispatchEvent(new CustomEvent('ptcs-dynamic-panel-thumb-resize', {bubbles: true, composed: true}));
    }

    _mouseDown(ev) {
        if (this._collapsed || this.hideThumb || this.disabled) {
            return;
        }

        const r = this.$.panelcntr.getBoundingClientRect();
        const x = this.anchor === 'left' ? r.right - ev.clientX : ev.clientX - r.left;
        const y = this.anchor === 'top' ? r.bottom - ev.clientY : ev.clientY - r.top;

        let mmv = ev1 => this._resize(ev1, x, y);

        this.sizing = true;

        let mup = () => {
            window.removeEventListener('mousemove', mmv);
            window.removeEventListener('mouseup', mup);
            this.sizing = false;
        };

        window.addEventListener('mousemove', mmv);
        window.addEventListener('mouseup', mup);
    }

    _transitionStart(ev) {
        if (ev.srcElement.classList.contains('panel-cntr')) {
            this.transition = true;
        }
    }

    _transitionCancel(ev) {
        this._transitionEnd(ev);
    }

    _transitionEnd(ev) {
        if (ev.srcElement.classList.contains('panel-cntr')) {
            this.transition = false;
            if (this._autoPanel) {
                this._panelLength = 'auto';
            }
        }
    }

    _getSpeed() {
        const m = /^([0-9]+)(s|ms)$/g.exec(this.speed);
        if (!m) {
            return 200;
        }
        return Number(m[2] === 's' ? 1000 * m[1] : m[1]);
    }

    _animationSpeed(speed, sizing) {
        const style = this.$.panelcntr.style;

        if (sizing) {
            style.transition = '';
        } else {
            style.transition = `${speed} width, ${speed} height`;
        }

        this._opacityAnim(speed, this.collapsed);
    }

    _opacityAnim(speed, collapsed) {
        const d = (this._getSpeed(speed) / 2) + 'ms';
        const t1 = `opacity ${d}`;
        const t2 = `opacity ${d} ${d}`;

        this.$.trigger.style.transition = collapsed ? t2 : t1;
        this.$.trigger2.style.transition = collapsed ? t1 : t2;
    }

    _clickOutsideToClose(clickOutsideToClose, _connected, collapsed, disableOutsideClickForMashupIDE) {
        if (clickOutsideToClose && _connected && !collapsed && !disableOutsideClickForMashupIDE) {
            requestAnimationFrame(() => {
                if (!this._close_ev && this.clickOutsideToClose && this._connected && !this.collapsed && !this.disableOutsideClickForMashupIDE) {
                    // Close the panel if the user clicks anywhere outside of it
                    this._close_ev = ev => {
                        for (let el = ev.srcElement; el; el = el.parentNode) {
                            if (el.parentNode === this) {
                                if (el.getAttribute && el.getAttribute('slot') === 'panel') {
                                    // Clicked in the panel content
                                    return;
                                }
                                break;
                            } else if (el === this) {
                                // Clicked in the shadow dom (=== panel)
                                return;
                            }
                        }
                        this.collapsed = true;
                    };
                    this._close_ev_scrim = () => {
                        this.collapsed = true;
                    };

                    document.addEventListener('click', this._close_ev);
                    this.$.scrim.addEventListener('click', this._close_ev_scrim);
                }
            });
        } else if (this._close_ev) {
            document.removeEventListener('click', this._close_ev);
            this.$.scrim.removeEventListener('click', this._close_ev_scrim);
            this._close_ev = null;
            this._close_ev_scrim = null;
        }
    }

    _keyDown(ev) {
        // Disable or do a sub-component have the focus?
        if (this.disabled || this.shadowRoot.activeElement) {
            return;
        }

        switch (ev.key) {
            /*
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'ArrowDown':
            case 'PageUp':
            case 'Home':
            case 'PageDown':
            case 'End':
            case 'Enter':
            */
            case ' ':
                if (PTCS.hasFocus(this)) {
                    this.collapsed = !this.collapsed;
                    ev.preventDefault();
                }
                break;
        }
    }


    // Work-around because the theming can't handle nested parts
    // Should fix this by improving the state mapping properties in the theme engine
    // Then the thumb could internally detect the hover state by '.hitarea:hover [part=~thumb]'
    _mouseEnter(ev) {
        if (!this.disabled) {
            this.hoverThumb = true;
            this._tooltipEnter(ev.target, ev.clientX, ev.clientY);
        }
    }

    _mouseLeave(ev) {
        this.hoverThumb = false;
        this._tooltipLeave(ev.target);
    }
};

PTCS.DynamicPanel._minPanelSize = 34;


customElements.define(PTCS.DynamicPanel.is, PTCS.DynamicPanel);

import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import {setTooltipByFocus} from 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';
import './ptcs-focus-overlay.js';


const _ptcsFocusOverlay = 'ptcs-focus-overlay';

// behaviour that uses the ptcs-focus-overlay
PTCS.BehaviorFocus = superClass => {

/************************ DelegatedFocus polyfill ************************/
    function tabIndex(el) {
        if (el.tabIndex >= 0) {
            return el.tabIndex;
        }
        switch (el.tagName) {
            case 'INPUT':
            case 'SELECT':
            case 'TEXTAREA':
            case 'BUTTON':
            case 'OBJECT':
                return 0;
            case 'A':
                return el.hasAttribute('href');
            //case 'AREA':
              // area elements are focusable if they:
              // - are inside a named map, and
              // - have an href attribute, and
              // - there is a visible image using the map
              // Ignore for now...
        }
        return -1;
    }

    function containerOf(el) {
        for (el = el.parentNode; el; el = el.parentNode) {
            if (el.nodeType === 11 && el.host) {
                return el.host;
            }
        }
        return document.body;
    }

    function focusOf(el) {
        for (; el; el = el.parentNode) {
            if (el.nodeType === 11 && el.host) {
                return el.host.shadowRoot.activeElement;
            }
        }
        return document.activeElement;
    }

    function selectNextFocus(cntr, el, backwards) {
        // tiCurr used to default to 0, which caused issues when stepping backwards
        // if the next component had a tabindex of 1 or higher...then it was never
        // considered a "candidate"...
        const defaultCurr = backwards ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        const tiCurr = el ? tabIndex(el) : defaultCurr; // Current value
        let before = el ? true : backwards; // Is looped element before el?
        let elBest;
        let tiBest;

        function candidate(ti, _el) {
            if (backwards) {
                if (ti > tiCurr) {
                    // Going backwards. Higher tabindexes are already behind
                    return false;
                }
                if (ti === tiCurr && !before) {
                    // Same tabindex. Based of DOM order
                    return false; // Only a candidate if tested element is before el
                }
            } else {
                if (ti < tiCurr) {
                    // Going forwards. Lower tabindexes are already behind
                    return false;
                }
                if (ti === tiCurr && before) {
                    // Same tabindex. Based of DOM order
                    return false; // Only a candidate if tested element is after el
                }
            }
            // Only focus on visible elements
            return (_el.clientWidth > 0 || _el.clientHeight > 0);
        }

        function better(ti) {
            return backwards ? tiBest <= ti : tiBest > ti;
        }

        function loop(e) {
            for (e = e.firstChild; e; e = e.nextSibling) {
                if (e === el) {
                    before = false;
                } else {
                    const ti = tabIndex(e);
                    if (ti >= 0 && candidate(ti, e) && (!elBest || better(ti))) {
                        elBest = e;
                        tiBest = ti;
                    }
                }
                loop(e);
            }
        }

        loop(cntr);
        return elBest;
    }

    function delegateToLast(el) {
        for (;;) {
            let subEl = selectNextFocus(el.shadowRoot || el, null, true);
            if (!subEl) {
                break;
            }
            el = subEl;
        }
        for (; el; el = containerOf(el)) {
            el.focus();
            if (focusOf(el) === el) {
                return true;
            }
            console.warn('Failed to focus on ' + el.tagName + '. Focus on parent');
        }
        return false;
    }

    function delegateToPrev(el) {
        const cntr = containerOf(el);
        const prevEl = selectNextFocus(cntr.shadowRoot || cntr, el, true);
        if (prevEl) {
            return delegateToLast(prevEl);
        }
        for (let e = el.parentNode; e; e = e.parentNode) {
            if (e.nodeType === 11 && e.host) {
                if (e.host._isFocusDelegating && e.host._isFocusDelegating()) {
                    return delegateToPrev(e.host);
                }
                e.host.focus();
                if (focusOf(e.host) === e.host) {
                    return true;
                }
                console.warn('Failed to focus on ' + e.host.tagName);
                return delegateToPrev(e.host);
            }
        }
        return false;
    }


    // Focus event handler for polyfilled component that delegates focus
    function delegatingFocusEv(ev) {
        const el = ev.target;

        // Someone used the keyboard. Make sure focus didn't slip (if Shift-Tab)
        function keyUp(e) {
            if (!el.shadowRoot.activeElement && e.shiftKey && e.key === 'Tab') {
                if (!delegateToPrev(el)) {
                    el.blur();
                }
            }
        }

        // Someone clicked on the component. Make sure focus didn't slip
        function mouseUp() {
            if (!el.shadowRoot.activeElement) {
                const subEl = selectNextFocus(el.shadowRoot);
                if (subEl) {
                    subEl.focus();
                }
            }
        }

        el.addEventListener('keyup', keyUp);
        el.addEventListener('mouseup', mouseUp);
        el.addEventListener('blur', () => {
            el.removeEventListener('keyup', keyUp);
            el.removeEventListener('mouseup', mouseUp);
            setTooltipByFocus(); // Just in case this element was stuck with the focus
        }, {once: true});

        // Delegate focus
        if (!el.shadowRoot.activeElement) {
            const subEl = selectNextFocus(el.shadowRoot);
            if (subEl) {
                subEl.focus();
            }
            if (!el.shadowRoot.activeElement) {
                // Delegating element stuck with focus. Must help tooltip
                setTooltipByFocus();
            }
        }
    }

    // Replacement for standard focus() when element delegates focus
    // If needed, delegates focus to the first focusable element in the shadow dom
    function focusFunc() {
        if (!this.shadowRoot.activeElement) {
            for (let el = selectNextFocus(this.shadowRoot); el; el = selectNextFocus(this.shadowRoot, el)) {
                el.focus();
                if (this.shadowRoot.activeElement) {
                    return; // Success
                }
                console.warn(this.tagName + ': could not forward focus to ' + el.tagName);
            }
            // Since we can't focus on _any_ sub element, we have to take the focus ourselves...
            Object.getPrototypeOf(this).focus.call(this);
        }
    }

    /************************ /DelegatedFocus ************************/

    function getFocusOverlayElem() {
        let el = document.getElementById(_ptcsFocusOverlay);
        if (!el) {
            el = document.createElement(_ptcsFocusOverlay);
            el.setAttribute('id', _ptcsFocusOverlay);
            document.body.appendChild(el);
        }
        return el;
    }

    function getVisibleArea(el) {
        let b = el.getBoundingClientRect();

        function parentOf(e) {
            return (e.nodeType === 11 && e.host) ? e.host : e.parentNode;
        }

        for (el = parentOf(el); el; el = parentOf(el)) {
            if (!el.getBoundingClientRect) {
                continue;
            }

            const cs = getComputedStyle(el);
            if (cs.overflow === 'visible') {
                continue;
            }

            const b1 = el.getBoundingClientRect();
            b = {
                left:   Math.max(b.left, b1.left),
                right:  Math.min(b.right, b1.right),
                top:    Math.max(b.top, b1.top),
                bottom: Math.min(b.bottom, b1.bottom),
            };
        }

        return {top: b.top, left: b.left, width: b.right - b.left, height: b.bottom - b.top};
    }

    // Show focus border for focused element
    function trackFocusWindow(el, preBoundHilite) {
        if (el !== PTCS.BehaviorFocus._focusEl) {
            return; // el has lost focus
        }

        function getHiliteEl(e) {
            if (!e.__elHilite) {
                return e;
            }
            if (typeof e.__elHilite === 'function') {
                return e.__elHilite();
            }
            return e.__elHilite;
        }

        const hiliteEl = getHiliteEl(el);
        if (hiliteEl) {
            const boundHilite = hiliteEl.getBoundingClientRect();
            boundHilite.__hiliteEl = hiliteEl;
            // Has element moved since we last drew a focus border?
            if (boundHilite.__hiliteEl !== preBoundHilite.__hiliteEl ||
                boundHilite.left !== preBoundHilite.left || boundHilite.top !== preBoundHilite.top ||
                boundHilite.right !== preBoundHilite.right || boundHilite.bottom !== preBoundHilite.bottom) {
                const b1 = document.documentElement.getBoundingClientRect();
                const VisibleBoundHilite = getVisibleArea(hiliteEl);
                getFocusOverlayElem().show(hiliteEl, {
                    x: VisibleBoundHilite.left - b1.left,
                    y: VisibleBoundHilite.top - b1.top,
                    w: VisibleBoundHilite.width,
                    h: VisibleBoundHilite.height
                });
                // Notify the tooltip behavior that a new element is hilited
                setTooltipByFocus(hiliteEl);
            }
            requestAnimationFrame(() => trackFocusWindow(el, boundHilite));
        } else {
            getFocusOverlayElem().hide();
            requestAnimationFrame(() => trackFocusWindow(el, {}));
        }
    }

    // Callback for focus event
    function focusEv(ev) {
        const el = ev.target;

        setTooltipByFocus();

        PTCS.BehaviorFocus._focusEl = el;

        if (typeof el._notifyFocus === 'function') {
            el._notifyFocus();
        }

        trackFocusWindow(el, {});
    }

    // Callback for blur event
    function blurEv(ev) {
        const el = ev.target;

        PTCS.BehaviorFocus._focusEl = null;

        setTooltipByFocus();

        getFocusOverlayElem().hide();

        if (typeof el._notifyBlur === 'function') {
            el._notifyBlur();
        }
    }

    function tabindexChanged(tabindex) {
        switch (typeof tabindex) {
            case 'number':
                this._delegatedFocus = `${tabindex}`;
                break;
            case 'string':
                this._delegatedFocus = tabindex;
                break;
            case 'boolean':
                this._delegatedFocus = tabindex ? '0' : undefined;
                break;
            default:
                this._delegatedFocus = undefined;
        }
    }

    return class extends superClass {
        static get properties() {
            return {
                // Watch changes to the tabindex attribute
                tabindex: {
                    type: String
                }
            };
        }

        // Should this component delegate focus?
        _isFocusDelegating() {
            const properties = this.constructor.properties;
            return !!(properties && properties._delegatedFocus);
        }

        // Try to use Chromium delegatesFocus feature for focus delegating components
        /*
        _attachDom(dom) {
            if (this._isFocusDelegating() && dom && this.attachShadow && !this.shadowRoot) {
                this.attachShadow({mode: 'open', delegatesFocus: true});
                this.shadowRoot.appendChild(dom);
            }
            return super._attachDom(dom);
        }
        */

        // Track focus on el and put the focus border around elHilite
        _trackFocus(el, elHilite) {
            if (elHilite && elHilite !== el) {
                el.__elHilite = elHilite;
            }
            el.addEventListener('focus', focusEv);
            el.addEventListener('blur', blurEv);
        }

        _untrackFocus(el) {
            el.removeEventListener('focus', focusEv);
            el.removeEventListener('blur', blurEv);
        }

        _setupDelegateFocus() {
            // tabindex
            this.$__tabindexChanged = tabindexChanged;
            this._createMethodObserver('$__tabindexChanged(tabindex)', false);

            if (this.tabindex !== undefined) {
                this.$__tabindexChanged(this.tabindex);
            }

            // Need polyfill for delegatesFocus?
            if (!this.shadowRoot.delegatesFocus) {
                this.addEventListener('focus', delegatingFocusEv);

                // Replace focus function
                this.focus = focusFunc;
            }
        }

        ready() {
            super.ready();

            // Setup component
            if (this._isFocusDelegating()) {
                // This component delegates its focus
                this._setupDelegateFocus();
            } else if (typeof this._initTrackFocus === 'function') {
                // This component wants to initialize the focus tracking itself
                this._initTrackFocus();
            } else {
                // This component uses the default focus tracking
                this._trackFocus(this);
            }

            // Listen to <space> key?
            if (this._spaceActivate) {
                this.addEventListener('keypress', ev => {
                    const key = ev.which || ev.keyCode;
                    if (key === 32) {
                        this.click();
                        ev.preventDefault();
                    }
                });
            }
        }
    };
};

// Global focus
PTCS.BehaviorFocus._focusEl = null;

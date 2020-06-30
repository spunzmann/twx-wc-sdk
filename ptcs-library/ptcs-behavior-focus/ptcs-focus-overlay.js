import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';


PTCS.FocusOverlay = class extends PTCS.BehaviorStyleable(PTCS.ShadowPart.ShadowPartMixin(PTCS.ThemableMixin(PolymerElement))) {
    static get template() {
        return html`
        <style>
        :host {
            position: absolute;
            z-index: 99997;
            pointer-events: none;
            box-sizing: border-box;
        }
        </style>`;
    }

    static get is() {
        return 'ptcs-focus-overlay';
    }

    hide() {
        this.style.display = 'none';
    }

    _getPadding(padding, defVal) {
        let retVal = defVal;
        if (padding) {
            const m = /^\s*(-?[0-9.]+)([a-zA-Z]*)\s*/g.exec(padding);
            if (m && (m[2] === '' || m[2] === 'px')) {
                const x = parseFloat(m[1]);
                if (!isNaN(x)) {
                    retVal = x;
                }
            }
        }
        console.assert(typeof retVal === 'number', 'Padding not a number');
        return retVal;
    }

    show(el, area) {
        if (!el || !area || !(area.w > 0) || !(area.h > 0)) {
            this.hide();
            return;
        }
        const style = this.style;

        // CSS variables may change dynamically, so we need to check every time
        const cs = getComputedStyle(el);

        // Padding (distance between focused element and the focus border)
        let paddingAll = this._getPadding(cs.getPropertyValue('--ptcs-focus-overlay--padding'), 8);

        let paddingLeft = this._getPadding(cs.getPropertyValue('--ptcs-focus-overlay--padding-left'), paddingAll);
        let paddingRight = this._getPadding(cs.getPropertyValue('--ptcs-focus-overlay--padding-right'), paddingAll);
        let paddingTop = this._getPadding(cs.getPropertyValue('--ptcs-focus-overlay--padding-top'), paddingAll);
        let paddingBottom = this._getPadding(cs.getPropertyValue('--ptcs-focus-overlay--padding-bottom'), paddingAll);

        // The _getPadding() call should always return the value as a number, any 'px' part will be removed...
        style.left = `${area.x - paddingLeft}px`;
        style.top = `${area.y - paddingTop}px`;
        style.width = `${area.w + paddingLeft + paddingRight}px`;
        style.height = `${area.h + paddingTop + paddingBottom}px`;

        // Style border
        style.borderStyle = cs.getPropertyValue('--ptcs-focus-overlay--border-style') || 'solid';
        style.borderWidth = cs.getPropertyValue('--ptcs-focus-overlay--border-width') || '2px';
        style.borderColor = cs.getPropertyValue('--ptcs-focus-overlay--border-color') || '#0094c8';
        style.borderRadius = cs.getPropertyValue('--ptcs-focus-overlay--border-radius') || '';
        style.outline = cs.getPropertyValue('--ptcs-focus-outline') || '';

        // Display focus
        style.display = 'block';
    }
};

customElements.define(PTCS.FocusOverlay.is, PTCS.FocusOverlay);


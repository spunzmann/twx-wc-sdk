import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-behavior-focus/ptcs-behavior-focus.js';
import 'ptcs-label/ptcs-label.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="ptcs-link-default-theme" theme-for="ptcs-link">
  <template>
      <style>
        :host([disabled]) [part=link]
        {
          cursor: auto;
          pointer-events: none;
        }
        :host(:not([disabled]):not([variant=label])) [part=link]
        {
          cursor: pointer;
        }
      </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

PTCS.Link = class extends PTCS.BehaviorTooltip(PTCS.BehaviorFocus(PTCS.ShadowPart.ShadowPartMixin(
    PTCS.BehaviorStyleable(PTCS.ThemableMixin(PolymerElement))))) {
    static get template() {
        return html`
    <style>
      :host {
        /*display: inline-block;*/
        display: inline-flex;
        justify-content: space-between;
        align-items: center;

        overflow: hidden;

        min-width: 34px;
        min-height: 19px;

        box-sizing: border-box;

        align-items: flex-start;
        overflow: auto
      }

      a {
        display: inline-flex;

        width: 100%;
      }

      [part=label] {
        width: inherit;

        text-decoration: inherit;

        min-width: unset;
        min-height: unset;
      }
    </style>

    <a part="link" href\$="[[_compute_href(disabled, href)]]" target\$="[[_compute_target(target)]]"
       rel="nofollow noopener noreferrer" tabindex\$="[[_delegatedFocus]]">
      <ptcs-label part="label" id="label" on-click="_onClick" partmap="* label-*" label\$="[[label]]" multi-line="[[_multiLine(singleLine)]]"
	  horizontal-alignment\$="[[alignment]]" disable-tooltip no-wc-style=""></ptcs-label></a>
`;
    }

    static get is() {
        return 'ptcs-link';
    }

    static get properties() {
        return {
            href: {
                type:     String,
                observer: '_hrefChanged'
            },

            target: {
                type: String
            },

            label: {
                type:  String,
                value: 'Link'
            },

            variant: {
                type:               String,
                value:              'primary',
                reflectToAttribute: true
            },

            singleLine: {
                type:  Boolean,
                value: false
            },

            disabled: {
                type:               Boolean,
                value:              false,
                reflectToAttribute: true
            },

            ariaDisabled: {
                type:               String,
                computed:           '_compute_ariaDisabled(disabled)',
                reflectToAttribute: true
            },

            alignment: {
                type: String
            },

            textMaximumWidth: {
                type:     String,
                observer: '_textMaximumWidth_changed'
            },

            _delegatedFocus: {
                type:  String,
                value: null
            }
        };
    }

    // Implements ptcs-link's tooltip behavior on label truncation
    _monitorTooltip() {
        const label = this.shadowRoot.querySelector('[part=label]');
        if (label && label.isTruncated()) {
            if (!this.tooltip) {
                return this.label;
            } else if (this.tooltip !== this.label) {
                // Truncated label with a tooltip (not identical to the label), show both
                return this.label + '\n\n' + this.tooltip;
            }
        } else if (this.tooltip === this.label) {
            return '';
        }
        return this.tooltip || '';
    }

    ready() {
        super.ready();

        const link = this.shadowRoot.querySelector('[part=link]');
        this._trackFocus(link, this);

        // Custom tooltip func
        this.tooltipFunc = this._monitorTooltip;

        link.addEventListener('keypress', ev => {
            const key = ev.which || ev.keyCode;
            if (key === 32 && !this.disabled) {
                link.click();
                ev.preventDefault();
            }
        });
    }

    _multiLine(singleLine) {
        if (singleLine) {
            return false;
        }
        return true;
    }

    _hrefChanged(href) {
        if (!PTCS.validateURL(href)) {
            console.warn('[ptcs-link]XSS prevention: URL includes the protocol "javascript:"');
        }
    }

    _compute_href(disabled, href) {
        if (disabled || !href) {
            return false;
        }
        return PTCS.validateURL(href) ? (encodeURI(href) || '#') : '';
    }


    _compute_target(target) {
        switch (target) {
            case '_self':
            case '_blank':
            case '_parent':
            case '_top':
                return target;

            case 'same':
                return '_self';

            case 'new':
                return '_blank';

            case '_popup':
            case 'popup':
                return 'PopupWindow';
        }

        return '_self';
    }


    _onClick(ev) {
        if (!this.href || this.disabled || !PTCS.validateURL(this.href)) {
            ev.preventDefault();
            return;
        }

        let trgt = this._compute_target(this.target);
        if (trgt === 'PopupWindow') {
            ev.preventDefault();
            let wnd = PTCS.openUrl('open', this.href, 'PopupWindow', 'height=450,width=700');
            if (wnd) {
                wnd.focus();
            }
        } else {
            let bRequireReload = trgt !== '_self';
            PTCS.keepHashForSSORedirect(this.href, bRequireReload); // <a href> doen't call to openUrl but _onClick helps us to manage #-part (SSO)
        }

    }

    _compute_ariaDisabled(disabled) {
        return disabled ? 'true' : false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._connected = false;
    }

    _textMaximumWidth_changed(val) {
        if (val) {
            var unitTest = val + '';
            if (unitTest.indexOf('px') === -1) {
                this.$.label.style.maxWidth = val + 'px';
            } else {
                this.$.label.style.maxWidth = val;
            }
        } else {
            this.$.label.style.maxWidth = '';
        }
    }
};

customElements.define(PTCS.Link.is, PTCS.Link);

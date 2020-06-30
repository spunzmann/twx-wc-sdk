import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-checkbox/ptcs-checkbox.js';
import 'ptcs-link/ptcs-link.js';
import 'ptcs-behavior-tooltip/ptcs-behavior-tooltip.js';

const shady = window.ShadyCSS && !window.ShadyCSS.nativeShadow;
const shadyCls = shady ? 'style-scope ptcs-list' : '';
PTCS.ListItem = class extends PTCS.BehaviorTooltip(PolymerElement) {
    static get is() {
        return 'ptcs-list-item';
    }

    static get properties() {
        return {
            label: {
                type:     String,
                observer: '_labelChanged'
            },

            hint: {
                type: String
            },

            labelMeta: {
                type:     String,
                observer: '_labelMetaChanged'
            },

            itemMeta: {
                type: Object
            },

            alignment: { // 'left', 'center', 'right'
                type:     String,
                value:    'left',
                observer: '_alignmentChanged'
            },

            selected: {
                type:               Boolean,
                notify:             true,
                reflectToAttribute: true,
                observer:           '_selectedChanged'
            },

            disabled: {
                type:               Boolean,
                reflectToAttribute: true,
                observer:           '_disabledChanged'
            },

            multiSelect:
            {
                type:     Boolean,
                observer: '_multiSelectChanged'
            },

            multiLine: {
                type:     Boolean,
                observer: '_multiLineChanged'
            }
        };
    }

    static get observers() {
        return ['_itemMetaChanged(itemMeta.*)'];
    }

    ready() {
        super.ready();
        this.tooltipFunc = this._monitorTooltip;
        this.addEventListener('click', (e) => {
            if (this.disabled) {
                e.stopPropagation();
                return;
            }

            if (this.selected) {
                if (this.multiSelect) {
                    this.selected = false;
                }
            } else {
                this.selected = true;
            }
        });
    }

    _monitorTooltip() {
        if (this.firstChild && this.firstChild.firstChild) {
            const itemLabel = this.firstChild.firstChild;
            if (itemLabel.tooltip) {
                return itemLabel.tooltip;
            }
            if (typeof itemLabel.tooltipFunc === 'function') {
                return itemLabel.tooltipFunc();
            }
        }
        return '';
    }

    // Set boolean attribute
    _setbattr(el, attr, value) {
        if (!el) {
            return;
        }

        if (value) {
            el.setAttribute(attr, '');
        } else {
            el.removeAttribute(attr);
        }
    }

    // Set value attribute
    _setvattr(el, attr, value) {
        if (value) {
            el.setAttribute(attr, value);
        } else {
            el.removeAttribute(attr);
        }
    }

    // Get item type
    _type() {
        if (this.hint === this.label) {
            return 'text';
        }
        return this.itemMeta ? this.itemMeta.type : 'text';
    }

    _getCheckbox() {
        let el = this.querySelector('[part=item-checkbox]');

        if (!el && this.multiSelect) {

            el = document.createElement('ptcs-checkbox');
            el.setAttribute('part', 'item-checkbox');
            el.checked = this.selected;
            el.disabled = this.disabled;

            el.addEventListener('checked-changed', ev => {
                this.selected = ev.detail.value;
            });

            el.addEventListener('click', ev => {
                ev.stopPropagation();
            });

            if (shadyCls) {
                el.setAttribute('class', shadyCls);
            }

            if (PTCS.isIE || PTCS.isEdge) {
                let cntr = document.createElement('div');
                cntr.setAttribute('class', `center-checkbox ${shadyCls}`);
                cntr.appendChild(el);
                this.appendChild(cntr);
            } else {
                // Shady DOM fix
                this.appendChild(el);
            }
        }

        return el;
    }

    _createItem(type) {
        if (this.label === this.hint) {
            type = 'text';
        }
        let el;
        switch (type) {
            case undefined: // Default to 'text'
            case 'text':
                el = document.createElement('ptcs-label');
                el.setAttribute('variant', 'list-item');
                if (this.label) {
                    el.label = this.label;
                }
                if (this.disabled) {
                    el.setAttribute('disabled', '');
                }
                el.multiLine = this.multiLine;
                break;

            case 'link':
                el = document.createElement('ptcs-link');
                el.setAttribute('variant', 'primary');
                if (this.label.href) {
                    el.setAttribute('href', encodeURI(this.label.href));
                }
                if (this.disabled) {
                    el.setAttribute('disabled', '');
                }
                if (this.label.label) {
                    el.setAttribute('label', this.label.label);
                }
                if (this.itemMeta.target) {
                    el.setAttribute('target', this.itemMeta.target);
                }
                break;

            case 'image':
                el = document.createElement('img');
                if (this.label) {
                    el.setAttribute('src', this.label);
                }
                if (this.disabled) {
                    el.setAttribute('disabled', '');
                }
                break;

            case 'checkbox':
                el = document.createElement('ptcs-checkbox');
                el.checked = this.label ? (this.label !== 'false') : false;
                el.setAttribute('disabled', '');
                break;

            case 'html':
                el = document.createElement('span');
                if (this.label) {
                    el.innerHTML = this.label;
                }
                if (this.disabled) {
                    el.setAttribute('disabled', '');
                }
                break;

            case 'function':
                if (this.label) {
                    el = this.label(this.disabled);
                }
                break;

            default:
                throw Error(`Unknown list item type: ${type}`);
        }

        const containerEl = document.createElement('div');
        containerEl.setAttribute('part', 'item-value');

        // Shady DOM fix
        if (shadyCls) {
            containerEl.setAttribute('class', shadyCls);
        }
        containerEl.__type = type;

        if (this.selected) {
            containerEl.setAttribute('selected', '');
        }
        if (this.alignment) {
            this._setAlignment(containerEl, this.alignment);
        }
        containerEl.appendChild(el);

        return containerEl;
    }

    _getItem() {
        let el = this.querySelector('[part=item-value]');

        if (!el) {
            el = this._createItem(this._type());

            if (PTCS.isIE || PTCS.isEdge) {
                el.setAttribute('class', `center-item-value ${shadyCls}`);
                this.appendChild(el);
            } else {
                // Shady DOM fix
                if (shadyCls) {
                    el.setAttribute('class', shadyCls);
                }
                this.appendChild(el);
            }
        }

        return el;
    }

    _getInternalItem() {
        let el = this._getItem();
        if (el && el.firstChild) {
            return el.firstChild;
        }

        return null;
    }

    _getMeta() {
        let el = this.querySelector('[part=item-meta]');

        if (!el && this.labelMeta) {

            el = document.createElement('ptcs-label');
            el.setAttribute('part', 'item-meta');
            if (!this.labelMeta) {
                el.setAttribute('hidden', '');
            }

            if (this.disabled) {
                el.setAttribute('disabled', '');
            }

            el.label = this.labelMeta;
            el.multiLine = this.multiLine;
            el.horizontalAlignment = this.alignment;
            if (shadyCls) {
                el.setAttribute('class', shadyCls);
            }
            this.appendChild(el);
        }

        return el;
    }

    _itemMetaChanged(cr) {
        if (this.label === this.hint) {
            return; // ignore type modification for the hint
        }

        switch (cr.path) {
            case 'itemMeta':
                this._itemMetaTypeChanged(cr.value ? cr.value.type : 'text');
                break;

            case 'itemMeta.type':
                this._itemMetaTypeChanged(cr.value);
                break;
        }
    }

    _itemMetaTypeChanged(type) {
        let el = this._getItem();

        if (el.__type !== type) {
            let el2 = this._createItem(type);
            el.parentNode.insertBefore(el2, el);
            el.parentNode.removeChild(el);
        }
    }

    _labelChanged(label) {
        const type = this._type();

        let el = this._getItem();

        if (el.__type !== type || type === 'function') {
            let el2 = this._createItem(type);
            el.parentNode.insertBefore(el2, el);
            el.parentNode.removeChild(el);
            return;
        }

        el = this._getInternalItem();
        switch (type) {
            case 'text':
                el.label = label;
                break;

            case 'link':
                this._setvattr(el, 'href', encodeURI(label.href));
                this._setvattr(el, 'label', label.label);
                break;

            case 'checkbox':
                el.checked = label ? (this.label !== 'false') : false;
                break;

            case 'image':
                this._setvattr(el, 'src', label);
                break;

            case 'html':
                el.innerHTML = label;
                break;
        }
    }

    _labelMetaChanged(labelMeta) {
        let el = this._getMeta();

        if (!el) {
            return;
        }

        // Has visibiliy changed?
        if (!labelMeta !== !el.label) {
            this._setbattr(el, 'hidden', !labelMeta);
        }

        // Update label
        el.label = labelMeta;
    }

    _multiSelectChanged(multiSelect) {
        if (multiSelect) {
            // Request multiselect checkbox, to make sure it is created
            this._getCheckbox();
        }
    }

    _multiLineChanged(multiLine) {
        const type = this._type();
        let el = this._getMeta();

        if (el) {
            el.multiLine = multiLine;
        }

        if (type === 'text') {
            this._getInternalItem().multiLine = multiLine;
        }
    }

    _alignmentChanged(alignment) {
        let el = this._getItem();
        this._setAlignment(el, alignment);
    }

    _setAlignment(el, alignment) {
        switch (alignment) {
            case 'left':
                el.style.justifyContent = 'flex-start';
                break;
            case 'right':
                el.style.justifyContent = 'flex-end';
                break;
            case 'center':
                el.style.justifyContent = 'center';
                break;
            default:
                el.style.justifyContent = 'flex-start'; // behaves as left
        }

        el = this._getMeta();
        if (el) {
            el.horizontalAlignment = this.alignment;
        }
    }

    _selectedChanged(selected) {
        let el = this._getCheckbox();
        if (el) {
            el.checked = selected;
        }

        this._setbattr(this._getItem(), 'selected', selected);
    }

    _disabledChanged(disabled) {
        const type = this._type();

        // Checkbox
        let el = this._getCheckbox();
        if (el) {
            el.disabled = disabled;
        }

        // Update item
        switch (type) {
            case 'text':
            case 'link':
            case 'image':
            case 'html':
                this._setbattr(this._getItem(), 'disabled', disabled);
                this._setbattr(this._getInternalItem(), 'disabled', disabled);
                this._setbattr(this._getMeta(), 'disabled', disabled);
                break;
            case 'function': {
                this._setbattr(this._getItem(), 'disabled', disabled);
                let linkEls = this.querySelectorAll('ptcs-link');
                _.forEach(linkEls, linkEl => {
                    linkEl.disabled = disabled;
                });
                break;
            }
        }
    }
};

customElements.define(PTCS.ListItem.is, PTCS.ListItem);

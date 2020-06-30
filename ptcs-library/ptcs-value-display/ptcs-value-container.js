import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import 'ptcs-shadow-style/shadow-part.js';
import 'ptcs-behavior-styleable/ptcs-behavior-styleable.js';
import 'ptcs-link/ptcs-link.js';
import 'ptcs-label/ptcs-label.js';
import 'ptcs-checkbox/ptcs-checkbox.js';
import 'ptcs-textfield/ptcs-textfield.js';
import 'ptcs-image/ptcs-image.js';
import 'ptcs-modal-image-popup/ptcs-modal-image-popup.js';

PTCS.ValueContainer = class extends PolymerElement {
    static get is() {
        return 'ptcs-value-container';
    }

    static get properties() {
        return {

            // The data to render
            label: {
                type: String
            },

            defaultText: {
                type: String,
            },

            labelHeight: { // Actual height of the label (used to for image popup-height constraint)
                type: Number
            },

            // The data type
            itemMeta: {
                type:  Object,
                value: {type: 'text'}
            },

            // The data type string value
            valueType: {
                type:               String,
                reflectToAttribute: true
            },

            alignment: { // 'left', 'center', 'right'
                type:     String,
                value:    'left',
                observer: '_alignmentChanged'
            },

            disabled: {
                type:               Boolean,
                reflectToAttribute: true,
                observer:           '_disabledChanged'
            },

            overflowOption: {
                type: String
            },

            // Allow text content to wrap in the renderer?
            textWrap: {
                type: Boolean
            },

            // Max width (all lengths in pixels). This is resolved from parent maxWidth or width
            maxWidth: {
                type: Number
            },

            // Fixed width constraint
            width: {
                type: Number
            },

            // Fixed height constraint
            maxHeight: {
                type: Number
            },

            // Modal backdrop related properties follow
            backdropColor: {
                type: String
            },

            backdropOpacity: {
                type: Number
            }

        };
    }

    static get observers() {
        return ['_itemMetaChanged(itemMeta, itemMeta.type, itemMeta.baseType, label)',
            '_constraintsChanged(textWrap, maxWidth, maxHeight, labelHeight, overflowOption)',
            '_displayLabelChanged(label, defaultText)'];
    }

    _displayLabelChanged(label, defaultText) {
        if (label) {
            if (this._overflowOption) {
                // Restore the previous overflowOption value
                this.overflowOption = this._overflowOption;
                let el = this.querySelector('[part=item-value]').shadowRoot.querySelector('[part=root]');
                if (el) {
                    // Earlier switch of ptcs-label to multiline ellipsis truncation causes a class value and height
                    // constraint leftover to remove from ptcs-label part="root"
                    el.classList.remove('overflow_showmore');
                    el.style.maxHeight = '';
                }
            }
            this._labelChanged(label);
        } else {
            // No text to show: Do we have fallback default text?
            if (defaultText) {
                // Store a copy of the actual overflowOption before switching to 'ellipsis' for multiline truncation overflow
                if (this.overflowOption !== 'ellipsis') {
                    this._overflowOption = this.overflowOption;
                    this.overflowOption = 'ellipsis';
                }
            }
            // Need to set the label regardless of param being empty or not
            this._labelChanged(defaultText);
        }
        this.dispatchEvent(new CustomEvent('check-overflow', {bubbles: true, composed: true, detail: {}}));
    }

    // _getContainerType indirectly uses the later params as well, invoke it on any change
    _itemMetaChanged(itemMeta, itemMetaType, itemMetaBaseType, label) {
        if (itemMeta) {
            itemMeta.type = this._getContainerType(itemMeta);
            this._itemMetaTypeChanged(itemMeta.type);
        }
    }

    _constraintsChanged(wrap, mw, mh, lh, dc) {
        let el = this.querySelector('[part=item-value]');
        if (this.valueType === 'link') {
            el.singleLine = !wrap;
        } else {
            el.multiLine = wrap;
        }
        if (this.valueType === 'image') {
            if (mw) {
                let imgW = mw - 36 > 0 ? mw - 36 : 18; // 18 px plus padding 8px left / right = 34
                el.width = imgW; // less padding
            }
            if (mh) {
                // Allow room for ptcs-modal-image-popup's own disclosure button + padding and leave space for key label
                let imgH = mh - this.labelHeight - 36 > 0 ? mh - this.labelHeight - 36 : 18;
                el.height = imgH;
            }
        } else { // not image
            if (mw) {
                if (this.valueType === 'link') {
                    el.textMaximumWidth = mw;
                } else {
                    // Compensate for the 2 x 8px padding
                    el.maxWidth = mw - 16;
                }
            }
            if (mh) { // We are not using ptcs-label show more functionality so don't want to add max-height on ptcs-label unless multiline ellipsis
                if (this.valueType === 'text' && dc === 'ellipsis' && wrap) {
                    let maxH = mh - lh;
                    // Compensate for the 2 x 8px padding
                    el.maxHeight = maxH - 16;
                    el.disclosureControl = 'ellipsis';
                } else if (this.valueType !== 'text') {
                    el.maxHeight = mh;
                }
            }
        }
    }

    _itemMetaTypeChanged(type) {
        let el, containerEl = this._getItem();

        if (!containerEl) {
            return; // not ready
        }

        if (containerEl && containerEl.firstChild) {
            el = containerEl.firstChild;
        }

        if (containerEl.__type !== type) {
            let newEl = this._createItem(type);

            if (newEl) {
                containerEl.insertBefore(newEl, el);
                containerEl.removeChild(el);
            }
        }
    }

    // Get item type
    _type() {
        return this._getContainerType(this.itemMeta);
    }

    // Returns the part=item-value parent of the web component or span content holder
    _getItem() {
        const type = this._type();
        if (!type) {
            return null; // Not ready
        }

        let containerEl = this.querySelector('[part=item-value-container]');

        if (!containerEl) {
            containerEl = this._createItemContainer(type);
            let el = this._createItem(type);

            containerEl.appendChild(el);

            if (PTCS.isIE || PTCS.isEdge) {
                let cntr = document.createElement('div');
                cntr.setAttribute('class', 'center-item-value');
                cntr.appendChild(containerEl);
                this.appendChild(cntr);
            } else {
                this.appendChild(containerEl);
            }
        }

        return containerEl;
    }

    // Returns the first child of part=item-value i.e. ptcs-label, ptcs-image, etc if exists
    _getInternalItem() {
        let el = this._getItem();
        if (el && el.firstChild) {
            return el.firstChild;
        }

        return null;
    }

    _createItem(type) {
        let el;
        switch (type) {
            case 'text':
                el = document.createElement('ptcs-label');
                el.label = this.label || '';
                if (this.textWrap) {
                    el.multiLine = true;
                }
                if (this.maxWidth) {
                    el.maxWidth = this.maxWidth;
                }
                el.disabled = this.disabled;
                el.variant = 'body';
                if (this.overflowOption === 'ellipsis') {
                    el.disclosureControl = 'ellipsis';
                }

                el.disableTooltip = true;

                if (this.overflowOption === 'ellipsis' && this.multiLine && this.maxHeight > 0) {
                    let maxH = this.maxHeight - this.labelHeight;
                    el.maxHeight = maxH;
                }
                break;

            case 'password':
                el = document.createElement('ptcs-textfield');
                el.text = this.label;
                el.password = true;
                el.readOnly = true;
                break;

            case 'link':
                el = document.createElement('ptcs-link');
                el.variant = 'primary';
                if (this.label.href) {
                    el.href = encodeURI(this.label.href);
                }
                if (this.disabled) {
                    el.disabled = true;
                }
                if (this.label.label) {
                    el.label = this.label.label;
                }
                if (this.itemMeta.target) {
                    el.target = this.itemMeta.target;
                }
                if (!this.textWrap) {
                    el.singleLine = true;
                }
                if (this.maxWidth) {
                    el.textMaximumWidth = this.maxWidth;
                }
                break;

            case 'image':
                el = document.createElement('ptcs-modal-image-popup'); // Modal dialog with pop-up functionality
                el.src = this.label;
                if (this.maxHeight) {
                    // Maximum height less the vertical space used by key label, padding, disclosure button
                    let imgh = this.maxHeight - this.labelHeight - 43;
                    let imgHeight = imgh > 0 ? imgh : 70; // Smallest image size with disclosure button
                    el.height = imgHeight;
                }
                if (this.maxWidth) {
                    el.width = this.maxWidth > 35 ? this.maxWidth : 36; // Smallest image size + disclosure button;
                    if (el.height * 1.8 > el.width) {
                        el.height = el.width * 1.8; // Re-adjust height to fit the thumbnail geometry
                    }
                }
                if (this.backdropColor) {
                    el.backdropColor = this.backdropColor;
                }
                if (this.backdropOpacity) {
                    el.backdropOpacity = this.backdropOpacity;
                }
                break;

            case 'checkbox':
                el = document.createElement('ptcs-checkbox');
                el.checked = this.label ? (this.label !== 'false') : false;
                el.setAttribute('style', 'pointer-events: none;'); // Disallow checkbox functionality
                el.disabled = true;
                break;

            case 'html':
                el = document.createElement('span');
                if (this.label) {
                    el.innerHTML = this.label;
                }
                if (this.disabled) {
                    el.disabled = true;
                }
                break;

            case 'function':
                if (this.label) {
                    el = this.label(this.disabled);
                } else {
                    el = document.createElement('span');
                }
                break;
            default:
                throw Error(`Unknown value item type: ${type}`);
        }
        el.setAttribute('part', 'item-value');

        return el;
    }

    _createItemContainer(type) {
        let containerEl = document.createElement('div');
        containerEl.part = 'item-value-container';

        containerEl.__type = type;
        if (this.alignment) {
            this._setAlignment(containerEl, this.alignment);
        }

        return containerEl;
    }

    _labelChanged(label) {
        const type = this._type();
        let el, containerEl = this._getItem();

        if (!type || !containerEl) {
            return; // Not ready
        }

        if (containerEl && containerEl.firstChild) {
            el = containerEl.firstChild;
        }

        if (containerEl.__type !== type) {
            let newEl = this._createItem(type);

            if (newEl) {
                containerEl.insertBefore(newEl, el);
                containerEl.removeChild(el);
            }

            el = newEl;
        }

        switch (type) {
            case 'text':
                el.label = label;
                break;

            case 'password':
                el.label = label;
                break;

            case 'link':
                el.href = encodeURI(label.href);
                el.label = label.label;
                break;

            case 'checkbox':
                el.checked = label ? (this.label !== 'false') : false;
                break;

            case 'image':
                el.src = label;
                break;

            case 'html':
                el.innerHTML = label;
                break;
        }
    }

    _alignmentChanged(alignment) {
        let el = this._getItem();
        if (!el) {
            return; // not ready
        }
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
                el.style.justifyContent = 'flex-start'; // Default is left
        }

    }


    _disabledChanged(disabled) {
        const type = this._type();
        if (!type) {
            return; // Not ready
        }

        // Update item
        switch (type) {
            case 'text':
            case 'password':
            case 'link':
            case 'image':
            case 'checkbox':
            case 'html':
                this._setbattr(this._getItem(), 'disabled', disabled);
                this._setbattr(this._getInternalItem(), 'disabled', disabled);
                break;
            case 'function': {
                this._setbattr(this._getItem(), 'disabled', disabled);
                // Binding can make list disabled. In that case you have to prevent link activation
                let linkEls = this.querySelectorAll('ptcs-link');
                _.forEach(linkEls, linkEl => {
                    linkEl.disabled = disabled;
                });
                break;
            }
        }
    }


    // Set boolean attribute
    _setbattr(el, attr, value) {
        if (el && el.setAttribute) {
            if (value) {
                el.setAttribute(attr, '');
            } else {
                el.removeAttribute(attr);
            }
        }
    }

    // Set value attribute
    _setvattr(el, attr, value) {
        if (el && el.setAttribute) {
            if (value) {
                el.setAttribute(attr, value);
            } else {
                el.removeAttribute(attr);
            }
        }
    }

    _getContainerType(itemMeta) {
        if (!itemMeta) {
            return undefined;
        }
        if (itemMeta.type) {
            return itemMeta.type;
        }
        if (!itemMeta.baseType) {
            return undefined;
        }

        if (!itemMeta.formatterStruct) {
            itemMeta.formatterStruct = {renderer: itemMeta.baseType};
        }
        itemMeta.type = PTCS.Formatter.getContainerType(itemMeta.baseType, itemMeta.formatterStruct);
        return itemMeta.type;
    }
};

customElements.define(PTCS.ValueContainer.is, PTCS.ValueContainer);

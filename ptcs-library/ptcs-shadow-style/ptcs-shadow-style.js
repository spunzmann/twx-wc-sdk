import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import {templatize} from '@polymer/polymer/lib/utils/templatize.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {animationFrame} from '@polymer/polymer/lib/utils/async.js';
/**
* @class
* @extends {Polymer.Element}
*/
PTCS.ShadowStyleTemplate = class ShadowStyleTemplate extends PolymerElement {
    static get is() {
        return 'ptcs-shadow-style-template';
    }

    static get template() {
        return null;
    }

    static get properties() {
        return {
            /** @type {string} */
            id: {
                type:               String,
                reflectToAttribute: true
            },
            /** @type {string[]} */
            cssText: {
                type: Array
            },
            /** @type {HTMLTemplateElement} */
            template: {
                type: Object
            },
            force: {
                type:     Boolean,
                observer: '_forceInject'
            },
            /** @type {PTCS.ShadowStyle} */
            host: {
                type: Object
            }
        };
    }

    static get observers() {
        return ['_observeChanges(id,template,host,cssText)'];
    }

    constructor() {
        super();
        this.__instances = [];
        this.__ctor = null;
    }

    __ensureTemplatized() {
        // Templatizing (generating the instance constructor) needs to wait
        // until ready, since won't have its template content handed back to
        // it until then
        if (!this.__ctor) {
            // Template instance props that should be excluded from forwarding
            let instanceProps = {};
            let instances = this.__instances;
            //        instanceProps['id'] = true;
            //        instanceProps['cssText'] = true;
            //        instanceProps['force'] = true;
            this.__ctor = templatize(this.template, this, {
                parentModel:     true,
                instanceProps:   instanceProps,
                /**
       * @this {this}
       * @param {string} prop Property to set
       * @param {*} value Value to set property to
       */
                forwardHostProp: function(prop, value) {
                    for (let inst of instances) {
                        inst.forwardHostProp(prop, value);
                    }
                }
            });
        }
        return true;
    }

    __stampInstance() {
        let model = {};
        model['id'] = this.id;
        model['cssText'] = this.cssText;
        model['trigger'] = this.trigger;
        let inst = new this.__ctor(model);
        this.__instances.push(inst);
        return inst;
    }


    ready() {
        super.ready();
        let template = this.template = /** @type {HTMLTemplateElement} */(this.querySelector('template'));
        if (!template) {
            // // Wait until childList changes and template should be there by then
            let observer = new MutationObserver(() => {
                let _template = this.querySelector('template');
                if (_template) {
                    observer.disconnect();
                    this.template = _template;
                } else {
                    throw new Error(this.constructor.is + 'requires a <template> child');
                }
            });
            observer.observe(this, {childList: true});
        } else {
            this.template = template;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.host = this.getHost();
    }

    _forceInject(force) {
        if (force) {
            this._observeChanges(this.id, this.template, this.host, this.cssText);
        }
    }

    _observeChanges(id, template, host) {
        if (id && template && host) {
            this.__ensureTemplatized();
            this.injectAll(id, template);
        }
    }

    getHost() {
        return this.getRootNode().host;
    }

    /**
 * @returns {Node}
 */
    getTree() {
        return this.getHost().getTree();
    }

    /**
 * @param {HTMLElement} element
 * @param {HTMLTemplateElement} template
 */
    inject(element) {
        let instance = this.__stampInstance();
        let shadowRoot = element.shadowRoot;
        shadowRoot.insertBefore(instance.root, shadowRoot.firstChild);
    }

    /**
 * @param {string} selector
 * @param {HTMLTemplateElement} template
 */
    injectAll(selector, template) {
        /** @type {NodeList} */
        let elements = this.getTree().querySelectorAll(selector);
        if (elements && elements.length) {
            for (let element of elements) {
                if (element.shadowRoot) {
                    this.inject(element, template);
                }
            }
        }
    }
};

customElements.define(PTCS.ShadowStyleTemplate.is, PTCS.ShadowStyleTemplate);

const shadowSelector = ' shadow ';
/**
* @class
* @extends {Polymer.Element}
*/
PTCS.ShadowStyle = class ShadowStyle extends PolymerElement {
    static get template() {
        return html`
  <dom-repeat items="[[_cssToInject]]">
    <template>
      <ptcs-shadow-style-template id="[[_styleId(item.selector)]]" css-text="[[item.css]]" force="[[force]]">
        <template>
          <ptcs-shadow-style id="[[id]]" css-text="[[cssText]]" force="[[force]]">
        </ptcs-shadow-style></template>
      </ptcs-shadow-style-template>
    </template>
  </dom-repeat>
`;
    }

    static get is() {
        return 'ptcs-shadow-style';
    }

    static get properties() {
        return {
            /** @type {HTMLStyleElement} */
            style: {
                type:     Object,
                observer: '_styleChanged'
            },
            /** @type {string[]} */
            cssText: {
                type:     Array,
                observer: '_cssTextChanged'
            },
            force: {
                type:     Boolean,
                observer: '_resetForce'
            },
            /** @typedef {{selector: string, css: string[]}} SelectorEntry */
            /** @type {SelectorEntry[]} */
            _cssToInject: {
                type:  Array,
                value: () => []
            },
            _sheet: {
                type:     Object,
                observer: '_sheetChanged'
            }
        };
    }

    /**
* @returns {Node}
*/
    getTree() {
        return this.getRootNode();
    }

    ready() {
        super.ready();
        this._init();
    }

    styleTree() {
        this.force = true;
    }

    _resetForce(value) {
        if (value) {
            animationFrame.run(() => {
                this.force = false;
                return false;
            });
        }
    }

    /**
* @param {string} selector
* @param {string} rule
*/
    _insertInjectionRule(selector, rule) {
        let selectorIndex = this._cssToInject.findIndex((entry) => selector === entry.selector);
        if (selectorIndex === -1) {
            selectorIndex = this.push('_cssToInject', {selector: selector, css: []}) - 1;
        }
        this.push(['_cssToInject', selectorIndex, 'css'], rule);
    }

    _cssTextChanged(value) {
        if (value && value.length) {
            /** @type {HTMLStyleElement} */
            let style = document.createElement('style');
            style.innerHTML = value.join('\n');
            this.style = (/** @type {HTMLElement} */ (this)).appendChild(style);
        }
    }

    _styleChanged(value) {
        if (value && value.sheet) {
            this._sheet = value.sheet;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.style && !this._sheet) {
            this._sheet = this.style.sheet;
        }
    }

    _sheetChanged() {
        this._initFromStyle();
    }

    _init() {
        let style = /** @type {HTMLStyleElement} */(this.querySelector('style'));

        if (style) {
            this.style = style;
        } else {
            // // Wait until childList changes and template should be there by then
            let observer = new MutationObserver(() => {
                let _style = /** @type {HTMLStyleElement} */(this.querySelector('style'));
                if (_style) {
                    observer.disconnect();
                    this.style = _style;
                } else {
                    throw new Error(ShadowStyle.is() + ' requires a <style> child');
                }
            });
            observer.observe(this, {childList: true});
        }
    }

    _initFromStyle() {
        const rules = /** @type {CSSStyleRule[]} */ Array.from(this._sheet.cssRules);
        rules.forEach((rule) => {
            if (rule.type === CSSRule.STYLE_RULE) {
                rule.selectorText.split(',').forEach((/** @type {string} */ selector) => {
                    selector = selector.trim();
                    let shadowSelectorOffset = selector.indexOf(shadowSelector);
                    if (shadowSelectorOffset !== -1) {
                        this._insertInjectionRule(selector.substr(0, shadowSelectorOffset).trim(),
                            `${selector.substr(shadowSelectorOffset + shadowSelector.length)} {${rule.style.cssText}}`);
                    }
                });
            }
        });
    }

    _styleId(id) {
        return id;
    }

    _update() {
    }
};

customElements.define(PTCS.ShadowStyle.is, PTCS.ShadowStyle);

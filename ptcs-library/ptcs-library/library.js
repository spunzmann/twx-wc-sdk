import {dashToCamelCase, camelToDashCase} from '@polymer/polymer/lib/utils/case-map.js';
import {ThemableMixin} from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {DomModule} from '@polymer/polymer/lib/elements/dom-module.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="library-for-ptcs">



</dom-module>`;

document.head.appendChild($_documentContainer.content);

export const PTCS = {};
export const PTC1 = {};

// make Polymer case-map Module be global
window.camelToDashCase = camelToDashCase;
window.dashToCamelCase = dashToCamelCase;

/* eslint-disable no-undef */
// https://stackoverflow.com/questions/2400935/browser-detection-in-javascript
PTCS.myBrowser = (() => {
    const ua = navigator.userAgent;
    let m = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let tem;
    if (/trident/i.test(m[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (m[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
        // eslint-disable-next-line eqeqeq
        if (tem != null) {
            return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
        }
    }
    m = m[2] ? [m[1], m[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    // eslint-disable-next-line eqeqeq
    if (tem != null) {
        m.splice(1, 1, tem[1]);
    }
    return m.join(' ');
})();

//console.log('BROWSER: ' + PTCS.myBrowser);

// Opera 8.0+
PTCS.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
PTCS.isFirefox = typeof InstallTrigger !== 'undefined';

// Safari
PTCS.isSafari = PTCS.myBrowser.substr(0, 6) === 'Safari';

// Internet Explorer 6-11
PTCS.isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
PTCS.isEdge = !PTCS.isIE && !!window.StyleMedia;

// Chrome 1+
PTCS.isChrome = !!window.chrome && !!window.chrome.webstore;
/* eslint-enable no-undef */

//////////////////////////////////////////////////////////////////////////
//
// Polyfills for IE11
//
//------------------------------------------------------------------------
if (!Array.prototype.find) {
    Array.prototype.find = function(test) {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            if (test(this[i], i)) {
                return this[i];
            }
        }
        return undefined;
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        if (pos === undefined || pos < 0) {
            pos = 0;
        }
        return this.substr(pos, search.length) === search;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if (this === null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1.
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

//------------------------------------------------------------------------
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(test) {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            if (test(this[i], i)) {
                return i;
            }
        }
        return -1;
    };
}


//------------------------------------------------------------------------
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(member, startFrom) {
        let index = isFinite(startFrom) ? Math.floor(startFrom) : 0;
        const that = this instanceof Object ? this : new Object(this);
        const length = isFinite(that.length) ? Math.floor(that.length) : 0;

        if (index >= length) {
            return -1;
        }

        if (index < 0) {
            index = Math.max(length + index, 0);
        }

        if (member === undefined) {
            do {
                if (index in that && that[index] === undefined) {
                    return index;
                }

            } while (++index < length);
        } else {
            do {
                if (that[index] === member) {
                    return index;
                }

            } while (++index < length);
        }

        return -1;
    };
}


//------------------------------------------------------------------------
if (!String.prototype.includes) {
    String.prototype.includes = function(sub) {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            if (this.charAt(i) === sub.charAt(0) && (sub.length === 1 || this.substr(i, sub.length) === sub)) {
                return true;
            }
        }

        return false;
    };
}

//------------------------------------------------------------------------
if (!Element.prototype.toggleAttribute) {
    Element.prototype.toggleAttribute = function(name) {
        const _name = (name && name.toLowerCase) ? name.toLowerCase() : null;
        if (!_name) {
            return false;
        }
        if (this.hasAttribute(_name)) {
            this.removeAttribute(_name);
            return false;
        }
        this.setAttribute(_name, '');
        return true;
    };
}

//------------------------------------------------------------------------
if (!Element.prototype.scrollIntoViewIfNeeded) {
    Element.prototype.scrollIntoViewIfNeeded = function() {
        // eslint-disable-next-line no-confusing-arrow
        const parentOf = el => ((el.nodeType === 11 && el.host) ? el.host : el.parentNode);
        let b = this.getBoundingClientRect();
        for (let el = parentOf(this); el; el = parentOf(el)) {
            if (!el.getBoundingClientRect || getComputedStyle(el).overflow === 'visible') {
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
        if (b.left > b.right || b.top > b.bottom) {
            this.scrollIntoView();
        }
    };
}


//------------------------------------------------------------------------
if (!window.ResizeObserver) {
    window.ResizeObserver = class {
        constructor(cb) {
            this.cb = cb;
            this.timer = false; // Not started
            this.map = new Map();
        }

        observe(el) {
            this.map.set(el, el.getBoundingClientRect());
            if (this.timer !== undefined) {
                this.timer = setTimeout(() => this._timeOut(), 350);
            }
        }

        unobserve(el) {
            this.map.delete(el);
        }

        disconnect() {
            if (this.timer !== undefined) {
                clearTimeout(this.timer);
                this.timer = undefined;
                this.map = new Map();
            }
        }

        _timeOut() {
            let a = [];
            this.map.forEach((bb, el) => {
                const bb2 = el.getBoundingClientRect();
                if (bb2.left !== bb.left || bb2.top !== bb.top || bb2.right !== bb.right ||
                    bb2.bottom !== bb.bottom || bb2.width !== bb.width || bb2.height !== bb.height) {
                    a.push({target: el, contentRect: bb2});
                }
            });
            if (a.length) {
                a.forEach(item => {
                    this.map.set(item.target, item.contentRect);
                });
                this.cb(a);
            }
            this.timer = this.map.size ? setTimeout(() => this._timeOut(), 350) : undefined;
        }
    };
}

//////////////////////////////////////////////////////////////////////////
//
// Decode CSS size specification (cannot find any built-in browser support?)
//
//------------------------------------------------------------------------
(() => {
// Absolute units
//   1in = 96px = 2.54cm = 25.4mm = 72pt = 6pc
// Relative Units
//   em:   Relative to the font-size of the element (2em means 2 times the size of the current font)
//   ex:   Relative to the x-height of the current font (rarely used)
//   ch:   Relative to width of the "0" (zero)
//   rem:  Relative to font-size of the root element
//   vw:   Relative to 1% of the width of the viewport
//   vh:   Relative to 1% of the height of the viewport
//   vmin: Relative to 1% of viewports smaller dimension
//   vmax: Relative to 1% of viewports larger dimension
//   %:    Relative to the parent element
//------------------------------------------------------------------------
    function xlateEM(value, el) {
        if (!el || !getComputedStyle) {
            return NaN;
        }
        const cs = getComputedStyle(el, null);
        if (!cs) {
            return NaN;
        }
        return value * PTCS.cssDecodeSize(cs.fontSize, el.parentNode);
    }

    function xlateVW(value) {
        if (!document || !document.documentElement) {
            return NaN;
        }
        return (value * document.documentElement.clientWidth) / 100;
    }

    function xlateVH(value) {
        if (!document || !document.documentElement) {
            return NaN;
        }
        return value * document.documentElement.clientHeight / 100;
    }

    function xlateVMIN(value) {
        if (!document || !document.documentElement) {
            return NaN;
        }
        return value * Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) / 100;
    }

    function xlateVMAX(value) {
        if (!document || !document.documentElement) {
            return NaN;
        }
        return value * Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight) / 100;
    }

    function xlatePercent(value, el, vert) {
        if (!el && !el.parentNode) {
            return NaN;
        }
        return value * (vert ? el.parentNode.clientWidth : el.parentNode.clientHeight) / 100;
    }

    const xlateMap = {
        p:    v => v, // p(x)
        px:   v => v,
        in:   v => v * 96,
        cm:   v => v * (96 / 2.54),
        mm:	  v => v * (96 / 25.4),
        pt:	  v => v * (96 / 72),
        pc:   v => v * 16,
        em:   xlateEM,
        //ex - not yet implemented
        //ch - not yet implemented
        rem:  v => xlateEM(v, document.documentElement),
        vw:   xlateVW,
        vh:   xlateVH,
        vmin: xlateVMIN,
        vmax: xlateVMAX,
        '%':  xlatePercent
    };

    // Decodes css size specification. Unit defaults to 'px'.
    // vert argument only relevant for % unit (percent of height intead of width)
    PTCS.cssDecodeSize = (size, el, vert) => {
        switch (typeof size) {
            case 'number':
                return size;
            case 'string':
                break;
            default:
                if (size !== undefined && size !== false) {
                    console.error(`Unknown size type: ${JSON.stringify(size)}`);
                }
                return NaN;
        }
        // size is a string
        const m = /^(\d*(\.\d*)?)([\w%]*)$/.exec(size);
        if (!m) {
            console.error(`Unknown size: ${JSON.stringify(size)}`);
            return NaN;
        }
        const unit = m[3];
        if (unit) {
            const xlate = xlateMap[unit];
            if (!xlate) {
                if (unit !== size) {
                    console.warn(`Unknown unit (${JSON.stringify(unit)}): ${JSON.stringify(size)}`);
                } else {
                    console.warn(`Unknown CSS size: ${JSON.stringify(size)}`);
                }
                return NaN;
            }
            return xlate(+m[1], el, vert);
        }
        return +m[1];
    };
})();


//////////////////////////////////////////////////////////////////////////
//
// Get full width of element, including margins
//
//------------------------------------------------------------------------
PTCS.getElementWidth = function(el) {
    if (el.offsetWidth) {
        const cs = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;
        const marginLeft = PTCS.cssDecodeSize(cs.marginLeft, el) || 0;
        const marginRight = PTCS.cssDecodeSize(cs.marginRight, el) || 0;

        return marginLeft + el.offsetWidth + marginRight;
    }

    return 0; // Unknown
};


//////////////////////////////////////////////////////////////////////////
//
// Get full height of element, including margins
//
//------------------------------------------------------------------------
PTCS.getElementHeight = function(el) {
    if (el.offsetHeight) {
        const cs = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;
        const marginTop = PTCS.cssDecodeSize(cs.marginTop, el, true) || 0;
        const marginBottom = PTCS.cssDecodeSize(cs.marginBottom, el, true) || 0;

        return marginTop + el.offsetHeight + marginBottom;
    }

    return 0; // Unknown
};


//////////////////////////////////////////////////////////////////////////
//
// Test if el has keyboard focus
//
//------------------------------------------------------------------------
PTCS.hasFocus = function(el) {
    for (let parent = el.parentNode; parent; parent = parent.parentNode) {
        if (parent.nodeType === 11 && parent.host) {
            return parent.host.shadowRoot ? parent.host.shadowRoot.activeElement === el : false;
        }
    }
    return document.activeElement === el;
};


//////////////////////////////////////////////////////////////////////////
//
// Subclass a component
//
//------------------------------------------------------------------------
PTCS.aliasClass = function(name, baseClass) {
    const type = class extends baseClass {
        static get is() {
            return name;
        }
    };

    customElements.define(type.is, type);

    return type;
};


//////////////////////////////////////////////////////////////////////////
//
// Subclass a component and bind it to class
//
//------------------------------------------------------------------------
PTCS.alias = function(name, base) {
    if (typeof base === 'string') {
        customElements.whenDefined(base).then(() => {
            PTCS.aliasClass(name, customElements.get(base));

            // Force restyling
            ShadyCSS.CustomStyleInterface.enqueued = true;
            ShadyCSS.styleDocument();
        });
    } else {
        PTCS.aliasClass(name, base);
    }
};


//////////////////////////////////////////////////////////////////////////
//
// Subclass a component
//
//------------------------------------------------------------------------
PTCS.subclass = function(name, base) {
    customElements.whenDefined(base).then(() => {
    // Small Primary Button
        const type = class extends customElements.get(base) {
            static get is() {
                return name;
            }
        };

        customElements.define(type.is, type);
    });
};


//////////////////////////////////////////////////////////////////////////
//
// Subclass a component class and bind it to name
//
//------------------------------------------------------------------------
PTCS.profileClass = function(name, baseClass, profile) {
    const type = class extends baseClass {
        static get is() {
            return name;
        }

        connectedCallback() {
            this.setAttribute('class', (this.getAttribute('class') || '') + ' ' + profile);
            super.connectedCallback();
        }
    };

    customElements.define(type.is, type);

    return type;
};


//////////////////////////////////////////////////////////////////////////
//
// Subclass a component and bind it to class
//
//------------------------------------------------------------------------
PTCS.profile = function(name, base, profile) {
    customElements.whenDefined(base).then(() => {
        PTCS.profileClass(name, customElements.get(base), profile);

        // Force restyling
        ShadyCSS.CustomStyleInterface.enqueued = true;
        ShadyCSS.styleDocument();
    });
};


//////////////////////////////////////////////////////////////////////////
//
// Unit tests helper method: Get styling derfinition for an element in
// the shadow root.
//
//------------------------------------------------------------------------
PTCS.getStyleForElement = function(shadowRootElement, selectorText) {
    var res = [];
    var classes = shadowRootElement.styleSheets[0].rules || shadowRootElement.styleSheets[0].cssRules;
    for (var x = 0; x < classes.length; x++) {
        if (classes[x].selectorText === selectorText) {
            var styleText = classes[x].style.cssText;
            var stylesArr = styleText.split(';');
            for (var i = 0; i < stylesArr.length; i++) {
                var prop = stylesArr[i].substring(0, stylesArr[i].indexOf(':')).trim();
                if (prop && prop.length > 0) {
                    var propVal = stylesArr[i].substring(stylesArr[i].indexOf(':') + 1).trim();
                    if (propVal.indexOf('calc(') < 0) {
                        if (prop.indexOf('color') > -1 && propVal.indexOf('rgb') < 0) {
                            propVal = PTCS.getRGBvalue(shadowRootElement, propVal);
                        }
                        res.push({prop: prop, propVal: propVal});
                    }
                }
            }
            break;
        }
    }
    return res;
};


//////////////////////////////////////////////////////////////////////////
//
// Unit tests private helper method: Get RGB color value for non-RGB value
//
//------------------------------------------------------------------------
PTCS.getRGBvalue = function(element, nonRGBColor) {
    var tempElement = document.createElement('DIV');
    tempElement.style.color = nonRGBColor;
    tempElement.setAttribute('id', 'tempElement');
    element.appendChild(tempElement);
    var res = window.getComputedStyle(tempElement).color;
    element.removeChild(tempElement);
    return res;
};


//////////////////////////////////////////////////////////////////////////
//
// Deep clone
//
//------------------------------------------------------------------------
PTCS.clone = function(data) {
    if (null === data || 'object' !== typeof data) {
        return data;
    }

    if (data instanceof Date) {
        return new Date(data);
    }

    if (data instanceof Array) {
        return data.map(item => PTCS.clone(item));
    }

    if (data instanceof Object) {
        const copy = {};

        for (const k in data) {
            if (data.hasOwnProperty(k)) {
                copy[k] = PTCS.clone(data[k]);
            }
        }

        return copy;
    }

    throw new Error('Unable to copy obj! Unsupported type.');
};


//////////////////////////////////////////////////////////////////////////
//
// Binary search
//
//------------------------------------------------------------------------
PTCS.binSearch = function(array, cmp) {
    let min = 0;
    let max = array.length - 1;

    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        const c = cmp(mid);

        if (c < 0) {
            min = mid + 1;
        } else if (c > 0) {
            max = mid - 1;
        } else {
            return mid;
        }
    }

    return -1;
};


/**
 * Correct class.template behavior for Legacy polymer elements
 * @polymerMixin
 */
PTCS.LegacyMixin = superClass => class LegacyMixin extends superClass {
    static get template() {
        if (!this.hasOwnProperty('_template')) {
            this._template = DomModule && DomModule.import((this).is, 'template') ||
        // note: implemented so a subclass can retrieve the super
        // template; call the super impl this way so that `this` points
        // to the superclass.
        Object.getPrototypeOf(/** @type {PolymerElementConstructor}*/ (this).prototype).constructor.template;
        }
        return this._template;
    }
};


/**
 * Returns a class that extends the class that is returned by Vaadin ThemableMixin. Result class overrides _includeStyle method in order to overcome
 * the issue with CSS mixin overriding.
 */
PTCS.ThemableMixin = superClass => class PTCSThemableMixin extends ThemableMixin(PTCS.LegacyMixin(superClass)) {
    static _includeStyle(moduleName, template) {
        if (template && !template.content.querySelector(`style[include=${moduleName}]`)) {
            const styleEl = document.createElement('style');
            styleEl.setAttribute('include', moduleName);
            const templateContent = template.content;
            templateContent.insertBefore(styleEl, templateContent.firstChild);
        }
    }

    static finalize() {
        let template = this.prototype._template;
        if (template && this.prototype.hasOwnProperty('_template') && template.__polymerFinalized) {
            return;
        }
        super.finalize();
    }
};


/**
 * Ensures that all component changes (like styling) have taken place.
 */
PTCS.flush = function(cb, wait = 50) {
    const ShadyCSS = window.ShadyCSS;
    if (ShadyCSS) {
        if (ShadyCSS.CustomStyleInterface) {
            ShadyCSS.CustomStyleInterface.enqueued = true;
        }

        ShadyCSS.styleDocument();
    }

    setTimeout(function() {
        cb();
    }, wait);
};


PTCS.getBaseURI = function() {
    let temp;
    if (document.currentScript) {
        temp = window.document.baseURI;
    } else if (document._currentScript) {
        temp = document._currentScript.ownerDocument.baseUR;
    } else {
        temp = '';
    }

    return temp;
};


PTCS.makeSelector = function(selector) {
    if (!selector) {
        return item => item;
    }
    if (typeof selector === 'string') {
        return item => item[selector];
    }
    if (selector.constructor && selector.call && selector.apply) {
        return selector;
    }
    console.error('Invalid selector: ', selector);
    return () => 'invalid-selector';
};


PTCS.Formatter = {
    getContainerType: function(renderType, listFormat) {
        let type = 'text';
        if (typeof window.TW === 'undefined' || !typeof (window.TW.Renderer) === 'undefined') {
            console.log('WARN: PTCS.Formatter is running outside of Thingworx application. No formatting is supported.');
        } else if (!window.TW.Renderer[renderType]) {
            console.log('WARN: PTCS.Formatter: Unknown formatter type: ' + renderType);
        } else if (window.TW.Renderer[renderType].renderText) {
            // do nothing: type = 'text';
        } else if (renderType === 'BOOLEAN') {
            if (listFormat.FormatString === 'checkbox') {
                type = 'checkbox';
            }
        } else if (renderType === 'HYPERLINK') {
            type = 'link';
        } else if (renderType === 'IMAGE') {
            type = 'image';
        } else if (renderType === 'IMAGELINK') {
            if (listFormat.FormatString === 'hyperlink') {
                type = 'link';
            } else {
                type = 'image';
            }
        } else if (renderType === 'HTML') {
            type = 'html';
        } else if (renderType === 'TAGS') {
            if (!listFormat.FormatString || listFormat.FormatString === 'plain') {
                type = 'text';
            } else {
                type = 'function';
            }
        } else if (renderType === 'THINGNAME' || renderType === 'THINGSHAPENAME' || renderType === 'THINGTEMPLATENAME' ||
            renderType === 'USERNAME' || renderType === 'MASHUPS') {
            if (listFormat.FormatString && listFormat.FormatString !== 'text') {
                type = 'link';
            }
        } else if (renderType === 'INFOTABLE') {
            type = 'image';
        } else {
            //console.log('WARN: PTCS.Formatter.getContainerType: Unsupported transform type: ' + renderType);
        }

        return type;
    },

    getFormaterFunc: function(renderType, fieldName, listFormat) {
        if (typeof window.TW === 'undefined' || !typeof (window.TW.Renderer) === 'undefined') {
            console.log('WARN: PTCS.Formatter is running outside of Thingworx application. No formatting is supported.');
            return null;
        }

        if (!window.TW.Renderer[renderType]) {
            console.log('WARN: PTCS.Formatter.getFormaterFunc: Unknown formatter type: ' + renderType);
            return null;
        }

        let selectorF = null;
        let itemMeta = null;
        var defaultLinkText;

        const canBeFieldName = (field) => field && typeof field !== 'function';

        if (window.TW.Renderer[renderType].renderText) {
            // selectorF - function that gets listItem object and applies renderTextF on displayProperty using renderProperty rules
            selectorF = function(item) {
                let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                if (!PTCS.Formatter._isEmpty(value)) {
                    if (renderType === 'NUMBER' || renderType === 'LONG' || renderType === 'INTEGER') {
                        listFormat.FormatString    = listFormat.numberFormatString || '[[numberFormat_Default]]';
                        listFormat.RoundingEnabled = false;
                    }
                    return window.TW.Renderer[renderType].renderText(value, listFormat);
                }
                return '';
            };
        } else if (renderType === 'BOOLEAN') {
            if (listFormat.FormatString === 'notext') { // checkbox/text don't require any specific treatement
                // eslint-disable-next-line no-unused-vars
                selectorF = function(item) {
                    return ' ';
                };
            }
        } else if (renderType === 'HYPERLINK') {
            defaultLinkText = 'View';
            if (listFormat.formatText !== null && listFormat.formatText !== undefined) {
                let tokenRegEx = /^\[\[(.*)\]\]$/g;
                let token = tokenRegEx.exec(listFormat.formatText);
                if (token && token.length > 1) {
                    defaultLinkText = window.TW.Runtime.convertHTMLLocalizableString(listFormat.formatText, 'View');
                } else {
                    defaultLinkText = listFormat.formatText;
                }
            }

            selectorF = function(item) {
                let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                if (!PTCS.Formatter._isEmpty(value)) {
                    if (value.href && value.label) {
                        return value; // don't modify ready-to-use object
                    }
                    return {href: value, label: defaultLinkText};
                }
                return '';
            };
            itemMeta = {target: listFormat.FormatString || '_blank'};
        } else if (renderType === 'IMAGE') {
            selectorF = function(item) {
                let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                if (!PTCS.Formatter._isEmpty(value)) {
                    return 'data:image/png;base64,' + value;
                }
                return '';
            };

        } else if (renderType === 'IMAGELINK') {
            defaultLinkText = window.TW.Runtime.convertHTMLLocalizableString('[[image_web_link]]');

            selectorF = function(item) {
                let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                let retValue = '';
                if (!PTCS.Formatter._isEmpty(value)) {
                    if (listFormat.FormatString === 'hyperlink') {
                        let href = value.href ? value.href : value;
                        retValue = {href: window.TW.convertImageLink(href), label: value.label ? value.label : defaultLinkText};
                    } else {
                        retValue = window.TW.convertImageLink(value);
                    }
                }
                return retValue;
            };

            if (!listFormat.FormatString || listFormat.FormatString === 'hyperlink') {
                itemMeta = {target: '_blank'};
            }
        } else if (renderType === 'HTML') {
            selectorF = function(item) {
                let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                let retVal = '';
                if (!PTCS.Formatter._isEmpty(value)) {
                    if (!listFormat.FormatString || listFormat.FormatString === 'format') {
                        // eslint-disable-next-line no-undef
                        retVal = window.twHtmlUtilities.sanitizeHtmlClientSide(XSS.decodeHTML(value));
                    } else if (listFormat.FormatString === 'raw') {
                        // eslint-disable-next-line no-undef
                        retVal = XSS.encodeHTML(value);
                    } else if (listFormat.FormatString === 'unsanitized') {
                        // eslint-disable-next-line no-undef
                        retVal = XSS.decodeHTML(value);
                    }
                }
                return retVal;
            };
        } else if (renderType === 'TAGS') {
            if (!listFormat.FormatString || listFormat.FormatString === 'plain') {
                selectorF = function(item) {
                    let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                    var rawVal = value;
                    if (!(rawVal instanceof Array)) {
                        return '';
                    } else if (rawVal.length === 0) {
                        return '';
                    }

                    let retVal = '';
                    let tag = null;
                    for (let tagindex = 0; tagindex < rawVal.length; tagindex++) {
                        if (tagindex > 0) {
                            retVal += ';';
                        }

                        tag = rawVal[tagindex];
                        retVal += tag.vocabulary + ':' + tag.vocabularyTerm;
                    }

                    return retVal;
                };
            } else {
                var collection = listFormat.FormatString === 'data' ? 'DataTags' : 'ModelTags';
                selectorF = function(item) {
                    let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                    var rawVal = value;
                    if (!(rawVal instanceof Array)) {
                        return document.createTextNode('Not tags...');
                    } else if (rawVal.length === 0) {
                        return document.createTextNode('');
                    }

                    return function() {
                        let retEl = document.createElement('span');
                        let el;
                        let tag = null;
                        let textSpan;
                        for (let tagindex = 0; tagindex < rawVal.length; tagindex++) {
                            if (tagindex > 0) {
                                textSpan = document.createElement('span');
                                textSpan.appendChild(document.createTextNode(';'));
                                retEl.appendChild(textSpan);
                            }

                            tag = rawVal[tagindex];

                            el = document.createElement('ptcs-link');
                            el.setAttribute('variant', 'primary');
                            el.setAttribute('target', '_blank');
                            el.setAttribute('href', encodeURI('/Thingworx/' + collection + '/' + tag.vocabulary));
                            el.setAttribute('label', tag.vocabulary);
                            retEl.appendChild(el);

                            retEl.appendChild(document.createTextNode(':'));

                            el = document.createElement('ptcs-link');
                            el.setAttribute('variant', 'primary');
                            el.setAttribute('target', '_blank');
                            el.setAttribute('href',
                                encodeURI('/Thingworx/' + collection + '/' + tag.vocabulary + '/VocabularyTermUsage/' + tag.vocabularyTerm));
                            el.setAttribute('label', tag.vocabularyTerm);
                            retEl.appendChild(el);
                        }

                        return retEl;
                    };
                };
            }
        } else if (renderType === 'THINGNAME' || renderType === 'THINGSHAPENAME' || renderType === 'THINGTEMPLATENAME' ||
            renderType === 'USERNAME' || renderType === 'MASHUPS') {
            if (!listFormat.FormatString || listFormat.FormatString === 'text') {
                selectorF = function(item) {
                    let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                    return PTCS.Formatter._isEmpty(value) ? '' : value;
                };
            } else {
                let entityType = 'Things';
                switch (renderType) {
                    case 'THINGNAME':
                        entityType = 'Things';
                        break;
                    case 'THINGSHAPENAME':
                        entityType = 'ThingShapes';
                        break;
                    case 'THINGTEMPLATENAME':
                        entityType = 'ThingTemplates';
                        break;
                    case 'USERNAME':
                        entityType = 'Users';
                        break;
                    case 'MASHUPS':
                        entityType = 'Mashups';
                        break;
                }
                itemMeta = {target: listFormat.FormatString};
                selectorF = function(item) {
                    let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                    if (!PTCS.Formatter._isEmpty(value)) {
                        return {href: '/Thingworx/' + entityType + '/' + value, label: value};
                    }
                    return '';
                };
            }
        } else if (renderType === 'INFOTABLE') {
            selectorF = function(item) {
                let value = canBeFieldName(fieldName) ? item[fieldName] : item;
                if (!PTCS.Formatter._isEmpty(value)) {
                    return '/Thingworx/Common/thingworx/widgets/dhxgrid/dhxgrid.ide.png';
                }
                return '';
            };
        } else if (renderType === 'XML' || renderType === 'JSON' || renderType === 'VALUES' || renderType === 'PASSWORD') {
            // eslint-disable-next-line no-unused-vars
            selectorF = function(item) {
                switch (renderType) {
                    case 'XML':
                        return '*XML*';
                    case 'JSON':
                        return '*JSON*';
                    case 'VALUES':
                        return '*VAL*';
                    case 'PASSWORD':
                        return '*****';
                }
                return '';
            };
        } else {
            console.log('PTCS.Formatter.getFormaterFunc: Unsupported transform type: ' + renderType);
        }

        if (itemMeta) {
            if (selectorF) {
                itemMeta.selector = selectorF;
            }

            return itemMeta;
        }

        return selectorF;
    },

    localize: function(token) {
        if (!token || !window.TW || !window.TW.Runtime || !window.TW.Runtime.convertHTMLLocalizableString) {
            return token;
        }

        return window.TW.Runtime.convertHTMLLocalizableString('[[' + token + ']]', token);
    },

    _isEmpty: function(obj) {
        if (obj === '' || obj === undefined || obj === null) {
            return true;
        }
        if (typeof obj === 'object') {
            return _.isEmpty(obj) && _.isEmpty(Object.getPrototypeOf(obj));
        }
        return false;
    }

};

/**
* OWASP - XSS attack prevention (https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
* RULE #7 - Avoid JavaScript URL's
*/
PTCS.validateURL = function(url) {
    // Don't allow 'javascript:' protocol. Test for: capital letters, tabs and spaces between letters.
    var patt = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi;

    return (!url || !url.toLowerCase().match(patt));
};

/**
 * treatment #hash url parameters (needed for SSO support)
 * @param url
 * @param target
 * @returns {void}
 */
PTCS.keepHashForSSORedirect = function(url, bRequireReload) {
    if (!window.TW || !window.TW.keepHashForSSORedirect) {
        return;
    }

    window.TW.keepHashForSSORedirect(url, bRequireReload);
};

PTCS.openUrl = function(operationType, url, target, options) {
    let wnd; // usually should remain undefined
    let preventTabnabbingFlags = 'noopener,noreferrer';

    if (window.TW && window.TW.openUrl) {
        wnd = window.TW.openUrl(operationType, url, target, options);
    } else {
        switch (operationType) {
            case 'open':
                wnd = window.open(url, target, preventTabnabbingFlags + (options ? ',' + options : ''));
                //Reset the opener link
                if (wnd && wnd.opener) {
                    wnd.opener = null;
                }
                break;
            case 'href':
            case 'location':
                window.location.href = url;
                window.opener = null;
                break;
            case 'reload':
                window.location.reload();
                break;
            case 'replace':
                window.location.replace(url);
                break;
            default:
                console.log('openUrl: unknown operation type: ' + operationType);
        }
    }

    return wnd;
};

PTCS._calculateVerticalScrollbarWidth = function() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const verticalScrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode.removeChild(outer);

    return verticalScrollbarWidth;
};

PTCS._verticalScrollbarWidth = PTCS._calculateVerticalScrollbarWidth();

/*
 * If the provided element has a scrollbar return its width.
 */
PTCS.getVerticalScrollbarWidth = function(el) {
    if (el && el.scrollHeight > el.clientHeight) {
        return PTCS._verticalScrollbarWidth;
    }

    return 0;
};


/*
 * Create a sample of an array: n = number of items to keep
 * NOTE: This function is mainly intended for charts. Maybe we need a chart library?
 */
PTCS.sampleArray  = function(a, n, compare) {
    // Uniform sampling based on indices
    function _sampleArray(length, sample, select) {
        const excess = (length - sample);
        if (excess <= 0) {
            throw Error(`Invalid sample: ${sample} out of ${length}`);
        }
        if (sample / excess > 1) {
            // Remove every d:th value
            const d = sample / excess;
            const f = i => Math.floor(i * (d + 1));
            let j = 0;
            for (let i = 0; i < sample; ++i) {
                const k = f(i);
                while (j++ < k) {
                    if (j <= length) {
                        select(j - 1);
                    }
                }
            }
        } else {
            // Keep every d:th value
            const d = excess / sample;
            const f = i => Math.floor(i * (d + 1));
            for (let i = 0; i < sample; ++i) {
                select(f(i));
            }
        }
    }

    const _a = [];
    if (!compare) {
        // No outlier detection
        _sampleArray(a.length, n, i => _a.push(a[i]));
        return _a;
    }

    // Make sure outliers are included in each chunk
    const delta = Math.max(10, a.length / 25); // Chunk size
    let start = 0;
    let end = delta;
    const ai = [];

    // Where should index be inserted?
    function injectIx(index) {
        for (let i = 0; i < ai.length; i++) {
            if (ai[i] >= index) {
                if (i === 0) {
                    return 0;
                }
                return (index - ai[i - 1] < ai[i] - index) ? i - 1 : i;
            }
        }
        return ai.length - 1;
    }

    // Find min / max in chunk and swap them into the sample array
    function selectOutliers() {
        // Compute min and max
        let min = start;
        let max = start;
        const _end = Math.min(Math.floor(end), a.length);

        for (let i = start + 1; i < _end; i++) {
            if (compare(a[min], a[i]) > 0) {
                min = i;
            }
            if (compare(a[max], a[i]) < 0) {
                max = i;
            }
        }

        // Include min and max by replacing closest samples (index wise)
        if (min === max) {
            // This should be rare - all values in the range must be identical
            ai[injectIx(min)] = min; // Replacement shouldn't really be needed...
        } else {
            // Find index to the min and max values
            const minIx = injectIx(min);
            const maxIx = injectIx(max);

            if (minIx === maxIx) {
                // Both the maximum and the minimum values are mapped to the same index
                if (min < max) {
                    if (maxIx + 1 < ai.length) {
                        ai[minIx] = min;
                        ai[maxIx + 1] = max;
                    } else {
                        ai[minIx - 1] = min;
                        ai[maxIx] = max;
                    }
                } else if (minIx + 1 < ai.length) {
                    ai[minIx + 1] = min;
                    ai[maxIx] = max;
                } else {
                    ai[minIx] = min;
                    ai[maxIx - 1] = max;
                }
            } else {
                ai[minIx] = min;
                ai[maxIx] = max;
            }
        }

        // Collect the outlier corrected sample
        ai.forEach(i => _a.push(a[i]));

        // Prepare for next chunk
        start = _end;
        end += delta;
        ai.length = 0;
    }

    _sampleArray(a.length, n, i => {
        if (i >= end) {
            selectOutliers();
        }
        ai.push(i);
    });

    // Final chunk
    selectOutliers();

    return _a;
};


// Convert value to a "type value", that can be compared
// NaN is returned if the value is not of the type
PTCS._typeVal = function(value, type, precision) {
    if (value === '' || value === null || value === undefined) {
        return NaN;
    }
    if (type === 'date') {
        return value instanceof Date ? value.getTime() : NaN;
    }
    if (type instanceof Array) {
        // eslint-disable-next-line eqeqeq
        let index = type.findIndex(s => s == value || s.label == value);
        if (index < 0) {
            // Multilevel string? (schedule chart?)
            const ix = value.indexOf ? value.indexOf(':$') : -1;
            if (ix > 0) {
                const value2 = value.substring(0, ix);
                index = type.findIndex(s => s === value2 || s.label === value2);
            }
        }

        return index >= 0 ? index : NaN;
    }
    value = +value;
    if (typeof precision !== 'number') {
        return value;
    }
    return value.toFixed ? value.toFixed(precision) : value;
};

PTCS._typeIsFullRange = function(type, minValue, maxValue, zoomStart, zoomEnd) {
    const v1 = PTCS._typeVal(minValue, type, 6);
    const v2 = PTCS._typeVal(maxValue, type, 6);
    const z1 = PTCS._typeVal(zoomStart, type, 6);
    const z2 = PTCS._typeVal(zoomEnd, type, 6);
    return (isNaN(z1) || z1 === v1) && (isNaN(z2) || z2 === v2);
};

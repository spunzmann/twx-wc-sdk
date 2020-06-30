import {PTCS} from 'ptcs-library/library.js';
import {mapPart} from './map-parts.js';

// Assert function - move to library.html
if (!PTCS.assert) {
    PTCS.assert = test => {
        if (!test) {
            throw Error('Assertion failed');
        }
    };
}

// Naming conventions
// - wc = generic Web Component
// - su = ptcs-style-unit
// - el = generic DOM element

// Style Aggregator public interface
// - enlist(wc): Enlist web component (= get styling from style aggregator)
// - delist(wc): Delist enlisted web component
// - attachStyle(su): Attach a ptcs-style-unit
// - updateStyle(su): Update a ptcs-style-unit
// - detachStyle(su): Detach a ptcs-style-unit

// Added structures
// wc.__saSub: Set of sub-wc that are affected by wc.variant
// wc.__saCtx: Array of css keys (strings)
// wc.__saVariantObserver: MutationObserver watching @variant
// wc.__saId: current id for wc. Only assigned on top-level components
// su.__saOldKey: CSS key (string) that style unit has been registered under


class StyleAggregator {
    constructor() {
        // Map cssKey's to web components
        // mapWC[cssKey] = Array of enlisted wc's that occurs in the cssKey context
        this.mapWC = {};

        // Map cssKey's to CSS styling
        // mapCSS[cssKey] = {
        //   css: string of combined CSS styling for this cssKey context,
        //   set: Set of contributing ptcs-style-units
        //   sheet: CSSStyleSheet - a constructable stylesheet containing css (when supported on platform)
        // }
        this.mapCSS = {};

        this._setStyle = PTCS.hasConstructableStylesheets ? this._setStyle_Ccss : this._setStyle_noCcss;
    }

    // Create component key
    _wcName(wc) {
        const variant = wc.getAttribute('variant');

        return variant ? wc.tagName + '.' + variant : wc.tagName;
    }

    // Attach sub-wc that observes changes to wc@variant
    _attachSubWC(wc, wcSub) {
        if (wc.noWcStyle) {
            return;
        }

        if (!wc.__saSub) {
            wc.__saSub = new Set();
        }

        wc.__saSub.add(wcSub);
    }

    // Detach sub-wc that observes changes to wc@variant
    _detachSubWC(wc, wcSub) {
        if (wc.__saSub) {
            wc.__saSub.delete(wcSub);
        }
    }

    _getParentComponent(wc) {
        for (let el = wc; el; el = el.parentNode) {
            if (el.nodeType === 11 && el.host) {
                return el.host;
            }
        }
        return null; // wc is top-level component
    }

    // Find all cssKeys (contexts) for this component
    _findKeys(wc) {
        let r = [];

        if (!wc.noWcStyle) {
            r.push({key: this._wcName(wc)});
        }

        const parent = this._getParentComponent(wc);
        if (parent) {
            // What part-name does this component have in its parent component?
            const part = wc.getAttribute('part');
            if (part) {
                // Get context strings from parent and add our part name to them
                this._assignKeys(parent).forEach(item => {
                    r.push({key: item.key + ':' + part});
                });

                this._attachSubWC(parent, wc);
            }

            if (wc.__saVariantObserver) {
                wc.__saVariantObserver.observe(wc, {attributes: true, attributeFilter: ['variant']});
            }
        } else {
            // This is a top-level component. Keep track of its id
            wc.__saId = wc.getAttribute('id');

            if (wc.__saVariantObserver) {
                wc.__saVariantObserver.observe(wc, {attributes: true, attributeFilter: ['variant', 'id']});
            }
        }

        return r;
    }

    // A variant attribute has been changed witch affects the cssKeys
    _changeKey(wc, wcId, oldId) {
        wc.__saCtx.forEach((item, index) => {
            if (item.key.startsWith(oldId)) {
                this._detachFromKey(wc, item);
                item.key = wcId + item.key.substring(oldId.length);
                this._attachToKey(wc, item);

                if (item.style) {
                    item.style.setAttribute('ctx', item.key);
                }

                const cssBucket = this.mapCSS[item.key];

                if (cssBucket && cssBucket.css) {
                    this._setStyle(wc, index, cssBucket);
                } else if (item.style) {
                    item.style.innerText = '';
                }
            }
        });

        // Notify children
        if (wc.__saSub) {
            wc.__saSub.forEach(_wc => {
                this._changeKey(_wc, wcId, oldId);
            });
        }
    }

    _assignKeys(wc) {
        // Watch changes to @variant?
        if (!wc.__saVariantObserver && !wc.noWcStyle) {
            // Each element needs its own observer, because we cannot turn off observe() requests
            wc.__saVariantObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    switch (mutation.attributeName) {
                        case 'variant':
                            if (wc.__saCtx[0]) {
                                const wcId = this._wcName(wc);
                                const oldId = wc.__saCtx[0].key;
                                if (wcId !== oldId) {
                                    this._changeKey(wc, wcId, oldId);
                                }
                            }
                            break;

                        case 'id':
                            if (wc.__saId) {
                                this._removeToplevelIdKey(wc);
                            }
                            wc.__saId = wc.getAttribute('id');
                            if (wc.__saId) {
                                this._addToplevelIdKey(wc);
                            }
                            break;
                    }
                });
            });
        }

        // Get the css keys
        if (!wc.__saCtx) {
            wc.__saCtx = this._findKeys(wc);
        }

        return wc.__saCtx;
    }

    // Register this component and all its sub-components to the id
    _addToplevelIdKey(wc) {
        PTCS.assert(wc.__saId);
        this._addIdKey(wc, this._wcName(wc), `#${wc.__saId}`);
    }

    // Unregister this component and all its sub-components from the id
    _removeToplevelIdKey(wc) {
        PTCS.assert(wc.__saId);
        this._removeIdKey(wc, `#${wc.__saId}`);
    }

    // Add id key
    _addIdKey(wc, wcName, id) {
        if (wc.__saCtx) {
            let r = [];

            // Compute new key values
            wc.__saCtx.forEach(item => {
                if (item.key.startsWith(wcName)) {
                    r.push({key: id + item.key.substring(wcName.length)});
                }
            });

            // Attach to new keys
            r.forEach(item => {
                wc.__saCtx.push(item);
                this._attachToKey(wc, item);

                const cssBucket = this.mapCSS[item.key];
                if (cssBucket && cssBucket.css) {
                    this._setStyle(wc, wc.__saCtx.length - 1, cssBucket);
                }
            });
        }

        // Notify children
        if (wc.__saSub) {
            wc.__saSub.forEach(_wc => this._addIdKey(_wc, wcName, id));
        }
    }

    // Remove id key
    _removeIdKey(wc, id) {
        if (wc.__saCtx) {
            let r = [];

            wc.__saCtx.forEach((item, index) => {
                if (item.key.startsWith(id)) {
                    r.unshift(index);

                    // Detach key from style aggregator
                    this._detachFromKey(wc, item);

                    // Detach <style> element from widget
                    if (item.style) {
                        item.style.parentNode.removeChild(item.style);
                        item.style = undefined;
                    }
                }
            });

            // Remove the items
            r.forEach(index => wc.__saCtx.splice(index, 1));
        }

        // Notify children
        if (wc.__saSub) {
            wc.__saSub.forEach(_wc => this._removeIdKey(_wc, id));
        }
    }

    _setStyle_Ccss(wc, index, cssBucket) {
        const item = wc.__saCtx[index];

        PTCS.assert(item && item.key);

        // Has the sheet already been put at the right place?
        if (!item.sheet) {
            item.sheet = cssBucket.sheet;

            // Find insertion point
            const n = wc.__saCtx.length;
            let i;

            for (i = index + 1; i < n; i++) {
                if (wc.__saCtx[i].sheet) {
                    break;
                }
            }

            // Insert the stylesheet
            if (i < n) {
                //wc.shadowRoot.adoptedStyleSheets.insertBefore(item.sheet, wc.__saCtx[i].sheet);
                const a = [];
                wc.shadowRoot.adoptedStyleSheets.forEach(sheet => {
                    if (sheet === wc.__saCtx[i].sheet) {
                        a.push(item.sheet);
                    }
                    a.push(sheet);
                });
                PTCS.assert(a.find(x => x === item.sheet));
                wc.shadowRoot.adoptedStyleSheets = a;
            } else {
                wc.shadowRoot.adoptedStyleSheets = [...wc.shadowRoot.adoptedStyleSheets, item.sheet];
            }
        }

        PTCS.assert(item.sheet === cssBucket.sheet);
    }

    _setStyle_noCcss(wc, index, cssBucket) {
        const item = wc.__saCtx[index];

        PTCS.assert(item && item.key);

        // Must create <style> element?
        if (!item.style) {
            item.style = document.createElement('style');

            item.style.setAttribute('ctx', item.key);

            // Find insertion point
            const n = wc.__saCtx.length;
            let i;

            for (i = index + 1; i < n; i++) {
                if (wc.__saCtx[i].style) {
                    break;
                }
            }

            // Insert the <style>
            if (i < n) {
                wc.shadowRoot.insertBefore(item.style, wc.__saCtx[i].style);
            } else {
                wc.shadowRoot.append(item.style);
            }
        }

        // Assign the style content
        item.style.innerText = cssBucket.css;
    }

    // Attach element to CSS key
    _attachToKey(wc, item) {
        let elems = this.mapWC[item.key];

        if (!elems) {
            elems = this.mapWC[item.key] = new Set();
        }

        elems.add(wc);

        PTCS.assert(!item.sheet);
    }

    // Detach element from CSS key
    _detachFromKey(wc, item) {
        const elems = this.mapWC[item.key];

        PTCS.assert(elems);

        elems.delete(wc);

        if (item.sheet) {
            PTCS.assert(wc.shadowRoot.adoptedStyleSheets.find(x => x === item.sheet) === item.sheet);
            const a = [];
            wc.shadowRoot.adoptedStyleSheets.forEach(sheet => {
                if (sheet !== item.sheet) {
                    a.push(sheet);
                }
            });
            wc.shadowRoot.adoptedStyleSheets = a;
            PTCS.assert(!wc.shadowRoot.adoptedStyleSheets.find(x => x === item.sheet));

            item.sheet = undefined;
        }
    }

    // Attach a web component to the style manager structure
    _attachWC(wc) {
        // Compute CSS keys of this WC and bind them to style aggeregator
        this._assignKeys(wc).forEach((item, index) => {
            PTCS.assert(!item.style);

            // Inform style aggregator that this wc occurs in this context
            this._attachToKey(wc, item);

            // Add style element, if there is styling
            const cssBucket = this.mapCSS[item.key];

            if (cssBucket && cssBucket.css) {
                this._setStyle(wc, index, cssBucket);
                PTCS.assert(item.style || item.sheet);
            }
        });

        // Is the web component a top level component with an ID?
        if (wc.__saId) {
            this._addToplevelIdKey(wc);
        }
    }

    // Remove a web component from the style manager structure
    _detachWC(wc) {
        // Turn off @variant watcher
        if (wc.__saVariantObserver) {
            wc.__saVariantObserver.disconnect();
            wc.__saVariantObserver = undefined;
        }

        if (wc.__saCtx) {
            wc.__saCtx.forEach(item => {
                // Detach key from style aggregator
                this._detachFromKey(wc, item);

                // Detach <style> elements from widget
                if (item.style) {
                    item.style.parentNode.removeChild(item.style);
                    item.style = undefined;
                }
            });

            // Discard CSS keys
            wc.__saCtx = undefined;

            // Discard ID, if any
            wc.__saId = undefined;
        }

        // Detach from parent wc
        if (wc.getAttribute('part')) {
            const parent = this._getParentComponent(wc);
            if (parent) {
                this._detachSubWC(parent, wc);
            }
        }
    }

    // A Web Component wants to use the style manager service
    enlist(wc) {
        // If main widget key has changed ... (a variant has been assigned)
        if (wc.__saCtx && wc.__saCtx[0]) {
            const key = this._wcName(wc);
            const old = wc.__saCtx[0].key;
            if (key !== old) {
                wc.__saCtx[0].key = key;
                PTCS.assert(!wc.__saCtx[0].style);
                // Notify children
                if (wc.__saSub) {
                    wc.__saSub.forEach(_wc => this._changeKey(_wc, key + ':', old + ':'));
                }
            }
        }

        this._attachWC(wc);
    }

    // A Web Component wants to leave the style manager
    delist(wc) {
        this._detachWC(wc);
    }


    // Assign a CSS unit to all WC's that are using it
    _assignCSS(cssKey, cssBucket) {
        const elems = this.mapWC[cssKey];

        if (!elems) {
            return;
        }

        elems.forEach(el => {
            const i = el.__saCtx.findIndex(item => item.key === cssKey);
            PTCS.assert(i >= 0);
            this._setStyle(el, i, cssBucket);
        });
    }

    _cssKey(cssKey) {
        if (!cssKey || cssKey[0] !== '#') {
            return cssKey;
        }

        // If key specifies a component name (i.e. matches #id.component), then strip the component name
        const m = /^(#[\w-]+)(\.[\w-]+)(:.+)?$/.exec(cssKey);

        if (!m) {
            return cssKey;
        }

        return m[3] ? m[1] + m[3] : m[1];
    }

    // Attach a style unit
    _attachCSS(su) {
        const cssKey = this._cssKey(su.__saOldKey = su.cssKey);

        if (!cssKey) {
            return;
        }

        // Add css to this cssKey
        let cssBucket = this.mapCSS[cssKey];

        if (!cssBucket) {
            this.mapCSS[cssKey] = cssBucket = {
                css:   '',
                set:   new Set(),
                sheet: PTCS.hasConstructableStylesheets ? new CSSStyleSheet() : undefined
            };
        }

        cssBucket.set.add(su);
        cssBucket.css += su.textContent;
        if (cssBucket.sheet) {
            cssBucket.sheet.replaceSync(cssBucket.css);
        }

        // Update web components
        this._assignCSS(cssKey, cssBucket);
    }

    // Detach a style unit
    _detachCSS(su) {
        const cssKey = this._cssKey(su.__saOldKey);

        if (!cssKey) {
            return;
        }

        // Clear CSS key
        su.__saOldKey = undefined;

        // Remove style unit from CSS key bucket
        let cssBucket = this.mapCSS[cssKey];

        PTCS.assert(cssBucket);

        cssBucket.set.delete(su);

        // Update style content
        this._regenerateStyles(cssKey, cssBucket);
    }

    // Regenerate the CSS for a specfic cssKey (a style unit has been changed / removed)
    _regenerateStyles(cssKey, cssBucket) {
        let css = '';

        cssBucket.set.forEach(su => {
            css += su.textContent;
        });

        cssBucket.css = css;

        if (cssBucket.sheet) {
            // Using Constructable Stylesheets: update the stylesheet
            cssBucket.sheet.replaceSync(cssBucket.css);
        } else {
            // Not using Constructable Stylesheets: update web components
            this._assignCSS(cssKey, cssBucket);
        }
    }

    // Attach a ptcs-style-unit
    attachStyle(su) {
        PTCS.assert(!su.__saOldKey);
        this._attachCSS(su);
    }

    // Update a ptcs-style-unit (something has changed)
    updateStyle(su) {
        // Has CSS Key changed?
        if (su.cssKey !== su.__saOldKey) {
            this._detachCSS(su);
            this._attachCSS(su);
        }

        // Update style content
        if (su.cssKey) {
            const cssKey = this._cssKey(su.cssKey);
            PTCS.assert(this.mapCSS[cssKey]);
            this._regenerateStyles(cssKey, this.mapCSS[cssKey]);
        }
    }

    // Detach a ptcs-style-unit
    detachStyle(su) {
        PTCS.assert(su.cssKey === su.__saOldKey);
        this._detachCSS(su);
    }
}

/*
 *
 *  The Shady Style Aggregator
 *
 */
class StyleAggregatorShady {
    _shadify(su) {
        if (!su.cssKey || !su.textContent) {
            return '';
        }

        // Decompose CSS selector and apply replace to each unit
        function parseSelector(css, replace) {
            const length = css.length;

            function skipWS(i) {
                while (i < length && css[i] === ' ') {
                    i++;
                }
                return i;
            }

            function skipString(i) {
                const q = css[i++];
                while (i < length) {
                    if (css[i] === q) {
                        return i + 1;
                    }
                    i++;
                }
                console.error('Undetermined string: ' + css);
                return length;
            }

            function skipAtom(i) {
                if (css[i] === '{') {
                    // we can get here in case when there is no spaces between atom and "{" like [part~=link]{
                    return i + 1;
                }

                while (i < length) {
                    switch (css[i]) {
                        case ' ':
                        case '{':
                            return i;
                        case '"':
                        case "'":
                            i = skipString(i);
                            break;
                        default:
                            i++;
                    }
                }
                return i;
            }

            let r = [];
            let i = 0;
            let n = 0;

            while (i < length) {
                const start = skipWS(i);
                i = skipAtom(start);

                if (start < i) {
                    const atom = css.substring(start, i);
                    if (atom.length === 1) {
                        switch (atom) {
                            case ',':
                            case '>':
                            case '+':
                            case '~':
                                r.push(atom);
                                break;

                            case '{':
                                // End of selector
                                return `${r.join(' ')} ${css.substring(start)}`;

                            default:
                                r.push(replace(atom, n++));
                        }
                    } else {
                        r.push(replace(atom, n++));
                    }
                }
            }

            // End of entire string
            return r.join(' ');
        }

        // Decode cssKey into { widget, variant, partPath }
        const m = /^(#?[A-Za-z0-9-_]+)(.[A-Za-z0-9-_]+)?((:[A-Za-z0-9-_]+)*)$/.exec(su.cssKey);

        if (!m) {
            console.error(`Invalid ptcs-style-unit key: ${su.cssKey}`);
            return undefined;
        }

        // Parts
        const partArray = (m[2] && m[2][0] === ':') ? [m[2].substring(1)] : [];

        if (m[3] && m[3][0] === ':') {
            m[3].split(':').forEach(item => {
                if (item) {
                    partArray.push(item);
                }
            });
        }

        let widgetScope, partScope, partPath;

        function buildPartPath(widget) {
            if (!partArray.length) {
                partPath = '';
                partScope = widget ? `.style-scope.${widget}` : '';
            }
            let w = widget;
            let a = [' '];

            for (let i = 0; i < partArray.length; i++) {
                const mp = mapPart(w, partArray[i]);
                if (mp) {
                    a.push(`${mp.name}.style-scope.${w}[part~=${partArray[i]}]${mp.variant ? '[variant="' + mp.variant + '"]' : ''}`);
                } else {
                    a.push(`${w ? '.style-scope.' + w : ''}[part~=${partArray[i]}]`);
                }
                w = mp ? mp.name : undefined;
            }

            partPath = a.join(' ');
            partScope = w ? `.style-scope.${w}` : '';
        }

        if (m[1][0] === '#') {
            widgetScope = m[1];
            const widget = (m[2] && m[2][0] === '.') ? m[2].substring(1).toLowerCase() : undefined;
            buildPartPath(widget);
        } else {
            const widget = m[1].toLowerCase();
            const variant = (m[2] && m[2][0] === '.') ? m[2].substring(1) : undefined;
            widgetScope = `${widget}${variant ? '[variant=' + variant + ']' : ':not([variant])'}`;
            buildPartPath(widget);
        }

        function shadify_selector(s, i) {
            if (i) {
                return `${s}${partScope}`;
            }
            if (s.startsWith(':host')) {
                const selectorWidget = s.length === 5 ? '' : s.substring(6, s.length - 1);
                return `${widgetScope}${selectorWidget}${partPath}`;
            }
            return `${widgetScope}${partPath} ${s}${partScope}`;
        }

        const replace = s => parseSelector(s, shadify_selector);
        return su.textContent.replace(/(:host|\[\s*part\s*[^|^$*]?=|\.\w+)[^,{]+[,{]/gm, replace);
    }

    // Attach a ptcs-style-unit
    attachStyle(su) {
        this.updateStyle(su);
    }

    // Update a ptcs-style-unit (something has changed)
    updateStyle(su) {
        const css = this._shadify(su)/*.replace(/\s/g, ' ')*/;

        if (css) {
            if (su.__saStyle) {
                su.__saStyle.textContent = css;
            } else {
                su.__saStyle = document.createElement('style');
                su.__saStyle.textContent = css;
                document.head.appendChild(su.__saStyle);
            }

            // This attribute simplifies debugging
            su.__saStyle.setAttribute('ctx', su.cssKey);
        } else {
            this.detachStyle(su);
        }
    }

    // Detach a ptcs-style-unit
    detachStyle(su) {
        if (su.__saStyle) {
            su.__saStyle.parentNode.removeChild(su.__saStyle);
            su.__saStyle = undefined;
        }
    }

    // Ignore calls from Web Components
    enlist() {} // Ignore
    delist() {} // Ignore
}


// Load StyleAggregator
if (!window.ShadyCSS || window.ShadyCSS.nativeShadow) {
    PTCS.hasConstructableStylesheets = ('adoptedStyleSheets' in Document.prototype) && ('replace' in CSSStyleSheet.prototype);

    // Currently we are not going to use constructable style sheets since Chrome has a bug.
    // They are not applied e.g. when we define custome style properties on ptcstextfield (its label part or textbox part).
    PTCS.hasConstructableStylesheets = false;

    console.log(`load styleAggregator in native mode,${PTCS.hasConstructableStylesheets ? '' : ' not'} using Constructable Stylesheets`);
    PTCS.styleAggregator = new StyleAggregator();

    // Any components waiting to be enlisted?
    if (PTCS.__styleable) {
        PTCS.__styleable.forEach(el => PTCS.styleAggregator.enlist(el));
    }
} else {
    console.log('load styleAggregator in shady mode');
    PTCS.styleAggregator = new StyleAggregatorShady();
}

PTCS.__styleable = undefined;

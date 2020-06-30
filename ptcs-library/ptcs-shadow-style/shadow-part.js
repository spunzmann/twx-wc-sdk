/*
Based on work by https://github.com/dima-dv
@license
Copyright (c) 2018 https://github.com/dima-dv
Based on work by The Polymer Project
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/* eslint no-use-before-define: 0 */
import {PTCS} from 'ptcs-library/library.js';
(function(global) {
    const partDataKey = '__cssParts';
    const parsedRulesKey = '__cssParsedRules';
    const partIdKey = '__partId';

    const partAttribute = '__part';

    // true for browsers with native shadowDOM and CSS variables support
    const useCssVars = !(global.ShadyCSS && !(global.ShadyCSS.nativeCss && global.ShadyCSS.nativeShadow));
    // true for browsers with :host() CSS selector support
    let useHostSelector = true;
    try {
        document.querySelector(':host(.dummy)');
    } catch (_err) {
        useHostSelector = false;
    }

    /**
   * Converts any style elements in the shadowRoot to replace ::part
   * with custom properties used to transmit this data down the dom tree. Also
   * caches part metadata for later lookup.
   * @param {HTMLStyleElement} style
   */

    function initializeStyleParts(style) {
        let container = style.getRootNode();
        container = container.host || container;
        style[partDataKey] = null;
        const info = partCssToCustomPropCss(container, style.textContent);
        if (info.parts) {
            style[partDataKey] = info.parts;
        }
        style.textContent = info.css;
        style[parsedRulesKey] = info.parsedRules;
    }

    function ensureStylePartData(style) {
        if (!style.hasOwnProperty(partDataKey)) {
            initializeStyleParts(style);
        }
    }

    function resetStylePartData(style) {
        if (style.hasOwnProperty(partDataKey)) {
            delete style[partDataKey];
        }
        if (style.hasOwnProperty(parsedRulesKey)) {
            delete style[parsedRulesKey];
        }
    }

    /**
   *
   * @param {HTMLStyleElement} style
   * @return {number}
   */
    function styleRulesLength(style) {
        return style.sheet.cssRules.length;
    }

    /**
   *
   * @param {HTMLStyleElement} style
   * @param {string} rule
   * @param {number} index
   * @return {number}
   */

    function insertStyleRule(style, rule, index) {
        ensureStylePartData(style);

        let part = parseCssRule(rule);
        let parsedRule = {
            css: cssTextFromPart(part)
        };
        let outputRule = parsedRule.css;
        let id;
        if (part.name) {
            parsedRule.part = part;
            let container = style.getRootNode();
            container = container.host || container;
            id = partIdForElement(container);
            outputRule = cssTextFromPart(part, id, true);

            style[partDataKey] = style[partDataKey] || [];
            style[partDataKey].push(part);
        }
        index = style.sheet.insertRule(outputRule, index);
        style[parsedRulesKey].splice(index, 0, parsedRule);
        return index;
    }

    /**
   *
   * @param {HTMLStyleElement} style
   * @param {number} index
   */

    function deleteStyleRule(style, index) {
        ensureStylePartData(style);

        let parsedRule = style[parsedRulesKey][index];
        if (parsedRule.part) {
            let parts = /** @type {Array} */ (style[partDataKey]);
            parts.splice(parts.indexOf(parsedRule.part), 1);

            if (parts.length === 0) {
                style[partDataKey] = null;
            }
        }
        style[parsedRulesKey].splice(index, 1);
        style.sheet.deleteRule(index);
    }

    /**
   *
   * @param {HTMLStyleElement} style
   * @param {function(this:Object,Object):boolean} predicate
   * @param {Object=} thisPtr compare rules by selector only and not by the whole rule
   * @return {number}
   */

    function findStyleRuleEx(style, predicate, thisPtr) {
        ensureStylePartData(style);

        let index = style[parsedRulesKey].findIndex(predicate, thisPtr);
        return index;
    }

    /**
   *
   * @param {HTMLStyleElement} style
   * @param {string} rule
   * @param {string} useSelectorOnly compare rules by selector only and not by the whole rule
   * @return {number}
   */

    function findStyleRule(style, rule, useSelectorOnly) {
        let part = parseCssRule(rule);
        let normalizedRule = cssTextFromPart(part);
        let index = findStyleRuleEx(style, (parsedRule) => (parsedRule.css === normalizedRule ||
                    (useSelectorOnly && (getSelectorFromCSSRule(parsedRule.css) === getSelectorFromCSSRule(normalizedRule)))));
        return index;
    }

    /**
   * Returns the selector from string CSS rule
   */
    function getSelectorFromCSSRule(rule) {
        return rule.trim().substring(0, rule.trim().indexOf('{')).trim();
    }

    /**
   * Converts any style elements in the shadowRoot to replace ::part
   * with custom properties used to transmit this data down the dom tree. Also
   * caches part metadata for later lookup.
   * @param {Element} element
   */

    function initializeParts(element) {
        let root = element.shadowRoot || element;
        element[partDataKey] = null;
        Array.from(root.querySelectorAll('style')).forEach(style => {
            ensureStylePartData(style);
            const styleParts = style[partDataKey];
            if (styleParts) {
                element[partDataKey] = element[partDataKey] || [];
                element[partDataKey].push(...styleParts);
            }
        });
    }

    function ensurePartData(element) {
        if (!element.hasOwnProperty(partDataKey)) {
            initializeParts(element);
        }
    }

    function resetPartData(element) {
        if (element.hasOwnProperty(partDataKey)) {
            delete element[partDataKey];
        }
    }

    function partDataForElement(element) {
        ensurePartData(element);
        return element[partDataKey];
    }

    /**
   * Turns css using `::part` into css using variables for those parts.
   * Also returns part metadata.
   * @param {Element} element
   * @param {string} cssText
   * @returns {Object} css: partified css, parts: array of parts of the form
   * {name, selector, props}
   * Example of part-ified css, given:
   * .foo::part(bar) { color: red }
   * output:
   * .foo { --e1-part-bar-color: red; }
   * where `e1` is a guid for this element.
   */
    function partCssToCustomPropCss(element, cssText) {
        let parts;
        // remove comments
        let cssRules = cssText.replace(/\/\*[\s\S]*?\*\//g, '').trim().split('}');
        let part, parsedRule, outputRule;
        let css = '';
        let parsedRules = [];
        let rule, nextRule, leftBraceCount;
        for (let i = 0; i < cssRules.length; i++) {
            rule = cssRules[i];
            leftBraceCount = (rule.match(/{/g) || []).length;
            if (leftBraceCount > 0) {
                for (;leftBraceCount > 1; leftBraceCount--) {
                    nextRule = cssRules[++i];
                    rule = rule + '}' + nextRule;
                    leftBraceCount += (nextRule.match(/{/g) || []).length;
                }
                rule += '}';
            }
            if (rule) {
                part = parseCssRule(rule);
                parsedRule = {
                    css: cssTextFromPart(part)
                };
                outputRule = parsedRule.css;
                let id;
                if (part.name) {
                    parts = parts || [];
                    parts.push(part);
                    parsedRule.part = part;
                    id = partIdForElement(element);
                    outputRule = cssTextFromPart(part, id, true);
                }
                css += outputRule;
                parsedRules.push(parsedRule);
            }
        }
        return {
            parts,
            css,
            parsedRules
        };
    }

    const cssRe = /[\s\n]*([\s\S]*?)(?:::part\(([^)]+)\)([^\s\n{]*))?[\s\n]*{([\s\S]*)}[\s\n]*/;

    /**
   * Parse single CSS rule
   * @param {string} cssText
   * @returns {ParsedRule} parsed css rule in the form
   * {selector, partName, endSelector, props}
   */
    function parseCssRule(cssText) {
        let [m, selector, name, endSelector, propsStr] = cssText.match(cssRe); // eslint-disable-line no-unused-vars
        propsStr = (propsStr !== undefined) ? propsStr.trim() : propsStr;
        return {
            selector:    selector || '',
            endSelector: endSelector || '',
            name:        name || '',
            props:       (selector && !selector.startsWith('@')) ? parseCssProperties(propsStr) : propsStr
        };
    }

    function splitStringToProps(cssText) {
        // Previous version used the native split() to divide the string per ';', not taking
        // into account if the ';' occurred within a string or not...
        let props = [];

        const len = cssText.length;

        const SQ = '\'';
        const DQ = '"';
        const NONE = '';

        let withinString = NONE;
        let startOfProp = 0;

        for (let i = 0; i < len; i++) {
            const ch = cssText.charAt(i);
            switch (ch) {
                case ';':
                    if (withinString === NONE) {
                        // This is a "proper ;", not occuring within a string
                        if (i > startOfProp) {
                            props.push(cssText.slice(startOfProp, i));
                        }
                        startOfProp = i + 1;
                    }
                    break;
                case SQ:
                    // Are we ending a single-quote string or starting a new?
                    if (withinString === NONE) {
                        withinString = SQ;
                    } else if (withinString === SQ) {
                        withinString = NONE;
                    }
                    break;
                case DQ:
                    // Are we ending a double-quote string or starting a new?
                    if (withinString === NONE) {
                        withinString = DQ;
                    } else if (withinString === DQ) {
                        withinString = NONE;
                    }
                    break;
                case '\\':
                    // Quoted character, just ignore whatever char comes next
                    i++;
                    break;
            }
        }
        // Anything left?
        if (startOfProp < len) {
            props.push(cssText.slice(startOfProp, len));
        }

        return props;
    }

    function parseCssProperties(cssText) {
        cssText = normalizeCssProperties(cssText);
        const propsArray = splitStringToProps(cssText);
        let props = {};
        propsArray.forEach(prop => {
            prop = prop.trim();
            if (prop) {
                const s = prop.split(':');
                const name = s.shift().trim();
                const value = s.join(':').trim();
                props[name] = value;
            }
        });
        return props;
    }

    let normalizeStyleEl;
    function normalizeCssProperties(cssText) {
        const styleId = 'shadow-part-styles-helper';
        if (!normalizeStyleEl) {
            document.head.insertAdjacentHTML('beforeend', `<style id="${styleId}" rel="alternate stylesheet" type="text/css"></style>`);
            normalizeStyleEl = document.getElementById(styleId);
        }
        let ruleNum = normalizeStyleEl.sheet.insertRule(`#dummy {${cssText}}`, normalizeStyleEl.sheet.cssRules.length);
        cssText = normalizeStyleEl.sheet.cssRules[ruleNum].style.cssText;
        normalizeStyleEl.sheet.deleteRule(ruleNum);
        return cssText;
    }

    function cssTextFromPart(part, elementId, doConvert) {
        let partProps;
        if (typeof part.props === 'string') {
            partProps = `\t${part.props}\n`;
        } else {
            partProps = '';
            let part2Var = doConvert && useCssVars;
            for (let p in part.props) {
                // eslint-disable-next-line max-len
                partProps = `${partProps}\t${(part.name && part2Var) ? varForPart(elementId, part.name, p, part.endSelector) : p}: ${part.props[p]};\n`;
            }
        }
        let partSelector = '';
        if (part.name) {
            if (doConvert) {
                if (!useCssVars) {
                    partSelector = ` [${partAttribute}_${elementId}~="${part.name}"]${part.endSelector}`;
                }
            } else {
                partSelector = `::part(${part.name})${part.endSelector}`;
            }
        }
        return `${part.selector || '*'}${partSelector} {\n${partProps}}\n`;
    }

    function normalizeCssRule(cssText) {
        return cssTextFromPart(parseCssRule(cssText));
    }

    // guid for element part scopes
    let partId = 0;

    function partIdForElement(element) {
        if (element[partIdKey] === undefined) {
            element[partIdKey] = partId++;
        }
        return element[partIdKey];
    }

    // creates a custom property name for a part.
    function varForPart(id, name, prop, endSelector) {
        return `--e${id}-part-${name}-${prop}${endSelector ? `-${endSelector.replace(/[:.()[=\]]/g, '')}` : ''}`;
    }

    /**
   * Produces a style using css custom properties
   * or add '__part' attributes
   * to style ::part for all the dom in the element's shadowRoot.
   * @param {Element} element
   */
    function applyPart(element) {
        let root = element.shadowRoot || element;
        let container = element.getRootNode();
        container = container.host || container;
        if (container !== element) {
            // note: ensure host has part data so that elements that boot up
            // while the host is being connected can style parts.
            ensurePartData(container);

            if (useCssVars) {
                let style = root.querySelector('style[parts]');
                const css = cssForElementDom(element);

                if (css && !style) {
                    style = document.createElement('style');
                    style.setAttribute('parts', '');
                    root.appendChild(style);
                }

                if (style) {
                    style.textContent = css || '';
                }
            } else {
                markInternalPartNames(element);
            }
        }
    }

    /**
   * Populate __part_<id> attributes in element's own shadow DOM
   * For each part node inside element's DOM and each container <id>
   * __part_<id> = <list of part names as visible in <id>>
   * @param {HTMLElement} element
   * Example of DOM:
   * <body>
   * <c1 partmap="e-p c2-e-p">
   *  <c2 partmap="p e-p">
   *    <e>
   *      <p part="p"/>
   *    </e>
   *  </c2>
   * </c1>
   * </body>
   * will produce
   * <p part"p" __part_2="p" __part_1="e-p" __part_0="c2-e-p"/>
   */
    function markInternalPartNames(element) {
        if (useCssVars || !element.shadowRoot) {
            return;
        }

        let container = element.getRootNode();
        container = container.host || container;
        if (container === element) {
            return;
        }

        const partNodes = Array.from(element.shadowRoot.querySelectorAll('[part]'));
        if (!(partNodes && partNodes.length)) {
            return;
        }

        let partNames = [];
        let partInfo, attrValue;
        partNodes.forEach((node) => {
            attrValue = node.getAttribute('part');
            partInfo = partInfoFromAttr(attrValue);
            if (partInfo && partInfo.length) {
                partNames.push(...(partInfo.map((info) => info.name)));
            }
        });
        partNames = partNames.filter(uniqueFilter);

        let outerNames = calculateOuterNames(partNames, element, container);
        const containerId = partIdForElement(container);
        let nodeAttrs, mapEntry;
        partNodes.forEach((node) => {
            attrValue = node.getAttribute('part');
            nodeAttrs = {};
            nodeAttrs[`${partAttribute}_${containerId}`] = attrValue;
            if (outerNames) {
                partInfo = partInfoFromAttr(attrValue);
                if (partInfo && partInfo.length) {
                    partInfo.forEach((info) => {
                        mapEntry = outerNames.get(info.name);
                        if (mapEntry) {
                            mapEntry.forEach((entry) => {
                                nodeAttrs[`${partAttribute}_${entry.id}`] =
                  (nodeAttrs[`${partAttribute}_${entry.id}`] ? (nodeAttrs[`${partAttribute}_${entry.id}`] + ' ') : '') +
                  entry.names.join(' ');
                            });
                        }
                    });
                }
            }
            Object.keys(nodeAttrs).forEach((attr) => {
                node.setAttribute(attr, nodeAttrs[attr]);
            });
        });
    }

    /**
   * @param {string[]} names
   * @param {HTMLElement} element
   * @returns {Map<string,{id:string,names:string[]}[]>}
   */
    function calculateOuterNames(names, element, container) {
        let superContainer = container.getRootNode();
        superContainer = superContainer.host || superContainer;
        if (container === superContainer) {
            return undefined;
        }

        const partInfo = partInfoFromPartmap(element.getAttribute('exportparts') /* backward compatibility */ || element.getAttribute('partmap'));
        if (!partInfo) {
            return undefined;
        }

        const containerId = partIdForElement(superContainer);

        // fill partmap
        let mapEntry;
        const partMap = new Map();
        partInfo.forEach((info) => {
            mapEntry = partMap.get(info.forward);
            if (!mapEntry) {
                mapEntry = [info.name];
                partMap.set(info.forward, mapEntry);
            } else {
                mapEntry.push(info.name);
            }
        });

        // calculate result Map for container
        let res = new Map();
        let mapping;
        let outerNames = [];
        names.forEach((name) => {
            if (partMap.get(name) || partMap.get('*')) {
                mapEntry = res.get(name);
                if (!mapEntry) {
                    mapEntry = {id: containerId, names: []};
                    res.set(name, [mapEntry]);
                } else {
                    mapEntry = mapEntry[0];
                }

                mapping = partMap.get(name);
                if (mapping) {
                    mapEntry.names = mapEntry.names.concat(mapping).filter(uniqueFilter);
                    outerNames.push(...mapping);
                }

                mapping = partMap.get('*');
                if (mapping) {
                    mapping = mapping.map((entry) => entry.replace('*', name));
                    mapEntry.names = mapEntry.names.concat(mapping).filter(uniqueFilter);
                    outerNames.push(...mapping);
                }
            }
        });
        let outerMap = calculateOuterNames(outerNames.filter(uniqueFilter), container, superContainer);
        if (outerMap) {
            res.forEach((mapEntry2) => {
                mapEntry2[0].names.forEach((outerName) => {
                    mapEntry2.push(...(outerMap.get(outerName) || []));
                });
            });
        }

        return res;
    }

    /**
   * Produces cssText a style element to apply part css to a given element.
   * The element's shadowRoot dom is scanned for nodes with a `part` attribute.
   * Then selectors are created matching the part attribute containing properties
   * with parts defined in the element's host.
   * The ancestor tree is traversed for forwarded parts.
   * e.g.
   * [part~="bar"] {
   *   color: var(--e1-part-bar-color);
   * }
   * @param {Element} element Element for which to apply part css
   * @returns {string} CSS text for element
   */
    function cssForElementDom(element) {
        ensurePartData(element);
        if (useCssVars) {
            /*
            const partNodes = element.shadowRoot.querySelectorAll('[part]');
            let attr = '';
            for (let i = 0; i < partNodes.length; i++) {
                attr = attr + ' ' + partNodes[i].getAttribute('part');
            }

            let partInfo = partInfoFromAttr(attr);
            */
            const partNodes = Array.from(element.shadowRoot.querySelectorAll('[part]'));
            if (!(partNodes && partNodes.length)) {
                return undefined;
            }

            const names = partNodes.reduce((names2, node) => names2 + ' ' + node.getAttribute('part'), '');
            const partInfo = partInfoFromAttr(names);

            return partInfo && partInfo.length && rulesForPartInfo(partInfo, element);
        }
        return undefined;
    }

    /**
   * Creates a css rule that applies a part.
   * @param {*} partInfo Array of part info from part attribute
   * @param {*} attr Part attribute
   * @param {*} element Element within which the part exists
   * @returns {string} Text of the css rule of the form `selector { properties }`
   */
    function rulesForPartInfo(partInfo, element) {
        let text = '';
        partInfo.forEach(info => {
            if (!info.forward) {
                const props = propsForPart(info.name, element);
                if (props) {
                    let hostSelector, stateSelector, partProps, propsBucket;
                    for (let bucket in props) {
                        propsBucket = props[bucket];
                        [hostSelector, stateSelector] = bucket.split('|');
                        partProps = [];
                        for (let p in propsBucket) {
                            partProps.push(`${p}: ${propsBucket[p]};`);
                        }
                        // eslint-disable-next-line max-len
                        text = `${text}\n${useHostSelector && hostSelector && `:host(${hostSelector})`} [part~="${info.name}"]${stateSelector} {\n\t${partProps.join('\n\t')}\n}`;
                    }
                }
            }
        });
        return text;
    }

    /**
   * Parses a part attribute into an array of part info
   * @param {*} attr Part attribute value
   * @returns {array} Array of part info objects of the form {name, foward}
   */
    function partInfoFromAttr(attr) {
        attr = attr.trim();
        const pieces = attr ? attr.split(/\s+/).filter(uniqueFilter) : [];
        let parts = [];
        pieces.forEach(p => {
            parts.push({
                name:    p,
                forward: null
            });
        });
        return parts;
    }

    /**
   * Parses an exportparts (partmap) attribute into an array of part info
   * @param {*} attr Partmap attribute value
   * @returns {array} Array of part info objects of the form {name, foward}
   */
    function partInfoFromPartmap(attr) {
        const pieces = attr ? attr.split(/\s*,\s*/) : [];
        let parts = [];
        pieces.forEach(p => {
            const m = p ? p.match(/([^\s:]+)(?:[\s:]+([^\s]+))?/) : [];
            if (m) {
                parts.push({
                    name:    m[2] || m[1],
                    forward: m[1]
                });
            }
        });
        return parts;
    }

    /**
   * For a given part name returns a properties object which sets any ancestor
   * provided part properties to the proper ancestor provided css variable name.
   * e.g.
   * color: `var(--e1-part-bar-color);`
   * @param {string} name Name of part
   * @param {Element} element Element within which dom with part exists
   * @returns {object} Object of properties for the given part set to part variables
   * provided by the elements ancestors.
   */
    function propsForPart(name, element) {
        let container = element.getRootNode();
        container = container.host || container;
        if (container === element) {
            return undefined;
        }
        // collect props from host element.
        let props = propsFromElement(name, container, element);
        // now recurse ancestors to find *forwarded* part properties
        // forwarding: recurses up ancestor tree!
        const partInfo = partInfoFromPartmap(element.getAttribute('exportparts') /* backward compatibility */ || element.getAttribute('partmap'));
        // {name, forward} where `*` can be included
        partInfo.forEach(info => {
            let catchAll = info.forward && (info.forward.indexOf('*') >= 0);
            if (name === info.forward || catchAll) {
                const ancestorName = catchAll ? info.name.replace('*', name) : info.name;
                const forwarded = propsForPart(ancestorName, container);
                props = mixPartProps(props, forwarded);
            }
        });

        return props;
    }

    /**
   * Collects css for the given part of an element from the part data for the given
   * container element.
   *
   * @param {string} name Name of part
   * @param {Element} container Element with part css/data.
   * @param {Element} element Element with a part.
   * @returns {object} Object of properties for the given part set to part variables
   * provided by the element.
   */
    function propsFromElement(name, container, element) {
        let props;
        const parts = partDataForElement(container);
        if (parts) {
            const id = partIdForElement(container);
            parts.forEach((part) => {
                if (part.name === name && isMatchingPossible(element, part.selector)) {
                    props = addPartProps(props, part, id, name);
                }
            });
        }
        return props;
    }

    /**
   * Match sequence of simple selectors in selector
   * (split on combinators)
   * @param {string} text CSS selector (not a group, without ",")
   * @returns [0: sequence, 1: isLast]
   */
    const selectorSeqRe = /([^\s>~+]+$)|(?:[^\s>~+]+)/g;

    /**
   * Match possible dynamic single simple selector in sequence of simple selectors
   * Supports single simple selector inside "not" clause: :not(.xxx) :not([aaa=bbb])
   * @param {string} text Sequence of simple selectors (no white-space)
   * @returns [0: simpleSelector, 1: prefix, 2: name, 3: attributeName]
   */
    const constSelectorRe = /(?::not\()?(?:(?:(\.|:(?!not)|::)([^.#:[]+))|(?:\[([^=\]]+)(?:=[^\]]+)?\]))\)?/g;

    /**
   * Match possible widget class names
   * @param {string} text class name
   */
    const widgetClassRe = /^widget-[a-z0-9]+$/;

    /**
   * Checks if given element could match the static part of selector
   *
   * @param {Element} element Element with a constAttributes and constClasses.
   * @param {string}  selector CSS selector string
   * @returns {Boolean}
   */
    function isMatchingPossible(element, selector) {
        let constSelector = selector.replace(selectorSeqRe, (sequence, isLast) => {
            return sequence.replace(constSelectorRe, (m, classOrPseudoPrefix, classOrPseudoName, attributeName) => {
                return !isLast || ((
                    classOrPseudoPrefix === '.' && ((
                        element.constructor.constClasses && (
                            element.constructor.constClasses === true ||
              element.constructor.constClasses.includes(classOrPseudoName)
                        )) ||
            widgetClassRe.test(classOrPseudoName)
                    )) || (
                    attributeName && (
                        (element.constructor.constAttributes && element.constructor.constAttributes.includes(attributeName)) ||
            !useHostSelector && (element.constructor.stateAttributes && element.constructor.stateAttributes.includes(attributeName))
                    )
                )) ? m : '';
            }).trim() || '*';
        }).trim() || '*';
        let ret = false;
        try {
            ret = element.matches(constSelector);
        } catch (e) {
            console.log(e);
        }
        return ret;
    }

    /**
   * Add part css to the props object for the given part/name.
   * @param {object} props Object containing part css
   * @param {object} part Part data
   * @param {nmber} id element part id
   * @param {string} name name of part
   */
    function addPartProps(props, part, id, name) {
        props = props || {};
        const hostSelector = getHostSelector(part.selector);
        const bucket = hostSelector + '|' + (part.endSelector || '');
        const b = props[bucket] = props[bucket] || {};
        for (let p in part.props) {
            b[p] = `var(${varForPart(id, name, p, part.endSelector)})`;
        }
        return props;
    }

    function getHostSelector(selector) {
        const compoundSelectors = selector.split(/\s*[>~+ ]\s*/);
        return compoundSelectors[compoundSelectors.length - 1];
    }

    function mixPartProps(a, b) {
        if (b) {
            a = a || {};
            for (let bucket in b) {
                const newBucket = bucket.substr(bucket.indexOf('|'));
                // ensure storage exists
                if (!a[newBucket]) {
                    a[newBucket] = {};
                }
                Object.assign(a[newBucket], b[bucket]);
            }
        }
        return a;
    }

    function uniqueFilter(value, index, arr) {
        return arr.indexOf(value) === index;
    }

    /**
   * CustomElement mixin that can be applied to provide ::part support.
   * @param {*} superClass
   */
    let ShadowPartMixin = (superClass, stateAttributes, constClasses, constAttributes) => {

        return class ShadowPartClass extends superClass {

            constructor() {
                super();
                this.applyPartListener = () => this.queueApplyPart();
            }

            connectedCallback() {
                if (super.connectedCallback) {
                    super.connectedCallback();
                }
                this.container = this.getRootNode();
                this.container = this.container.host || this.container;
                this.container.addEventListener('apply-part', this.applyPartListener);
            }

            ready() {
                super.ready();
                this.queueApplyPart();
            }

            disconnectedCallback() {
                if (this.container) {
                    this.container.removeEventListener('apply-part', this.applyPartListener);
                }
                if (super.disconnectedCallback) {
                    super.disconnectedCallback();
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (super.attributeChangedCallback) {
                    super.attributeChangedCallback(name, oldValue, newValue);
                }
                if (useCssVars && !useHostSelector && this.constructor.stateAttributes.includes(name)) {
                    this.queueApplyPart();
                }
            }

            static get observedAttributes() {
                if (typeof this._observedAttributes === 'undefined') {
                    let result = [];
                    const observedAttributes = super.observedAttributes;
                    if (observedAttributes) {
                        result = result.concat(observedAttributes);
                    }

                    const stateAttributes2 = this.stateAttributes;
                    if (stateAttributes2) {
                        result = result.concat(stateAttributes2);
                    }
                    result = result.filter(uniqueFilter);
                    this._observedAttributes = result;
                }

                return this._observedAttributes;
            }

            static get stateAttributes() {
                if (typeof this._stateAttributes === 'undefined') {
                    const defaultStateAttributes = ['themable', 'disabled', 'variant'];
                    let result = stateAttributes ? [...stateAttributes] : [];
                    const constClasses2 = this.constClasses;
                    if (constClasses2 !== true) {
                        result.push('class');
                    }
                    result = result.concat(defaultStateAttributes).filter(uniqueFilter);
                    this._stateAttributes = result;
                }

                return this._stateAttributes;
            }

            static get constAttributes() {
                if (typeof this._constAttributes === 'undefined') {
                    const defaultConstAttributes = ['part'];
                    let result = constAttributes ? [...constAttributes] : [];
                    result = result.concat(defaultConstAttributes).filter(uniqueFilter);
                    this._constAttributes = result;
                }

                return this._constAttributes;
            }

            static get constClasses() {
                if (typeof this._constClasses === 'undefined') {
                    let result;
                    if (typeof constClasses === 'boolean') {
                        result = constClasses;
                    } else {
                        let defaultConstClasses = ['ptcs-wrapper'];
                        // add 'widget-...' class
                        defaultConstClasses.push(`widget-${this.is.toLowerCase().replace(/-/g, '')}`);
                        result = constClasses || [];
                        result = result.concat(defaultConstClasses).filter(uniqueFilter);
                    }
                    this._constClasses = result;
                }

                return this._constClasses;
            }

            queueApplyPart() {
                if (this.shadowRoot) {
                    requestAnimationFrame((time) => this._applyPart(time));
                    let mappedElements =  Array.from(this.shadowRoot.querySelectorAll('[partmap],[exportparts]'));
                    for (let element of mappedElements) {
                        if (element.queueApplyPart) {
                            element.queueApplyPart();
                        }
                    }
                }
            }

            _applyPart(time) {
                if (time !== this._lastApplyTime) {
                    this._lastApplyTime = time;
                    applyPart(this);
                }
            }
        };
    };

    /**
   *
   * @param {EventTarget} container
   */
    function queueApplyPartAll(container) {
        container.dispatchEvent(new Event('apply-part'));
    }

    PTCS.ShadowPart = {
        ShadowPartMixin,
        applyPart,
        ensureStylePartData,
        resetStylePartData,
        ensurePartData,
        resetPartData,
        normalizeCssRule,
        findStyleRule,
        findStyleRuleEx,
        deleteStyleRule,
        insertStyleRule,
        styleRulesLength,
        queueApplyPartAll
    };
}(window));

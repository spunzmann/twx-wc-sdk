import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {PTCS} from 'ptcs-library/library.js';
import './shadow-part.js';
import {cssFromModules} from '@polymer/polymer/lib/utils/style-gather.js';
(function(_PTCS) {
    'use strict';

    const __include = 'include';

    /**
   * Custom element for defining styles in the main document
   * To use:
   *
   * - Import `ptcs-custom-css.html`.
   * - Place a `<ptcs-custom-css>` element in the main document, wrapping an inline `<style>` tag that
   *   contains the CSS rules you want to shim. `include` attribute for Polymer style module or `<link>`
   *   element for external CSS will be supported also
   *
   * For example:
   *
   * ```html
   * <!-- import custom-style element -->
   * <link rel="import" href="ptcs-shadow-style/ptcs-custom-css.html">
   *
   * <ptcs-custom-css>
   *   <style>
   *     x-custom::part(stylable) {
   *         background: blue;
   *         font-weight: bold;
   *         color: red;
   *     }
   *   </style>
   * </ptcs-custom-css>
   * ```
   *
   * @class
   * @extends {Polymer.Element}
   * @memberof PTCS
   * @summary Custom element for defining styles in the main document that can
   *   take advantage of part styling shim.
   */
    _PTCS.CustomCSS = class CustomCSS extends PolymerElement {
        static get is() {
            return 'ptcs-custom-css';
        }

        static get properties() {
            return {
                /** @type {HTMLStyleElement} */
                style: {
                    type:     Object,
                    observer: '_initFromStyle'
                },
            };
        }

        /**
     * @returns {Node}
     */
        getContainer() {
            let container = this.getRootNode();
            container = container.host || container;
            return container;
        }

        ready() {
            super.ready();
            this._init();
        }

        _init() {
            let child = /** @type {HTMLElement} */(this.children[0]);
            if (child) {
                this._initFromChild(child);
            } else {
                // // Wait until childList changes and template should be there by then
                let observer = new MutationObserver(() => {
                    let _child = /** @type {HTMLElement} */(this.children[0]);
                    if (_child) {
                        observer.disconnect();
                        this._initFromChild(_child);
                    }
                });
                observer.observe(this, {childList: true});
            }
        }

        /**
     *
     * @param {string} url
     * @returns {Promise<string>}
     */
        static _fetchCSS(url) {
            return fetch(url, {
                method:      'GET',
                credentials: 'same-origin',
                headers:     {
                    'Content-Type': 'text/css'
                }
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`_fetchCSS failed to retrieve "${response.url}" with status ${response.status}`);
                }
                return response.text();
            });
        }

        static get importMatcher() {
            // match @import statement. Returns url string as a first group
            return /@import\s+(?:url\()?(?:"|')?([^"')\s;]+)(?:"|')?\)?\s*([^;]+)?;/g;
        }

        /**
     *
     * @param {string} css
     * @returns {Promise<string>}
     */
        static _embedImports(css, baseUrl) {
            let reImport = this.importMatcher;
            let importMatch;
            let fetchers = [];
            while ((importMatch = reImport.exec(css)) !== null) {
                let importUrl = importMatch[1];
                if (!importUrl.startsWith('/')) {
                    importUrl = baseUrl + importUrl;
                }
                fetchers.push(this._fetchCSS(importUrl).then((_css) => this._embedImports(this._removeComments(_css),
                    importUrl.substr(0, importUrl.lastIndexOf('/') + 1))).catch(() => ''));
            }

            return fetchers.length
                ? Promise.all(fetchers).then((imported) => {
                    let i = 0;
                    let inflated = css.replace(reImport, () => `\n${imported[i++]}\n`);

                    return inflated;
                })
                : Promise.resolve(css);
        }

        /**
     *
     * @param {string} css
     * @returns {string}
     */
        static _removeComments(css) {
            let reComment = /\/\*(?:[\s\S](?!\*\/))*[\s\S]\*\//g;
            return css.replace(reComment, ' ');
        }

        /**
     *
     * @param {HTMLElement} child
     */
        _initFromChild(child) {
            if (child.localName === 'style') {
                this.style = child;
            } else if (child.localName === 'link') {
                let url = child.href;
                CustomCSS._fetchCSS(url).then((text) => {
                    this.removeChild(child);
                    child = document.createElement('style');
                    let reImport = CustomCSS.importMatcher;
                    let baseUrl = url.substr(0, url.lastIndexOf('/') + 1);
                    text = text.replace(reImport, (rule, importUrl) => {
                        if (!importUrl.startsWith('/')) {
                            return rule.replace(importUrl, baseUrl + importUrl);
                        }
                        return rule;
                    });
                    child.textContent = text;
                    this.appendChild(child);
                    this.style = child;
                });
            }
        }

        /**
     *
     * @param {HTMLStyleElement} style
     * @returns {Promise<undefined>}
     */
        static _preprocessStyle(style) {
            const include = style.getAttribute(__include);
            let textContent = style.textContent;
            style.textContent = '';
            if (include) {
                style.removeAttribute(__include);
                textContent = cssFromModules(include) + '\n' + textContent;
            }

            let baseUrl = style.baseURI;
            baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1);
            return this._embedImports(this._removeComments(textContent), baseUrl).then((text) => {
                style.textContent = text;
                return text;
            });
        }

        /**
     *
     * @param {HTMLStyleElement} style
     */
        _initFromStyle(style) {
            this.constructor._preprocessStyle(style).then(() => {
                if (style.textContent.trim()) {
                    _PTCS.ShadowPart.resetStylePartData(style);
                    _PTCS.ShadowPart.ensureStylePartData(style);
                    _PTCS.ShadowPart.resetPartData(this.getContainer());
                    _PTCS.ShadowPart.queueApplyPartAll(this.getContainer());
                }
            });
        }
    };

    customElements.define(_PTCS.CustomCSS.is, _PTCS.CustomCSS);
}(PTCS));

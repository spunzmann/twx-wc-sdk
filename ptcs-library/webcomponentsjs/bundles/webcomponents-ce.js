/**
@license @nocompile
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function(){/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';var k=window.Document.prototype.createElement,m=window.Document.prototype.createElementNS,aa=window.Document.prototype.importNode,ba=window.Document.prototype.prepend,ca=window.Document.prototype.append,da=window.DocumentFragment.prototype.prepend,ea=window.DocumentFragment.prototype.append,p=window.Node.prototype.cloneNode,q=window.Node.prototype.appendChild,t=window.Node.prototype.insertBefore,u=window.Node.prototype.removeChild,v=window.Node.prototype.replaceChild,w=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),x=window.Element.prototype.attachShadow,y=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),z=window.Element.prototype.getAttribute,A=window.Element.prototype.setAttribute,B=window.Element.prototype.removeAttribute,C=window.Element.prototype.getAttributeNS,D=window.Element.prototype.setAttributeNS,E=window.Element.prototype.removeAttributeNS,F=window.Element.prototype.insertAdjacentElement,G=window.Element.prototype.insertAdjacentHTML,fa=window.Element.prototype.prepend,
ha=window.Element.prototype.append,H=window.Element.prototype.before,ia=window.Element.prototype.after,ja=window.Element.prototype.replaceWith,ka=window.Element.prototype.remove,la=window.HTMLElement,I=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),ma=window.HTMLElement.prototype.insertAdjacentElement,na=window.HTMLElement.prototype.insertAdjacentHTML;var oa=new Set;"annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" ").forEach(function(b){return oa.add(b)});function pa(b){var a=oa.has(b);b=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(b);return!a&&b}var qa=document.contains?document.contains.bind(document):document.documentElement.contains.bind(document.documentElement);
function J(b){var a=b.isConnected;if(void 0!==a)return a;if(qa(b))return!0;for(;b&&!(b.__CE_isImportDocument||b instanceof Document);)b=b.parentNode||(window.ShadowRoot&&b instanceof ShadowRoot?b.host:void 0);return!(!b||!(b.__CE_isImportDocument||b instanceof Document))}function K(b){var a=b.children;if(a)return Array.prototype.slice.call(a);a=[];for(b=b.firstChild;b;b=b.nextSibling)b.nodeType===Node.ELEMENT_NODE&&a.push(b);return a}
function L(b,a){for(;a&&a!==b&&!a.nextSibling;)a=a.parentNode;return a&&a!==b?a.nextSibling:null}
function M(b,a,c){for(var d=b;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;a(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;void 0===c&&(c=new Set);if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)M(d,a,c);d=L(b,e);continue}else if("template"===f){d=L(b,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)M(e,a,c)}d=d.firstChild?d.firstChild:L(b,d)}}function N(b,a,c){b[a]=c};function O(){var b=P&&P.noDocumentConstructionObserver,a=P&&P.shadyDomFastWalk;this.b=[];this.c=[];this.a=!1;this.shadyDomFastWalk=a;this.f=!b}function Q(b,a,c,d){var e=window.ShadyDOM;if(b.shadyDomFastWalk&&e&&e.inUse){if(a.nodeType===Node.ELEMENT_NODE&&c(a),a.querySelectorAll)for(b=e.nativeMethods.querySelectorAll.call(a,"*"),a=0;a<b.length;a++)c(b[a])}else M(a,c,d)}function ra(b,a){b.a=!0;b.b.push(a)}function sa(b,a){b.a=!0;b.c.push(a)}function R(b,a){b.a&&Q(b,a,function(a){return S(b,a)})}
function S(b,a){if(b.a&&!a.__CE_patched){a.__CE_patched=!0;for(var c=0;c<b.b.length;c++)b.b[c](a);for(c=0;c<b.c.length;c++)b.c[c](a)}}function T(b,a){var c=[];Q(b,a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state?b.connectedCallback(d):U(b,d)}}function V(b,a){var c=[];Q(b,a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state&&b.disconnectedCallback(d)}}
function W(b,a,c){c=void 0===c?{}:c;var d=c.o,e=c.g||function(a){return U(b,a)},f=[];Q(b,a,function(a){b.a&&S(b,a);if("link"===a.localName&&"import"===a.getAttribute("rel")){var c=a.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_registry=document.__CE_registry);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:a.addEventListener("load",function(){var c=a.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set;d&&(d.forEach(function(b){return f.add(b)}),
f.delete(c));W(b,c,{o:f,g:e})}})}else f.push(a)},d);for(a=0;a<f.length;a++)e(f[a])}
function U(b,a){try{a:{var c=a.ownerDocument;if("http://www.w3.org/1999/xhtml"===a.namespaceURI){var d=c.__CE_registry;if(d&&(c.defaultView||c.__CE_isImportDocument)){var e=d.a.get(a.localName);break a}}e=void 0}if(e&&void 0===a.__CE_state){e.constructionStack.push(a);try{try{if(new e.constructorFunction!==a)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{e.constructionStack.pop()}}catch(h){throw a.__CE_state=2,h;}a.__CE_state=1;a.__CE_definition=
e;if(e.attributeChangedCallback&&a.hasAttributes()){var f=e.observedAttributes;for(e=0;e<f.length;e++){var g=f[e],l=a.getAttribute(g);null!==l&&b.attributeChangedCallback(a,g,null,l,null)}}J(a)&&b.connectedCallback(a)}}catch(h){X(h)}}O.prototype.connectedCallback=function(b){var a=b.__CE_definition;if(a.connectedCallback)try{a.connectedCallback.call(b)}catch(c){X(c)}};O.prototype.disconnectedCallback=function(b){var a=b.__CE_definition;if(a.disconnectedCallback)try{a.disconnectedCallback.call(b)}catch(c){X(c)}};
O.prototype.attributeChangedCallback=function(b,a,c,d,e){var f=b.__CE_definition;if(f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(a))try{f.attributeChangedCallback.call(b,a,c,d,e)}catch(g){X(g)}};
function ta(b,a,c,d){var e=a.__CE_registry;if(e&&(null===d||"http://www.w3.org/1999/xhtml"===d)&&(e=e.a.get(c)))try{var f=new e.constructorFunction;if(void 0===f.__CE_state||void 0===f.__CE_definition)throw Error("Failed to construct '"+c+"': The returned value was not constructed with the HTMLElement constructor.");if("http://www.w3.org/1999/xhtml"!==f.namespaceURI)throw Error("Failed to construct '"+c+"': The constructed element's namespace must be the HTML namespace.");if(f.hasAttributes())throw Error("Failed to construct '"+
c+"': The constructed element must not have any attributes.");if(null!==f.firstChild)throw Error("Failed to construct '"+c+"': The constructed element must not have any children.");if(null!==f.parentNode)throw Error("Failed to construct '"+c+"': The constructed element must not have a parent node.");if(f.ownerDocument!==a)throw Error("Failed to construct '"+c+"': The constructed element's owner document is incorrect.");if(f.localName!==c)throw Error("Failed to construct '"+c+"': The constructed element's local name is incorrect.");
return f}catch(g){return X(g),a=null===d?k.call(a,c):m.call(a,d,c),Object.setPrototypeOf(a,HTMLUnknownElement.prototype),a.__CE_state=2,a.__CE_definition=void 0,S(b,a),a}a=null===d?k.call(a,c):m.call(a,d,c);S(b,a);return a}
function X(b){var a=b.message,c=b.sourceURL||b.fileName||"",d=b.line||b.lineNumber||0,e=b.a||b.columnNumber||0,f=void 0;void 0===ErrorEvent.prototype.initErrorEvent?f=new ErrorEvent("error",{cancelable:!0,message:a,filename:c,lineno:d,colno:e,error:b}):(f=document.createEvent("ErrorEvent"),f.initErrorEvent("error",!1,!0,a,c,d),f.preventDefault=function(){Object.defineProperty(this,"defaultPrevented",{configurable:!0,get:function(){return!0}})});void 0===f.error&&Object.defineProperty(f,"error",{configurable:!0,
enumerable:!0,get:function(){return b}});window.dispatchEvent(f);f.defaultPrevented||console.error(b)};function ua(b){var a=document;this.c=b;this.a=a;this.b=void 0;W(this.c,this.a);"loading"===this.a.readyState&&(this.b=new MutationObserver(this.f.bind(this)),this.b.observe(this.a,{childList:!0,subtree:!0}))}function va(b){b.b&&b.b.disconnect()}ua.prototype.f=function(b){var a=this.a.readyState;"interactive"!==a&&"complete"!==a||va(this);for(a=0;a<b.length;a++)for(var c=b[a].addedNodes,d=0;d<c.length;d++)W(this.c,c[d])};function wa(){var b=this;this.b=this.a=void 0;this.c=new Promise(function(a){b.b=a;b.a&&a(b.a)})}function xa(b){if(b.a)throw Error("Already resolved.");b.a=void 0;b.b&&b.b(void 0)};function Y(b){this.a=new Map;this.l=new Map;this.f=!1;this.b=b;this.j=new Map;this.h=function(b){return b()};this.c=!1;this.i=[];this.m=b.f?new ua(b):void 0}
Y.prototype.define=function(b,a){var c=this;if(!(a instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!pa(b))throw new SyntaxError("The element name '"+b+"' is not valid.");if(this.a.has(b))throw Error("A custom element with name '"+b+"' has already been defined.");if(this.f)throw Error("A custom element is already being defined.");this.f=!0;var d;try{var e=function(b){var a=f[b];if(void 0!==a&&!(a instanceof Function))throw Error("The '"+b+"' callback must be a function.");
return a},f=a.prototype;if(!(f instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var g=e("connectedCallback");var l=e("disconnectedCallback");var h=e("adoptedCallback");var n=(d=e("attributeChangedCallback"))&&a.observedAttributes||[]}catch(r){throw r;}finally{this.f=!1}a={localName:b,constructorFunction:a,connectedCallback:g,disconnectedCallback:l,adoptedCallback:h,attributeChangedCallback:d,observedAttributes:n,constructionStack:[]};this.a.set(b,
a);this.l.set(a.constructorFunction,a);this.i.push(a);this.c||(this.c=!0,this.h(function(){return ya(c)}))};Y.prototype.g=function(b){W(this.b,b)};
function ya(b){if(!1!==b.c){b.c=!1;for(var a=b.i,c=[],d=new Map,e=0;e<a.length;e++)d.set(a[e].localName,[]);W(b.b,document,{g:function(a){if(void 0===a.__CE_state){var e=a.localName,f=d.get(e);f?f.push(a):b.a.has(e)&&c.push(a)}}});for(e=0;e<c.length;e++)U(b.b,c[e]);for(;0<a.length;){var f=a.shift();e=f.localName;f=d.get(f.localName);for(var g=0;g<f.length;g++)U(b.b,f[g]);(e=b.j.get(e))&&xa(e)}}}Y.prototype.get=function(b){if(b=this.a.get(b))return b.constructorFunction};
Y.prototype.whenDefined=function(b){if(!pa(b))return Promise.reject(new SyntaxError("'"+b+"' is not a valid custom element name."));var a=this.j.get(b);if(a)return a.c;a=new wa;this.j.set(b,a);this.a.get(b)&&!this.i.some(function(a){return a.localName===b})&&xa(a);return a.c};Y.prototype.polyfillWrapFlushCallback=function(b){this.m&&va(this.m);var a=this.h;this.h=function(c){return b(function(){return a(c)})}};window.CustomElementRegistry=Y;Y.prototype.define=Y.prototype.define;
Y.prototype.upgrade=Y.prototype.g;Y.prototype.get=Y.prototype.get;Y.prototype.whenDefined=Y.prototype.whenDefined;Y.prototype.polyfillWrapFlushCallback=Y.prototype.polyfillWrapFlushCallback;var za=new function(){};function Aa(b){window.HTMLElement=function(){function a(){var a=this.constructor;var d=document.__CE_registry.l.get(a);if(!d)throw Error("Failed to construct a custom element: The constructor was not registered with `customElements`.");var e=d.constructionStack;if(0===e.length)return e=k.call(document,d.localName),Object.setPrototypeOf(e,a.prototype),e.__CE_state=1,e.__CE_definition=d,S(b,e),e;var f=e.length-1,g=e[f];if(g===za)throw Error("Failed to construct '"+d.localName+"': This element was already constructed.");
e[f]=za;Object.setPrototypeOf(g,a.prototype);S(b,g);return g}a.prototype=la.prototype;Object.defineProperty(a.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:a});return a}()};function Z(b,a,c){function d(a){return function(e){for(var c=[],f=0;f<arguments.length;++f)c[f]=arguments[f];f=[];for(var d=[],n=0;n<c.length;n++){var r=c[n];r instanceof Element&&J(r)&&d.push(r);if(r instanceof DocumentFragment)for(r=r.firstChild;r;r=r.nextSibling)f.push(r);else f.push(r)}a.apply(this,c);for(c=0;c<d.length;c++)V(b,d[c]);if(J(this))for(c=0;c<f.length;c++)d=f[c],d instanceof Element&&T(b,d)}}void 0!==c.prepend&&(a.prepend=d(c.prepend));void 0!==c.append&&(a.append=d(c.append))};function Ba(b){N(Document.prototype,"createElement",function(a){return ta(b,this,a,null)});N(Document.prototype,"importNode",function(a,c){a=aa.call(this,a,!!c);this.__CE_registry?W(b,a):R(b,a);return a});N(Document.prototype,"createElementNS",function(a,c){return ta(b,this,c,a)});Z(b,Document.prototype,{prepend:ba,append:ca})};function Ca(b){function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var c=void 0;if(this.firstChild){var e=this.childNodes,l=e.length;if(0<l&&J(this)){c=Array(l);for(var h=0;h<l;h++)c[h]=e[h]}}d.set.call(this,a);if(c)for(a=0;a<c.length;a++)V(b,c[a])}}})}N(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var c=K(a);a=t.call(this,a,d);if(J(this))for(d=
0;d<c.length;d++)T(b,c[d]);return a}c=a instanceof Element&&J(a);d=t.call(this,a,d);c&&V(b,a);J(this)&&T(b,a);return d});N(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=K(a);a=q.call(this,a);if(J(this))for(var e=0;e<c.length;e++)T(b,c[e]);return a}c=a instanceof Element&&J(a);e=q.call(this,a);c&&V(b,a);J(this)&&T(b,a);return e});N(Node.prototype,"cloneNode",function(a){a=p.call(this,!!a);this.ownerDocument.__CE_registry?W(b,a):R(b,a);return a});N(Node.prototype,
"removeChild",function(a){var c=a instanceof Element&&J(a),e=u.call(this,a);c&&V(b,a);return e});N(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var e=K(a);a=v.call(this,a,d);if(J(this))for(V(b,d),d=0;d<e.length;d++)T(b,e[d]);return a}e=a instanceof Element&&J(a);var c=v.call(this,a,d),g=J(this);g&&V(b,d);e&&V(b,a);g&&T(b,a);return c});w&&w.get?a(Node.prototype,w):ra(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=[],b=this.firstChild;b;b=
b.nextSibling)b.nodeType!==Node.COMMENT_NODE&&a.push(b.textContent);return a.join("")},set:function(a){for(;this.firstChild;)u.call(this,this.firstChild);null!=a&&""!==a&&q.call(this,document.createTextNode(a))}})})};function Da(b){function a(a){return function(e){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=[];for(var l=[],h=0;h<c.length;h++){var n=c[h];n instanceof Element&&J(n)&&l.push(n);if(n instanceof DocumentFragment)for(n=n.firstChild;n;n=n.nextSibling)d.push(n);else d.push(n)}a.apply(this,c);for(c=0;c<l.length;c++)V(b,l[c]);if(J(this))for(c=0;c<d.length;c++)l=d[c],l instanceof Element&&T(b,l)}}var c=Element.prototype;void 0!==H&&(c.before=a(H));void 0!==ia&&(c.after=a(ia));void 0!==ja&&
N(c,"replaceWith",function(a){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=[];for(var g=[],l=0;l<c.length;l++){var h=c[l];h instanceof Element&&J(h)&&g.push(h);if(h instanceof DocumentFragment)for(h=h.firstChild;h;h=h.nextSibling)d.push(h);else d.push(h)}l=J(this);ja.apply(this,c);for(c=0;c<g.length;c++)V(b,g[c]);if(l)for(V(b,this),c=0;c<d.length;c++)g=d[c],g instanceof Element&&T(b,g)});void 0!==ka&&N(c,"remove",function(){var a=J(this);ka.call(this);a&&V(b,this)})};function Ea(b){function a(a,c){Object.defineProperty(a,"innerHTML",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(a){var e=this,d=void 0;J(this)&&(d=[],Q(b,this,function(a){a!==e&&d.push(a)}));c.set.call(this,a);if(d)for(var f=0;f<d.length;f++){var g=d[f];1===g.__CE_state&&b.disconnectedCallback(g)}this.ownerDocument.__CE_registry?W(b,this):R(b,this);return a}})}function c(a,c){N(a,"insertAdjacentElement",function(a,e){var d=J(e);a=c.call(this,a,e);d&&V(b,e);J(a)&&T(b,e);return a})}
function d(a,c){function e(a,c){for(var e=[];a!==c;a=a.nextSibling)e.push(a);for(c=0;c<e.length;c++)W(b,e[c])}N(a,"insertAdjacentHTML",function(a,b){a=a.toLowerCase();if("beforebegin"===a){var d=this.previousSibling;c.call(this,a,b);e(d||this.parentNode.firstChild,this)}else if("afterbegin"===a)d=this.firstChild,c.call(this,a,b),e(this.firstChild,d);else if("beforeend"===a)d=this.lastChild,c.call(this,a,b),e(d||this.firstChild,null);else if("afterend"===a)d=this.nextSibling,c.call(this,a,b),e(this.nextSibling,
d);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");})}x&&N(Element.prototype,"attachShadow",function(a){a=x.call(this,a);if(b.a&&!a.__CE_patched){a.__CE_patched=!0;for(var c=0;c<b.b.length;c++)b.b[c](a)}return this.__CE_shadowRoot=a});y&&y.get?a(Element.prototype,y):I&&I.get?a(HTMLElement.prototype,I):sa(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return p.call(this,!0).innerHTML},set:function(a){var b=
"template"===this.localName,c=b?this.content:this,d=m.call(document,this.namespaceURI,this.localName);for(d.innerHTML=a;0<c.childNodes.length;)u.call(c,c.childNodes[0]);for(a=b?d.content:d;0<a.childNodes.length;)q.call(c,a.childNodes[0])}})});N(Element.prototype,"setAttribute",function(a,c){if(1!==this.__CE_state)return A.call(this,a,c);var d=z.call(this,a);A.call(this,a,c);c=z.call(this,a);b.attributeChangedCallback(this,a,d,c,null)});N(Element.prototype,"setAttributeNS",function(a,c,d){if(1!==this.__CE_state)return D.call(this,
a,c,d);var e=C.call(this,a,c);D.call(this,a,c,d);d=C.call(this,a,c);b.attributeChangedCallback(this,c,e,d,a)});N(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return B.call(this,a);var c=z.call(this,a);B.call(this,a);null!==c&&b.attributeChangedCallback(this,a,c,null,null)});N(Element.prototype,"removeAttributeNS",function(a,c){if(1!==this.__CE_state)return E.call(this,a,c);var d=C.call(this,a,c);E.call(this,a,c);var e=C.call(this,a,c);d!==e&&b.attributeChangedCallback(this,
c,d,e,a)});ma?c(HTMLElement.prototype,ma):F?c(Element.prototype,F):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");na?d(HTMLElement.prototype,na):G?d(Element.prototype,G):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");Z(b,Element.prototype,{prepend:fa,append:ha});Da(b)};var P=window.customElements;function Fa(){var b=new O;Aa(b);Ba(b);Z(b,DocumentFragment.prototype,{prepend:da,append:ea});Ca(b);Ea(b);b=new Y(b);document.__CE_registry=b;Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:b})}P&&!P.forcePolyfill&&"function"==typeof P.define&&"function"==typeof P.get||Fa();window.__CE_installPolyfill=Fa;/*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
}).call(this);

//# sourceMappingURL=webcomponents-ce.js.map

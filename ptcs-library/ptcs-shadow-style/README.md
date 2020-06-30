# Shadow DOM CSS styling with ::part selector

## Overview

This is an experimental shim for the `::part` CSS selector as defined [here](https://drafts.csswg.org/css-shadow-parts-1/)

## Basic usage

### Component author

Apply `PTCS.ShadowPart.ShadowPartMixin` to any custom element that should expose parts for CSS styling. For example:
```javascript
let Custom = class extends PTCS.ShadowPart.ShadowPartMixin(Polymer.Element, [], ['primary','secondary'], ['type']) {}
```

Add the `part` attribute to a shadow tree element to make it available for styling. For example:
```html
<template>
  <div>
    <div part="title">{title}</div>
    <div part="body"></div>
  </div>
</template>
```
(`title` and `body` are available for styling)

Use the `exportparts` or `partmap` attribute to expose inner parts of the component for styling. For example:
```html
<template>
  <div>
    <x-inner part="inner" exportparts="p1: inner-p1"/>
  </div>
</template>
```
(`inner` and `inner-p1` are available for styling)

### HTML/CSS author

Use the `::part` selector inside CSS stylesheet to style parts that are exposed by a component. For example:
```css
x-custom[type=styled]::part(title):hover {
  color: blue;
}
```

Use the `ptcs-custom-css` element to include your CSS stylesheet in one of 3 ways:

* As an inline `<style>` element:
```html
  <ptcs-custom-css>
    <style>
      x-custom[type=styled]::part(title):hover {
        color: blue;
      }
    </style>
  </ptcs-custom-css>
```
* As a `<link>` element:
```html
  <ptcs-custom-css>
    <link rel="stylesheet" type="text/css" href="parts.css">
  </ptcs-custom-css>
```
* As a Polymer style module:
```html
  <link rel="import" href="parts.html">
  <ptcs-custom-css>
    <style include="parts"></style>
  </ptcs-custom-css>
```

## API

### Namespace

PTCS.ShadowPart

### Methods

| Method | Argument | Type | Description |
|----------|------|-------|------|
| ShadowPartMixin | | | The mixin that is applied to each custom element class |
| | stateAttributes | string[] | Change attributes used for styling (in addition to "disabled", "variant", "themable") |
| | constClasses | string[] | Class names to be treated as static (in addition to "ptcs-wrapper" and "widget-...")|
| | constAttributes | string[] | Attributes to be treated as static (in addition to "part")|
| queueApplyPartAll | | | Trigger styling of all ShadowPartMixin-derived elements in a tree |
| | container | host | Shadow container to be styled (use `document` for main html) |
| resetPartData | | | Clear cached styling data in a tree. Should be called after one or more <br/> `<style>` modifications in the tree and before `queryApplyPartAll` |
| | container | host | Shadow container to be cleaned (use `document` for main html) |
| findStyleRule | | | Returns corresponding rule index inside a `<style>` element |
| | style | HTMLStyleElement | `<style>` element |
| | rule | string | Rule to find |
| deleteStyleRule | | | Delete rule from a `<style>` element |
| | style | HTMLStyleElement | `<style>` element |
| | index | number | Rule index to delete |
| insertStyleRule | | | Insert rule into a `<style>` element at specified position|
| | style | HTMLStyleElement | `<style>` element |
| | rule | string | Rule to insert |
| | index | number | Position to insert (optional, defaults to 0) |

## Known Issues

* Works for custom elements that implement the `ShadowPartMixin` only.
* Styling for DOM that modifies `part` or `partmap` attributes after `ready()`
  requires a call to `this.queueApplyPart()`.
* Styling may be voided by presence of more specific selector
  for same part name and incompatible host selector. For example:
```css
  x-custom.hover::part(header)[alert] {
    background: red;
  }
  x-custom::part(header) {
    background: green;
  }
```
  May cause background for `x-custom::part(header)[alert]` be undefined.
  (Mainly in Safari or for partmapped parts in Chrome and Firefox)
* On IE/Edge shadow DOM styling may have weaker specificity than other CSS rules defined on the page. To make your rules take a precedence you should add more specificity.
  For example, you can make your rule stronger if you add the :not(.dummy) selector as many times as you need to overcome other CSS selectors.
  You can write your rule as:
```css
  x-custom::part(header):not(.dummy):not(.dummy):not(.dummy)
  {
    background: Green; height: 5px;
  }
```
* Some web components have a popup element that is attached to the _body_ (like _ptcs-dropdown, ptcs-datepicker..._). We don't have an option to style it "from the web component root". In the case of dropdown if you want to style the popup list you can apply a general rule for the list but it will affect all the lists on the page
```css
  ptcs-list::part(filter-field-hint-text) {
    color: green
  }
```
or you can look for the exact id of the dropdown list in F12 page and apply the rule accordingly
```css
  ptcs-list#root_ptcsdropdown-23-external-wc::part(filter-field-hint-text) {
    color: red
  }
```

## Implementation

1. The CSS styles are parsed for `::part` selectors. These are
re-written using CSS custom properties or regular selectors for ShadyCSS.

2. The element `shadowRoot` DOM is scanned for elements with `part` attributes.
A new style element is added with rules that match these attributes
corresponding to part properties provided as CSS custom properties from the
element ancestor.

### NOTE:
 When the `part` attribute values are modified inside the element shadow tree,
`this.queueApplyPart()` must be called. This is done automatically only when the
element is connected for the first time.


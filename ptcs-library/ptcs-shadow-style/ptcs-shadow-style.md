# ptcs-shadow-style (Deprecated)

## Overview

Provides CSS an abilitty to penetrate shadow DOM (similar to `:shadow` selector).  
Treats `shadow` element part of selector as a command to execute rest of selector inside shadow DOM.

## Usage Examples
### Contains `<style>` element
```html
    <ptcs-shadow-style>
    <style>
        .custom shadow [part=inner] {
            background: red;
        }
    </style>
    </ptcs-shadow-style>
```
### Using `css-text` attribute
```html
    <ptcs-shadow-style css-text="['.custom shadow [part=inner] { background: red; }']">
    </ptcs-shadow-style>
```

For each element with "custom" class and a shadow root styles in the shadow tree element with "part" attribute value "inner".

## Component API

### Properties
| Property | Type | Description |
|----------|------|-------------|
| cssText | string[] | Assigns CSS content |

### Content

Could contain `<style>` element (will be created out of 'cssText' property, if not exist).

### Methods

styleTree() - forcibly invokes styling process


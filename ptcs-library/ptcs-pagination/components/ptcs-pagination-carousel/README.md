# ptcs-pagination-carousel


## Overview

The carousel is the part of the pagination. It represents possible navigation buttons (numbers). The subcompoment may take "normal" and "smaller" size. In the later case only a few items is visible. Ckicking on the edge button causes the carousel to be refreshed. 

## Usage Examples

### Basic Usage

~~~html
<ptcs-pagination-carousel total-number-of-pages="10"></ptcs-pagination-carousel>
~~~

### Small version

~~~html
<ptcs-pagination-carousel total-number-of-pages="10" min-size></ptcs-pagination-carousel>
~~~

## Component API

### Properties
| Property | Type | Description | Triggers a changed event |
|--------- |------|-------------|--------------------------|
| currentPage | Number | The current selected page | No |
| totalNumberOfPages | Number | Corresponds to the number of buttons | No |
| minSize | Boolean | Carousel is displayed in the minimum size if set | No |

### Events

|  Name  | Data        | Description                         |
|--------|-------------|-------------------------------------|
| change | page number | Fired when the current page changes |


### Methods

No methods.

## Styling

### Parts

| Part | Description |
|-----------|-------------|
| left-arrow | The back arrow |
| three-dots | Three dots element between page number |
| page-number-button | Current page number as a button |
| right-arrow | The forward arrow |

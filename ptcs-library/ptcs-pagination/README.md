# ptcs-pagination


## Overview
Pagination is a web component to navigate data by diving it into small digestable pages. It help user mentally sizing the data,
get the sense of where they are, and efﬁciently locating their interested data. The pagination apperance changes & depends on the container size.

A few thoughts about the implementation:
* pageSize needs to be one of values defined by pageBreaks, e.g. if pageBreaks is ['10', '25', '50'], then pageSize can take either '10' or '25' or '50' 
* based on pageSize & totalNumberOfElements, the total number of pages is calculated, e.g. for 10 and 1000 appropriatetly, the maximum page number is 100
* pageSize & totalNumberOfElements can be set within the markup or outside using JS
* pageNumber is read only
* see examples below to find out more


## Sub-components

### ptcs-pagination-carousel

README: [components/ptcs-carousel/README.md](components/ptcs-carousel/README.md)

### ptcs-pagination-input-number

README: [components/ptcs-input-number/README.md](components/ptcs-input-number/README.md)


## Usage Examples

### Basic Usage

~~~html
<ptcs-pagination total-number-of-elements="50" page-size="10"></ptcs-pagination>
~~~

~~~js
const ptcsPagination = document.querySelector('ptcs-pagination');
ptcsPagination.addEventListener('page-number-changed', event => {
    const selectedPageNo = event.detail.value;
    console.log('Selected page no:', selectedPageNo);
});
...
ptcsPagination.totalNumberOfElements = 189;
...
ptcsPagination.pageSize = 2;
...
const pageBreaks = {
    firstBreak:  10,
    secondBreak: 25,
    thirdBreak:  50,
    fourthBreak: 75,
    fifthBreak:  100
};
ptcsPagination = Object.assign(ptcsPagination, pageBreaks)
...
~~~

## Component API

### Properties
| Property                 | Type    | Description | Triggers a changed event |
|------------------------- |---------|-------------|--------------------------|
| pageNumber               | Number  | The current selected page, cannot be set outside the component, read only | Yes |
| pageSize                 | Number  | The current page size, 1 by default | No |
| totalNumberOfElements    | Number  | Based on it the total number of pages is calculated, i.e. totalNumberOfPages / pageSize | No | 
| firstBreak               | Number  | The value for the first option that determines the number of results to display on a page. | No |
| secondBreak              | Number  | The value for the second option that determines the number of results to display on a page. | No |
| thirdBreak               | Number  | The value for the third option that determines the number of results to display on a page. | No |
| fourthBreak              | Number  | The value for the fourth option that determines the number of results to display on a page. | No |
| fifthBreak               | Number  | The value for the fifth option that determines the number of results to display on a page. | No |
| showPageBreak            | Boolean | Adds a drop-down list that enables users to select the number of results to show on each page. | No |
| showTotalResults         | Boolean | Enables you to display the total number of results that are returned from the server. | No |
| showDirectLink           | Boolean | Adds an input field that enables users to navigate to a specific page number. | No |



### Events
page-number-changed emmited when pageNumber poperty changes, see the example above

### Methods

No methods.

## Styling

### Parts
| Part | Description |
|-----------|-------------|
| page-break-and-total-results-container | The container for the "page-break-break", "string-show-label", "total-results" |
| page-break-control | The container for the label and dropdown |
| string-show-label | The label that is shown before "page-results-dropdown" element |
| page-results-dropdown | A dropdown with options for the number of results on the page. |
| total-results | The container of total results |
| total-results-label | The label that is shown the number of total elements |
| carousel | The component representing possible navigation buttons. **ptcs-pagination-carousel** |
| direct-link | The container for the label and input-number element |
| string-jump-to-label | The label that is shown before the "input-number" element |
| input-number | The component that allows only to type the positive, natural numbers. **ptcs-pagination-input-number** |

# ptcs-chart-bar

## Overview

`ptcs-chart-bar` is a compund component for visualising data as bar charts. Except for the bar chart itself, it also has areas for a title, notes, legend, an x-axis and a y-axis.

## Usage Examples

### Basic Usage

`<ptcs-chart-bar items="[[bar-chart-data]]"></ptcs-chart-bar>
`

## Component API

### Properties
| Property | Type | Description | Default |
|----------|------|-------------|---------|
|titleLabel|String|The chart title|
|titlePos|String| Specifies the title position. Supported values: "top", "bottom", "left", or "right" | top|
|titleAlign|String|Specifies the title alignment. Supported values: "left", "center", or "right" | center |
|notesLabel|String|The notes text|
|notesPos|String| Specifies the notes position. Supported values: "top", "bottom", "left", or "right" | bottom |
|notesAlign|String|Specifies the notes alignment. Supported values: "left", "center", or "right" | center |
|xAxisLabel|String|Specifies the x-axis label| |
|xAxisAlign|String|Specifies the alignment of the x-axis label. Supported values: "left", "center", or "right" | center |
|hideXAxis|Boolean| Hide the x-axis?| false |
|yAxisLabel|String|Specifies the y-axis label| |
|yAxisAlign|String|Specifies the alignment of the y-axis label. Supported values: "left", "center", or "right" | center |
|hideYAxis|Boolean| Hide the y-axis?| false |
|hideLegend|Boolean|Hide the legend?| false |
|legend|Array|Array of strings that specifies the legend names|
|legendPos|String| Specifies the legend position. Supported values: "top", "bottom", "left", or "right" | "right" |
|legendAlign|String|Specifies the alignment of the legend. Supported values: "start", "center", or "end" | start |
|legendShape| String | Specifies the shape of the legend. Supported values: "square", "circle", "none" | square|
|filterLegend|Boolean|If true, each legend item has a checkbox that allows the user to hide or show the corresponding data|false|
|flipAxes|Boolean|Flip the positions of the x- and y-axes|false|
|flipXAxis|Boolean|Flip the position of the x-axis to the other side of the chart|false|
|flipYAxis|Boolean|Flip the position of the y-axis to the other side of the chart|false|
|showXRulers|Boolean|Show rulers that corresponds to the ticks of the x-axis|false|
|showYRulers|Boolean|Show rulers that corresponds to the ticks of the y-axis|false|
|frontRulers|Boolean|Draw rulers on top of the bars|false|
|reverseXAxis|Boolean|Reverse the order of the x-axis|false|
|reverseYAxis|Boolean|Reverse the order of the y-axis|false|
|specXMin|String|Specifies the start label of the X-axis||
|specXMax|String|Specifies the end label of the X-axis||
|specYMin|"baseline" or "auto" or Number|Specifies the start value of the Y-axis. "baseline": start from zero if the minimum value in the data is non-negative. Otherwise use "auto". "auto": Use the minimum value of the data and subtract 20% of the full range of the data. Number: start at specified number, unless the data is less. If so, use "auto". |baseline|
|specYMax|"auto" or Number|Specifies the end value of the Y-axis. See specYMin for details| auto |
|xZoomSlider|Boolean|Show X-Axis Zoom Slider?| false |
|xZoomSliderLabel|String|Specifies the label for the X-axis Zoom Slider||
|xZoomSliderMaxLabel|String|Specifies the Maximum label for the X-axis Zoom Slider||
|xZoomSliderMinLabel|String|Specifies the Minimum label for the X-axis Zoom Slider||
|yZoomSlider|Boolean|Show Y-Axis Zoom Slider?| false |
|yZoomSliderLabel|String|Specifies the label for the Y-axis Zoom Slider||
|yZoomSliderMaxLabel|String|Specifies the Maximum label for the Y-axis Zoom Slider||
|yZoomSliderMinLabel|String|Specifies the Minimum label for the Y-axis Zoom Slider||
|data|Array|The chart data||
|stack|String| Stack method. Only used when each x-value have several y-values. Supported values: "none", "auto", "expand".| none |
|showValues|String| Show bar valuse. Supported values: "none", "inside", "outside"|inside|
|hideZeroRuler|Boolean|Hide the zero ruler?|false|
|outerPadding|Number|Padding, in percentage of bar width, before and after the bars in the chart area|0|
|innerPadding|Number|Padding, in percentage of bar width, between bars the belongs to different groups|0|
|groupPadding|Number|Padding, in percentage of bar width, between bars that belong to the same group|0|
|sparkView|Boolean|Displays chart preview by hiding certain parts e.g. legend  |false|

## Styling

### The Parts of a Bar Chart

A `ptcs-chart-bar` consist of these sub-components:

- [ptcs-chart-layout](./doc/ptcs-chart-layout.md), for the chart layout
- [ptcs-chart-legend](./doc/ptcs-chart-legend.md), for chart legend
- [ptcs-chart-coord](./doc/ptcs-chart-coord.md), for the chart  coordinate system
- [ptcs-chart-axis](./doc/ptcs-chart-axis.md), for the chart axes
- [ptcs-chart-core-bar](./doc/ptcs-chart-core-bar.md), for the bar charts

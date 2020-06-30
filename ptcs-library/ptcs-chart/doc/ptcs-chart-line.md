# ptcs-chart-line

## Overview

`ptcs-chart-line` is a compund component for visualising data as line charts.

The line chart can display:

 - _lines_
 - _areas_ between the line and the zero axis
 - _value markers_, e.g. circles, squares, triangles, etc
 - _values_, that are placed relative to the value marker (_above_, _below_, or _on_ top of it)

If the chart displays several series, the values can either be displayed as _independent_ lines / areas or _stacked_. In the latter case the component offers several stacking methods.

The x and y values can be _numbers_, _labels_, or _dates_ (i.e. JavaScript `Date` objects).

Depending on how the various properties are assigned, the line chart can render:

- Area Charts
- Line Charts
- Scatter plots
- Step Charts
- Streamgraphs
- Time Series Charts

Except for the line chart area itself, `ptcs-chart-line` also has areas for:
- a title
- notes
- a legend
- an x-axis, and
- a y-axis

## Usage Examples

### Basic Usage

```html
<ptcs-chart-line items=[[line-chart-data]]></ptcs-chart-line>
```

## Component API

### Properties
| Property | Type | Description | Default |
|----------|------|-------------|---------|
|titleLabel|String|The chart title|
|titlePos|String| Specifies the title position. Supported values: "top", "bottom", "left", or "right" | top|
|titleAlign|String|Specifies the title alignment. Supported values: "left", "center", or "right" | center |
|titleVariant|String|The `variant` assigned to the title `ptcs-label`|See `ptcs-label`|
|notesLabel|String|The notes text|
|hideNotes|Boolean|Hide the notes?|false|
|notesPos|String| Specifies the notes position. Supported values: "top", "bottom", "left", or "right" | bottom |
|notesAlign|String|Specifies the notes alignment. Supported values: "left", "center", or "right" | center |
|xAxisLabel|String|Specifies the x-axis label| |
|xAxisAlign|String|Specifies the alignment of the x-axis label. Supported values: "left", "center", or "right" | center |
|hideXAxis|Boolean| Hide the x-axis?| false |
|xType|String|Specifies the type of the x-values. Supported values: "number", "date", "string"|number|
|yAxisLabel|String|Specifies the y-axis label| |
|yAxisAlign|String|Specifies the alignment of the y-axis label. Supported values: "left", "center", or "right" | center |
|hideYAxis|Boolean| Hide the y-axis?| false |
|yType|String|Specifies the type of the y-values. Supported values: "number", "date", "string"|number|
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
|stackMethod|String| Stack method. Only used when each x-value have several y-values. Supported values: "auto", "expand", "diverging", "silhouette", "wiggle"| _Unassigned_ (no stacking) |
|stackOrder|String|Specifies the stacking order. Supported values: "auto", "reverse", "appearance", "ascending", "descending", "insideout"| auto|
|hideLines|Boolean|Hide the chart lines|false|
|marker|String|Specify the marker shape. Supportd values: "none", "square", "circle", "triangle", "plus", "cross"|none|
|markerSize|String or Number|Specify the marker size. Supported values: "small", "medium", "large", "xlarge", _number_ (pixels)|medium|
|showValues|String| Show values. The values are displayed relative to the _marker_ position. Supported values: "above", "on","below"|_Unassigned_ (hide values)|
|hideZeroRuler|Boolean|Hide the zero ruler?|false|
|curve|String|Specify the curve drawing method. Supported values: "linear", "basis", "bundle", "cardinal", "catmull-rom", "monotone-x", "monotone-y", "natural", "step"|linear|
|bundleBeta|`0` .. `1`|Parameter when `curve` = "bundle"|`0.5`|
|cardinalTension|`0` .. `1`|Parameter when `curve` = "cardinal"|`0.5`|
|catmullRomAlpha|`0` .. `1`|Parameter when `curve` = "catmull-rom"|`0.5`|
|stepPosition|String|Parameter when `curve` = "step". Supported values: "center", "before", "after"|center|
|sparkView|Boolean|Displays chart preview by hiding certain parts e.g. legend  |false|

### Events

| Name | Data | Description |
|------|------|-------------|
| series-click | Marker X value + Y Value | Click on a marker shape |
| series-click | Array of marker X value + Y Value | Click on an area of a series |

## Styling

### The Parts of a Line Chart

A `ptcs-chart-line` consist of these sub-components:

- [ptcs-chart-layout](./doc/ptcs-chart-layout.md), for the chart layout
- [ptcs-chart-legend](./doc/ptcs-chart-legend.md), for chart legend
- [ptcs-chart-coord](./doc/ptcs-chart-coord.md), for the chart  coordinate system
- [ptcs-chart-axis](./doc/ptcs-chart-axis.md), for the chart axes
- [ptcs-chart-core-line](./doc/ptcs-chart-core-line.md), for the core line chart functionality

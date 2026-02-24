# 1.2.0

- Added possibility to hide date or time for date time metrics.
- Changed the default open angle for gauges to align with older versions.

# 1.1.0

- Added opening gap in percent for gauge.
- Added status chart widget to display true, false (boolean) values.

# 1.0.0

- Added multi line support to LineChart.
- Added configuration layouts.
- Added min sdk support.
- Fixed an issue where bar charts would not auto recover if a metric value is not available at first.

# 0.0.11

## Bufixes

- Fixed line charts being cut off on the right.

# 0.0.10

## Bugfixes

- Fixed issue with thresholds.

# 0.0.9

## Changes

- Added thresholds for gauge, donut, bar and single value charts.
- Improved performance by using memoized values and only re-render if necessary.

## Bugfixes

- Fixed first render for gauge and donut.

# 0.0.8

## Changes

- Single values is now able to display resource metrics.

# 0.0.7

## Changes

- Single values now convert dates to the timezone of the app if possible.

# 0.0.6

## Changes

- Added support for date time values to single value.
- Added customizable limit how many values a line chart now stores at once.

## Bugfixes

- Fixed negative precision values to break single value.

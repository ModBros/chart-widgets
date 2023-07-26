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

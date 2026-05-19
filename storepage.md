A collection of highly customizable chart widgets for visualizing your metrics on your MoBro dashboard. Customize colors, fonts, thresholds, units, and more to build the perfect monitoring setup.

#### Bar Chart

A horizontal progress bar that fills based on a metric's current value relative to its maximum. 
Ideal for visualizing disk usage, memory consumption, and individual CPU thread loads. 
The bar smoothly animates as values change and can shift colors when warning or critical thresholds are crossed.

**Supports:** Numeric, Duration, and Currency metrics

#### Donut Chart

A full-circle ring chart that displays a single metric as a filled arc. 
Great for showing fan speeds, temperatures, and other metrics where you want a clean circular visualization. 
The arc animates smoothly between value changes.

**Supports:** Numeric, Duration, and Currency metrics

#### Gauge Chart

A partial-arc gauge with an open bottom, similar to a speedometer. 
Best suited for CPU and GPU usage where threshold zones give you an immediate visual indication of load levels. 
An optional outer threshold ring shows normal, warning, and critical zones at a glance.

**Supports:** Numeric, Duration, and Currency metrics

#### Line Chart

A time-series line chart that plots metric values over time. 
Supports multiple overlaid lines for comparing metrics side by side. 
Use it to track temperatures, clock speeds, frame rates, or any value that changes over time.

**Supports:** Numeric, Duration, and Currency metrics

#### Single Value

A text-based widget that displays the current value of any metric type. 
It handles numeric values, text, booleans, dates/times, and even resource images. 
Use it whenever you want a clean, readable display of a single data point.

**Supports:** All metric types (Numeric, Text, Boolean, DateTime, Resource)

#### Status Chart

A boolean indicator that visually represents true/false or on/off states. 
Display status using colored circles (traffic light style) or upload custom images for each state. 
Use it for monitoring whether a fan is running, a service is online, or any other binary status.

**Supports:** Boolean metrics only

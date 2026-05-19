A collection of highly customizable chart widgets for visualizing your metrics on your MoBro dashboard. Customize colors, fonts, thresholds, units, and more to build the perfect monitoring setup.

### Bar Chart

A horizontal progress bar that fills based on a metric's current value relative to its maximum. 
Ideal for visualizing disk usage, memory consumption, and individual CPU thread loads. 
The bar smoothly animates as values change and can shift colors when warning or critical thresholds are crossed.

**Supports:** Numeric, Duration, and Currency metrics

**Key features:**

- Animated fill with smooth transitions
- Customizable foreground, background, and corner radius
- Warning and critical color thresholds (percentage-based)
- Automatic or manual max value

---

### Donut Chart

A full-circle ring chart that displays a single metric as a filled arc. 
Great for showing fan speeds, temperatures, and other metrics where you want a clean circular visualization. 
The arc animates smoothly between value changes.

**Supports:** Numeric, Duration, and Currency metrics

**Key features:**

- Animated arc with smooth transitions
- Configurable ring thickness and corner radius
- Customizable foreground and background colors
- Warning and critical color thresholds (percentage-based)
- Automatic or manual max value

---

### Gauge Chart

A partial-arc gauge with an open bottom, similar to a speedometer. 
Best suited for CPU and GPU usage where threshold zones give you an immediate visual indication of load levels. 
An optional outer threshold ring shows normal, warning, and critical zones at a glance.

**Supports:** Numeric, Duration, and Currency metrics

**Key features:**

- Configurable opening gap to control the arc shape
- Adjustable thickness and corner radius
- Visible threshold ring segmented into normal/warning/critical zones (can be hidden)
- Warning and critical color thresholds with customizable colors
- Automatic or manual max value

---

### Line Chart

A time-series line chart that plots metric values over time. 
Supports multiple overlaid lines for comparing metrics side by side. 
Use it to track temperatures, clock speeds, frame rates, or any value that changes over time.

**Supports:** Numeric, Duration, and Currency metrics

**Key features:**

- Multiple lines on a single chart
- Configurable amount of history entries
- Y-axis with min/max bounds, scale options (linear, logarithmic, quadratic, cubic), and customizable labels
- Line appearance: color, width, curve type (linear, monotone, natural), and optional area fill
- Hideable Y-axis for a minimal look

---

### Single Value

A text-based widget that displays the current value of any metric type. 
It handles numeric values, text, booleans, dates/times, and even resource images. 
Use it whenever you want a clean, readable display of a single data point.

**Supports:** All metric types (Numeric, Text, Boolean, DateTime, Resource)

**Key features:**

- Full alignment control: vertical, horizontal, label/value ordering, gap, and space-between
- Customizable label: text override, font, color, size, or hide entirely
- Customizable value: font, color, size, precision, unit display options
- Warning and critical color thresholds for numeric values
- Date/time formatting: 12h/24h clock, configurable date format (DMY/YMD/MDY) and separator
- Text truncation: none, ellipsis, or running marquee
- Renders images for resource-type metrics

---

### Status Chart

A boolean indicator that visually represents true/false or on/off states. 
Display status using colored circles (traffic light style) or upload custom images for each state. 
Use it for monitoring whether a fan is running, a service is online, or any other binary status.

**Supports:** Boolean metrics only

**Key features:**

- Traffic light mode: colored circle indicator with customizable true/false colors
- Image mode: upload separate images for true and false states
- Images take priority over colors when both are configured

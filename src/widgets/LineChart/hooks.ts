import { TimedMetricValue } from '../../utils/useMetricFieldHistory'
import { scaleLinear, scaleLog, scalePow } from 'd3-scale'
import { extent } from 'd3-array'

export function useGetTimestamp() {
  return (d: TimedMetricValue) => {
    return d.timestamp
  }
}

export function useGetValue() {
  return (d: TimedMetricValue) => {
    return parseFloat(d.metricValue.value.toString())
  }
}

export function useTimeScale(
  width: number,
  hideYAxis: boolean,
  yaxisLabelSpace: number,
  values: TimedMetricValue[]
) {
  const getTimestamp = useGetTimestamp()

  return scaleLinear()
    .range([0, hideYAxis ? width : width - yaxisLabelSpace])
    .domain(extent(values, getTimestamp))
}

function getScale(scale: string) {
  switch (scale) {
    default:
    case 'linear':
      return scaleLinear()

    case 'log':
      return scaleLog()

    case 'quadratic':
      return scalePow().exponent(2)

    case 'cubic':
      return scalePow().exponent(3)
  }
}

export function useValueScale(
  lineScale: string,
  height: number,
  hideYAxis: boolean,
  yaxisLabelFontSize: number,
  domain: [number, number]
) {
  return getScale(lineScale)
    .range([hideYAxis ? height : height - yaxisLabelFontSize * 2, 0])
    .domain(domain)
}

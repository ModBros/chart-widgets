import {ChannelValue} from "@modbros/dashboard-core";

export function getMetricMaxValue(channelValue: ChannelValue, maxValue?: number): number {
  const metricValue = channelValue?.value
  const metricStatistics = metricValue?.statistics
  const value = parseFloat(metricValue?.value?.toString())

  return Math.max(
    maxValue ?? parseFloat(metricStatistics?.max?.toString() ?? 0),
    value
  )
}

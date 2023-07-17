import { ChannelValue } from '@modbros/dashboard-core'

export function getMetricMaxValue(
  channelValue: ChannelValue,
  maxValue?: number
): number {
  const metricValue = channelValue?.value
  const metricStatistics = metricValue?.statistics
  const value = parseFloat(metricValue?.value?.toString())

  return Math.max(
    maxValue ?? parseFloat(metricStatistics?.max?.toString() ?? '0'),
    value
  )
}

export function format24h(hideSeconds: boolean): string {
  return hideSeconds ? 'HH:MM' : 'HH:MM:ss'
}

export function format12h(hideSeconds: boolean): string {
  return hideSeconds ? 'hh:MM TT' : 'hh:MM:ss TT'
}

export function formatDate(format: string, separator: string): string {
  return format
    .replace('Y', 'yyyy')
    .replace('M', 'mm')
    .replace('D', 'dd')
    .replaceAll('-', separator)
}

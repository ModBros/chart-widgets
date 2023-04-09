import {ChannelValue} from "@modbros/dashboard-core";

export function getMetricMaxValue(channelValue: ChannelValue, maxValue?: number): number {
  const metricValue = channelValue?.value
  const metricStatistics = metricValue?.statistics
  const value = parseFloat(metricValue?.value?.toString())

  return Math.max(
    maxValue ?? parseFloat(metricStatistics?.max?.toString() ?? '0'),
    value
  )
}

function formatDateTimePart(part: string | number): string {
  return part.toString().padStart(2, '0');
}

export function format24h(now: Date, hideSeconds: boolean): string {
  const hours = formatDateTimePart(now.getHours());
  const minutes = formatDateTimePart(now.getMinutes());
  const seconds = formatDateTimePart(now.getSeconds());

  const parts = [hours, minutes]

  if (!hideSeconds) {
    parts.push(seconds)
  }

  return parts.join(':')
}

export function format12h(date: Date, hideSeconds: boolean): string {
  const suffix = date.getHours() < 12 ? ' AM' : ' PM'
  const h = date.getHours() % 12
  const hours = formatDateTimePart(h ? h : 12);
  const minutes = formatDateTimePart(date.getMinutes());
  const seconds = formatDateTimePart(date.getSeconds());

  const parts = [hours, minutes]

  if (!hideSeconds) {
    parts.push(seconds)
  }

  return `${parts.join(':')}${suffix}`
}

export function formatDate(date: Date, format: string, separator: string): string {
  const day = formatDateTimePart(date.getDate())
  const month = formatDateTimePart(date.getMonth() + 1)
  const year = date.getFullYear().toString()

  return format
    .replace('Y', year)
    .replace('M', month)
    .replace('D', day)
    .replaceAll('-', separator)
}

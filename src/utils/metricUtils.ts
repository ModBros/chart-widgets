import { ChannelValue } from '@modbros/dashboard-core'
import { Color, useColorField, useNumberField } from '@modbros/dashboard-sdk'
import {
  defaultChartCriticalColor,
  defaultChartWarningColor
} from './constants'
import { isFinite } from 'lodash-es'

export function getMetricMaxValue(
  channelValue: ChannelValue,
  maxValue?: number
): number {
  const metricValue = channelValue?.value
  const metricStatistics = metricValue?.statistics
  const value = isFinite(metricValue?.value)
    ? parseFloat(metricValue?.value?.toString())
    : 0

  if (isFinite(maxValue)) {
    return Math.max(maxValue, value)
  }

  if (isFinite(metricStatistics?.max)) {
    return Math.max(parseFloat(metricStatistics?.max?.toString()), value)
  }

  return Math.max(0, value)
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

export function thresholdValue(max: number, percentage: number): number {
  return (percentage * max) / 100
}

export function useThresholds(
  defaultColor: Color,
  max: number,
  useDefaultThresholds = false
) {
  const warningThreshold = useNumberField({
    field: 'warning_threshold',
    defaultValue: useDefaultThresholds ? 50 : 0
  })
  const warningColor = useColorField({
    field: 'warning_color',
    defaultColor: useDefaultThresholds ? defaultChartWarningColor : undefined
  })
  const criticalThreshold = useNumberField({
    field: 'critical_threshold',
    defaultValue: useDefaultThresholds ? 90 : 0
  })
  const criticalColor = useColorField({
    field: 'critical_color',
    defaultColor: useDefaultThresholds ? defaultChartCriticalColor : undefined
  })

  const warningValue = thresholdValue(max, warningThreshold)
  const criticalValue = thresholdValue(max, criticalThreshold)

  return {
    warningValue,
    warningColor,
    criticalValue,
    criticalColor,
    getColor(value: number) {
      let color = defaultColor

      if (warningValue && warningColor.toRgbaCss() && value >= warningValue) {
        color = warningColor
      }

      if (
        criticalValue &&
        criticalColor.toRgbaCss() &&
        value >= criticalValue
      ) {
        color = criticalColor
      }

      return color
    }
  }
}

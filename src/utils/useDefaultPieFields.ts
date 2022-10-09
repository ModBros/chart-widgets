import {
  useColorField,
  useItemSize,
  useMetricField,
  useNumberField
} from '@modbros/dashboard-sdk'
import {getMetricMaxValue} from "./metricUtils";

export function useDefaultPieFields(defaultColor: string = '#000000') {
  const { width, height } = useItemSize()
  const thickness = useNumberField({
    field: 'thickness',
    defaultValue: 15
  })
  const cornerRadius = useNumberField({
    field: 'corner_radius',
    defaultValue: 0
  })
  const channelValue = useMetricField({ field: 'metric' })
  const color = useColorField({ field: 'color', defaultColor })
  const backColor = useColorField({ field: 'back_color' })
  const maxValue = useNumberField({ field: 'max' })

  const metricValue = channelValue?.value

  const diameter = Math.min(width, height)
  const radius = diameter / 2
  const value = parseFloat(metricValue?.value?.toString())
  const max = getMetricMaxValue(channelValue, maxValue);

  return {
    width,
    height,
    thickness,
    cornerRadius,
    channelValue,
    color,
    backColor,
    max,
    radius,
    value
  }
}

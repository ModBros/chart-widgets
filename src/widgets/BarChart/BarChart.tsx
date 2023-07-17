import React, { FunctionComponent, useCallback } from 'react'
import { Shape } from '@visx/visx'
import {
  useColorField,
  useMemoizedMetricField,
  useNumberField,
  MissingConfigPlaceholder,
  Loading,
  useIsMetricFieldConfigured,
  useCheckboxField,
  Color
} from '@modbros/dashboard-sdk'
import { getMetricMaxValue } from '../../utils/metricUtils'
import { animated, useSpring } from 'react-spring'
import { ChannelValue } from '@modbros/dashboard-core'

interface AnimatedBarProps {
  width: number
  color: Color
  cornerRadius: number
}

const AnimatedVisxBar = animated(Shape.Bar)

const AnimatedBar: FunctionComponent<AnimatedBarProps> = (props) => {
  const { width, color, cornerRadius } = props

  const styles = useSpring({ width: `${width}%` })

  return (
    <AnimatedVisxBar
      x={0}
      y={0}
      height='100%'
      rx={cornerRadius}
      ry={cornerRadius}
      style={styles}
      fill={color.toRgbaCss()}
    />
  )
}

const BarChart: FunctionComponent = () => {
  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })
  const color = useColorField({ field: 'color', defaultColor: '#000000' })
  const backColor = useColorField({
    field: 'back_color',
    defaultColor: '#ffffff'
  })
  const maxValue = useNumberField({ field: 'max' })
  const cornerRadius = useNumberField({
    field: 'corner_radius',
    defaultValue: 0
  })

  const memo = useCallback((channelValue: ChannelValue) => {
    return Math.round(parseFloat(channelValue.value?.value?.toString()))
  }, [])

  const { value, channelValue } = useMemoizedMetricField({
    field: 'metric',
    memo
  })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!channelValue?.value) {
    return <Loading />
  }

  const max = getMetricMaxValue(channelValue, maxValue)
  const width = max !== 0 ? (value * 100) / max : 0

  return (
    <svg width={'100%'} height={'100%'}>
      <Shape.Bar
        x={0}
        y={0}
        rx={cornerRadius}
        ry={cornerRadius}
        height='100%'
        width='100%'
        fill={backColor.toRgbaCss()}
      />
      <AnimatedBar width={width} color={color} cornerRadius={cornerRadius} />
    </svg>
  )
}

export default BarChart

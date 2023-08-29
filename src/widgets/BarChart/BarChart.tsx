import React, {FunctionComponent, useCallback} from 'react'
import {Shape} from '@visx/visx'
import {
  Color,
  Loading,
  MissingConfigPlaceholder,
  useColorField,
  useIsMetricFieldConfigured,
  useMemoizedMetricField,
  useNumberField
} from '@modbros/dashboard-sdk'
import {getMetricMaxValue, useThresholds} from '../../utils/metricUtils'
import {animated, useSpring} from 'react-spring'
import {ChannelValue} from '@modbros/dashboard-core'
import {defaultChartBackColor, defaultChartFrontColor} from '../../utils/constants'

interface AnimatedBarProps {
  width: number
  color: Color
  cornerRadius: number
}

const AnimatedVisxBar = animated(Shape.Bar)

const AnimatedBar: FunctionComponent<AnimatedBarProps> = (props) => {
  const {width, color, cornerRadius} = props

  const styles = useSpring({width: `${width}%`})

  return (
    <AnimatedVisxBar
      x={0}
      y={0}
      height="100%"
      rx={cornerRadius}
      ry={cornerRadius}
      style={styles}
      fill={color.toRgbaCss()}
    />
  )
}

const BarChart: FunctionComponent = () => {
  const metricConfigured = useIsMetricFieldConfigured({field: 'metric'})
  const color = useColorField({field: 'color', defaultColor: defaultChartFrontColor})
  const backColor = useColorField({
    field: 'back_color',
    defaultColor: defaultChartBackColor
  })

  const cornerRadius = useNumberField({
    field: 'corner_radius',
    defaultValue: 0
  })
  const maxValue = useNumberField({field: 'max'})

  const memo = useCallback((channelValue: ChannelValue) => {
    return Math.round(parseFloat(channelValue.value?.value?.toString()))
  }, [])

  const {value, channelValue} = useMemoizedMetricField({
    field: 'metric',
    memo
  })

  const max = getMetricMaxValue(channelValue, maxValue)
  const {getColor} = useThresholds(color, max)

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'}/>
  }

  if (!channelValue?.value) {
    return <Loading/>
  }

  const width = max !== 0 ? (value * 100) / max : 0

  return (
    <svg width={'100%'} height={'100%'}>
      <Shape.Bar
        x={0}
        y={0}
        rx={cornerRadius}
        ry={cornerRadius}
        height="100%"
        width="100%"
        fill={backColor.toRgbaCss()}
      />
      <AnimatedBar
        width={width}
        color={getColor(value)}
        cornerRadius={cornerRadius}
      />
    </svg>
  )
}

export default BarChart

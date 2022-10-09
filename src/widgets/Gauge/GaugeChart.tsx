import React, {FunctionComponent} from 'react'
import {AnimatedPieChart} from '../../components/AnimatedPieChart'
import {Shape} from '@visx/visx'
import {useDefaultPieFields} from '../../utils/useDefaultPieFields'
import {
  Loading,
  MissingConfigPlaceholder,
  useCheckboxField,
  useColorField,
  useIsMetricFieldConfigured,
  useNumberField
} from '@modbros/dashboard-sdk'

function thresholdValue(max: number, percentage: number): number {
  return (percentage * max) / 100
}

const GaugeChart: FunctionComponent = () => {
  const {
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
  } = useDefaultPieFields('#00ff1e')

  const metricConfigured = useIsMetricFieldConfigured({field: 'metric'})

  const hideThresholds = useCheckboxField({field: 'hide_thresholds'})
  const warningThreshold = useNumberField({
    field: 'warning_threshold',
    defaultValue: 50
  })
  const warningColor = useColorField({
    field: 'warning_color',
    defaultColor: '#ffff1e'
  })
  const criticalThreshold = useNumberField({
    field: 'critical_threshold',
    defaultValue: 90
  })
  const criticalColor = useColorField({
    field: 'critical_color',
    defaultColor: '#ff0000'
  })

  if(!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'}/>;
  }

  if (!channelValue?.value) {
    return <Loading/>
  }

  const angleFactor = 1.5
  const endAngle = Math.PI / angleFactor
  const startAngle = -endAngle
  const thresholdThickness = !hideThresholds ? thickness / 3 : 0

  const warningValue = thresholdValue(max, warningThreshold)
  const criticalValue = thresholdValue(max, criticalThreshold)

  let currentColor = color

  if (value >= warningValue && value < criticalValue) {
    currentColor = warningColor
  }

  if (value >= criticalValue) {
    currentColor = criticalColor
  }

  return (
    <AnimatedPieChart
      thickness={thickness}
      channelValue={channelValue}
      color={currentColor}
      backColor={backColor}
      cornerRadius={cornerRadius}
      max={max}
      radius={radius}
      outerRadius={radius - thresholdThickness - 5}
      width={width}
      height={height}
      value={value}
      startAngle={startAngle}
      endAngle={endAngle}
    >
      {!hideThresholds && (
        <Shape.Pie
          outerRadius={radius}
          innerRadius={radius - thresholdThickness}
          data={[
            warningValue,
            max - warningValue - (max - criticalValue),
            max - criticalValue
          ]}
          startAngle={startAngle}
          endAngle={endAngle}
          pieSort={null}
          pieSortValues={null}
        >
          {(pie) =>
            pie.arcs.map((arc) => (
              <path
                key={arc.index}
                d={pie.path(arc)}
                fill={
                  [
                    color.toRgbaCss(),
                    warningColor.toRgbaCss(),
                    criticalColor.toRgbaCss()
                  ][arc.index]
                }
              />
            ))
          }
        </Shape.Pie>
      )}
    </AnimatedPieChart>
  )
}

export default GaugeChart

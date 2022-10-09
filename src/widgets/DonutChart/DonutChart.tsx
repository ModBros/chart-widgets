import React, {FunctionComponent} from 'react'
import {AnimatedPieChart} from '../../components/AnimatedPieChart'
import {useDefaultPieFields} from '../../utils/useDefaultPieFields'
import {Loading, MissingConfigPlaceholder, useIsMetricFieldConfigured} from "@modbros/dashboard-sdk";

const DonutChart: FunctionComponent = () => {
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
  } = useDefaultPieFields()

  const metricConfigured = useIsMetricFieldConfigured({field: 'metric'})

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'}/>;
  }

  if (!channelValue?.value) {
    return <Loading/>
  }

  return (
    <AnimatedPieChart
      thickness={thickness}
      channelValue={channelValue}
      color={color}
      backColor={backColor}
      cornerRadius={cornerRadius}
      max={max}
      radius={radius}
      width={width}
      height={height}
      value={value}
    />
  )
}

export default DonutChart

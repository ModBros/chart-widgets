import { Axis } from '@visx/visx'
import React, { useContext } from 'react'
import { Color, useItemSize } from '@modbros/dashboard-sdk'
import { useValueScale } from './hooks'
import { DomainContext } from './DomainContext'
import { UnitContext } from './UnitContext'

export const LeftAxis = (props: {
  hideYAxis: boolean
  lineScale: string
  labelColor: Color
  labelFontSize: number
  labelFontFamily: string
}) => {
  const { lineScale, hideYAxis, labelColor, labelFontSize, labelFontFamily } =
    props

  const { height } = useItemSize()
  const [domain] = useContext(DomainContext)
  const [unit] = useContext(UnitContext)

  const valueScale = useValueScale(
    lineScale,
    height,
    hideYAxis,
    labelFontSize,
    domain
  )

  if (hideYAxis) {
    return null
  }

  return (
    <Axis.AxisLeft
      tickStroke='transparent'
      tickComponent={({ formattedValue, ...props }) => (
        <text
          {...props}
          fill={labelColor.toRgbaCss()}
          fontSize={labelFontSize}
          fontFamily={labelFontFamily}
        >
          {formattedValue}
        </text>
      )}
      hideAxisLine={true}
      tickValues={domain}
      tickFormat={(value) => `${value} ${unit?.abbreviation}`}
      scale={valueScale}
    />
  )
}

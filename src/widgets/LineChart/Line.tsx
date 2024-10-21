import { Curve, Shape } from '@visx/visx'
import React, { useContext, useEffect } from 'react'
import {
  useColorField,
  useIsMetricFieldConfigured,
  useItemSize
} from '@modbros/dashboard-sdk'
import { useMetricFieldHistory } from '../../utils/useMetricFieldHistory'
import {
  useGetTimestamp,
  useGetValue,
  useTimeScale,
  useValueScale
} from './hooks'
import { defaultChartFrontColor } from '../../utils/constants'
import { DomainContext } from './DomainContext'
import { UnitContext } from './UnitContext'
import { useResetValues, useSetValues } from './AllValuesContext'

function getCurve(curve: string) {
  switch (curve) {
    default:
    case 'linear':
      return Curve.curveLinear

    case 'monotone':
      return Curve.curveMonotoneX

    case 'natural':
      return Curve.curveNatural
  }
}

export const Line = (props: {
  lineId: string
  curve: string
  lineWidth: number
  hideYAxis: boolean
  yaxisLabelSpace: number
  yaxisLabelFontSize: number
  historyCount: number
  lineScale: string
  fillLine: boolean
  definesUnit?: boolean
}) => {
  const {
    lineId,
    curve,
    lineWidth,
    historyCount,
    hideYAxis,
    yaxisLabelSpace,
    yaxisLabelFontSize,
    lineScale,
    fillLine,
    definesUnit
  } = props
  const { width, height } = useItemSize()
  const [domain] = useContext(DomainContext)
  const [_unit, setUnit] = useContext(UnitContext)
  const setValues = useSetValues()
  const resetValues = useResetValues()

  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })
  const { values, unit } = useMetricFieldHistory({
    field: 'metric',
    limit: historyCount
  })
  const lineColor = useColorField({
    field: 'line_color',
    defaultColor: defaultChartFrontColor
  })
  const fillColor = useColorField({
    field: 'line_fill_color'
  })
  const getTimestamp = useGetTimestamp()
  const getValue = useGetValue()
  const timeScale = useTimeScale(width, hideYAxis, yaxisLabelSpace, values)
  const valueScale = useValueScale(
    lineScale,
    height,
    hideYAxis,
    yaxisLabelFontSize,
    domain
  )

  // reset values on un-mount
  useEffect(() => {
    return () => {
      resetValues(lineId)
    }
  }, [])

  // set values on change
  useEffect(() => {
    if (!definesUnit || unit?.abbreviation === _unit?.abbreviation) {
      return
    }

    setUnit(unit)
  }, [unit])

  // re-add all values on render
  useEffect(() => {
    setValues(lineId, values)
  }, [values])

  if (!metricConfigured) {
    return null
  }

  if (!fillColor.isEmpty() || fillLine) {
    return (
      <Shape.AreaClosed
        yScale={valueScale}
        stroke={lineColor.toRgbaCss()}
        fill={
          !fillColor.isEmpty() ? fillColor.toRgbaCss() : lineColor.toRgbaCss()
        }
        curve={getCurve(curve)}
        strokeWidth={lineWidth}
        data={values}
        x={(d) => timeScale(getTimestamp(d)) ?? 0}
        y={(d) => valueScale(getValue(d)) ?? 0}
      />
    )
  }

  return (
    <Shape.Area
      stroke={lineColor.toRgbaCss()}
      curve={getCurve(curve)}
      strokeWidth={lineWidth}
      data={values}
      x={(d) => timeScale(getTimestamp(d)) ?? 0}
      y={(d) => valueScale(getValue(d)) ?? 0}
    />
  )
}

import React, { FunctionComponent } from 'react'
import {
  MissingConfigPlaceholder,
  Repeater,
  useCheckboxField,
  useColorField,
  useFontField,
  useIsMetricFieldConfigured,
  useItemSize,
  useNumberField,
  useSelectField
} from '@modbros/dashboard-sdk'
import { Group } from '@visx/visx'
import { LeftAxis } from './LeftAxis'
import { Line } from './Line'
import { DomainProvider } from './DomainContext'
import { UnitProvider } from './UnitContext'
import { AllValuesProvider } from './AllValuesContext'
import { CalculateDomain } from './CalculateDomain'

const _LineChart: FunctionComponent = () => {
  const { width, height } = useItemSize()
  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })
  const historyCount = useNumberField({
    field: 'history_count',
    defaultValue: 15
  })
  const lineCurve = useSelectField({
    field: 'line_curve',
    defaultValue: 'linear'
  })
  const lineScale = useSelectField({
    field: 'line_scale',
    defaultValue: 'linear'
  })
  const maxValue = useNumberField({ field: 'max' })
  const minValue = useNumberField({ field: 'min' })
  const lineWidth = useNumberField({ field: 'line_width', defaultValue: 3 })
  const hideYAxis = useCheckboxField({ field: 'hide_yaxis' })
  const yaxisLabelFontSize = useNumberField({
    field: 'yaxis_label_font_size',
    defaultValue: 12
  })
  const yaxisLabelFont = useFontField({ field: 'yaxis_label_font' })
  const yaxisLabelSpace = useNumberField({
    field: 'yaxis_label_space',
    defaultValue: yaxisLabelFontSize * 4
  })
  const yaxisLabelColor = useColorField({
    field: 'yaxis_label_color',
    defaultColor: '#000000'
  })
  const fillLine = useCheckboxField({ field: 'fill_line' })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  return (
    <svg width={width} height={height}>
      <Group.Group
        left={hideYAxis ? 0 : yaxisLabelSpace}
        top={hideYAxis ? 0 : yaxisLabelFontSize}
        height={hideYAxis ? height : height - yaxisLabelFontSize * 2}
      >
        <Repeater field={'additional_lines'}>
          {(_item, index) => (
            <Line
              lineId={index.toString()}
              key={index}
              curve={lineCurve}
              lineWidth={lineWidth}
              hideYAxis={hideYAxis}
              yaxisLabelSpace={yaxisLabelSpace}
              yaxisLabelFontSize={yaxisLabelFontSize}
              historyCount={historyCount}
              lineScale={lineScale}
              fillLine={fillLine}
            />
          )}
        </Repeater>

        <Line
          lineId={'default'}
          curve={lineCurve}
          lineWidth={lineWidth}
          hideYAxis={hideYAxis}
          yaxisLabelSpace={yaxisLabelSpace}
          yaxisLabelFontSize={yaxisLabelFontSize}
          historyCount={historyCount}
          lineScale={lineScale}
          fillLine={fillLine}
          definesUnit
        />

        <CalculateDomain minValue={minValue} maxValue={maxValue} />

        <LeftAxis
          hideYAxis={hideYAxis}
          lineScale={lineScale}
          labelColor={yaxisLabelColor}
          labelFontSize={yaxisLabelFontSize}
          labelFontFamily={yaxisLabelFont}
        />
      </Group.Group>
    </svg>
  )
}

const LineChart = () => {
  return (
    <AllValuesProvider>
      <DomainProvider>
        <UnitProvider>
          <_LineChart />
        </UnitProvider>
      </DomainProvider>
    </AllValuesProvider>
  )
}

export default LineChart

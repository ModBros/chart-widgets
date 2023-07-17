import React, { CSSProperties, FunctionComponent, useCallback } from 'react'
import {
  Loading,
  MissingConfigPlaceholder,
  useCheckboxField,
  useColorField,
  useFontField,
  useFormatMetricValue,
  useIsMetricFieldConfigured,
  useMemoizedMetricField,
  useMetricFieldValueType,
  useNumberField,
  useSelectField,
  useStringField
} from '@modbros/dashboard-sdk'
import styled from 'styled-components'
import { isEmpty } from 'lodash-es'
import {
  ChannelValue,
  createMetricResourcePath,
  FormattedMetricValue
} from '@modbros/dashboard-core'
import {
  format12h,
  format24h,
  formatDate,
  getMetricMaxValue,
  useThresholds
} from '../../utils/metricUtils'

const Container = styled.div`
  display: flex;
`

const InnerContainer = styled.div`
  display: flex;
  gap: 3px;
`

interface ChannelValueProp {
  channelValue: ChannelValue
}

const Unit: FunctionComponent<{ unit: string }> = (props) => {
  const { unit } = props

  const smallUnit = useCheckboxField({ field: 'small_unit' })
  const hideUnit = useCheckboxField({ field: 'hide_unit' })

  if (hideUnit) {
    return null
  }

  if (smallUnit) {
    return (
      <small
        style={{
          fontSize: '0.5em'
        }}
      >
        {unit}
      </small>
    )
  }

  return <span>{unit}</span>
}

function useFormatValue() {
  const precision = useNumberField({ field: 'precision', defaultValue: 0 })
  const selectedTimeFormat = useSelectField({
    field: 'time_format',
    defaultValue: '24h'
  })
  const selectedDateFormat = useSelectField({
    field: 'date_format',
    defaultValue: 'Y-M-D'
  })
  const dateSeparator = useSelectField({
    field: 'date_separator',
    defaultValue: '-'
  })
  const hideSeconds = useCheckboxField({ field: 'hide_seconds' })
  const dateFormat = formatDate(selectedDateFormat, dateSeparator)
  const timeFormat =
    selectedTimeFormat === '12h'
      ? format12h(hideSeconds)
      : format24h(hideSeconds)
  const valueFontSize = useNumberField({ field: 'value_font_size' })

  const format = useFormatMetricValue()

  return useCallback(
    (channelValue: ChannelValue) => {
      return format(channelValue, {
        precision,
        valueBasedPrecision: true,
        timeFormat,
        dateFormat,
        dateTimeFormat: `${dateFormat} ${timeFormat}`,
        formatResource(resourceId) {
          return (
            <img
              alt={resourceId}
              style={{ height: valueFontSize ?? '1em', width: 'auto' }}
              src={createMetricResourcePath(resourceId)}
            />
          )
        }
      })
    },
    [format, precision, timeFormat, dateFormat]
  )
}

const Value: FunctionComponent<
  ChannelValueProp & { value: FormattedMetricValue }
> = (props) => {
  const { value, channelValue } = props

  const valueFont = useFontField({ field: 'value_font' })
  const valueFontSize = useNumberField({ field: 'value_font_size' })
  const valueFontColor = useColorField({ field: 'value_font_color' })
  const maxValue = useNumberField({ field: 'max' })
  const max = getMetricMaxValue(channelValue, maxValue)
  const { getColor } = useThresholds(valueFontColor, max)

  let color = valueFontColor

  if (channelValue.type.valueType === 'Numeric') {
    color = getColor(parseFloat(channelValue.value.value?.toString() ?? '0'))
  }

  return (
    <strong
      style={{
        fontFamily: valueFont,
        fontSize: valueFontSize ? `${valueFontSize}px` : undefined,
        color: color.toRgbaCss()
      }}
    >
      <span>{value.value}</span>

      <Unit unit={value.unit} />
    </strong>
  )
}

const Label: FunctionComponent<ChannelValueProp> = (props) => {
  const { channelValue } = props
  const { metric } = channelValue

  const hideLabel = useCheckboxField({ field: 'hide_label' })
  const customLabel = useStringField({ field: 'label' })

  if (hideLabel) {
    return null
  }

  return <span>{!isEmpty(customLabel) ? customLabel : metric.label}</span>
}

const SingleValue: FunctionComponent = () => {
  const verticalAlign = useSelectField({
    field: 'vertical_align',
    defaultValue: 'flex-start'
  })
  const horizontalAlign = useSelectField({
    field: 'horizontal_align',
    defaultValue: 'flex-start'
  })
  const hideLabel = useCheckboxField({ field: 'hide_label' })
  const spaceBetween = useCheckboxField({ field: 'space_between' })
  const font = useFontField({ field: 'font' })
  const fontSize = useNumberField({ field: 'font_size' })
  const fontColor = useColorField({ field: 'font_color' })
  const gap = useNumberField({ field: 'gap' })
  const alignment = useSelectField({ field: 'alignment' })
  const metricConfigured = useIsMetricFieldConfigured({ field: 'metric' })

  const memo = useFormatValue()

  const { value: memoizedValue, channelValue } = useMemoizedMetricField({
    field: 'metric',
    memo
  })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!channelValue?.value) {
    return <Loading />
  }

  const label = <Label channelValue={channelValue} />
  const value = <Value channelValue={channelValue} value={memoizedValue} />

  let first = label
  let second = value

  const styles: CSSProperties = {
    width: spaceBetween && !hideLabel ? '100%' : 'auto',
    justifyContent: spaceBetween ? 'space-between' : undefined,
    alignItems: 'center',
    fontSize: fontSize ? `${fontSize}px` : undefined,
    color: fontColor.toRgbaCss(),
    gap: gap ? `${gap}px` : undefined,
    flexDirection: 'row'
  }

  if (alignment) {
    styles.flexDirection = 'column'
    styles.height = spaceBetween && !hideLabel ? '100%' : 'auto'

    if (alignment === 'value') {
      first = value
      second = label
    }
  }

  return (
    <Container
      style={{
        alignItems: verticalAlign,
        justifyContent: horizontalAlign,
        fontFamily: font
      }}
    >
      <InnerContainer style={styles}>
        {first}
        {second}
      </InnerContainer>
    </Container>
  )
}

export default SingleValue

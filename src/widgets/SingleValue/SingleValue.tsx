import React, { CSSProperties, FunctionComponent } from 'react'
import {
  Loading,
  MissingConfigPlaceholder,
  useCheckboxField,
  useColorField,
  useFontField,
  useIsMetricFieldConfigured,
  useMetricField,
  useMetricFieldValueType,
  useNumberField,
  useSelectField,
  useStringField,
  useConvertDateToTimezone
} from '@modbros/dashboard-sdk'
import styled from 'styled-components'
import { isEmpty, isNumber } from 'lodash-es'
import { ChannelValue } from '@modbros/dashboard-core'
import { format12h, format24h, formatDate } from '../../utils/metricUtils'

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

const Unit: FunctionComponent<ChannelValueProp> = (props) => {
  const { channelValue } = props
  const { unit } = channelValue

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
        {unit?.abbreviation}
      </small>
    )
  }

  return <span>{unit?.abbreviation}</span>
}

const Value: FunctionComponent<ChannelValueProp> = (props) => {
  const { channelValue } = props
  const { value } = channelValue

  const convertDate = useConvertDateToTimezone()

  const precision = useNumberField({ field: 'precision', defaultValue: 0 })
  const valueFont = useFontField({ field: 'value_font' })
  const valueFontSize = useNumberField({ field: 'value_font_size' })
  const valueFontColor = useColorField({ field: 'value_font_color' })
  const timeFormat = useSelectField({
    field: 'time_format',
    defaultValue: '24h'
  })
  const hideSeconds = useCheckboxField({ field: 'hide_seconds' })
  const dateFormat = useSelectField({
    field: 'date_format',
    defaultValue: 'Y-M-D'
  })
  const dateSeparator = useSelectField({
    field: 'date_separator',
    defaultValue: '-'
  })
  const valueType = useMetricFieldValueType(channelValue)

  let v = value.value

  if (isNumber(v) && isNumber(precision)) {
    v = parseFloat(v.toString()).toFixed(Math.max(0, Math.round(precision)))
  }

  if (valueType === 'date') {
    const dateValue = convertDate(new Date(v))
    const time =
      timeFormat === '12h'
        ? format12h(dateValue, hideSeconds)
        : format24h(dateValue, hideSeconds)
    const date = formatDate(dateValue, dateFormat, dateSeparator)

    v = `${date} ${time}`
  }

  return (
    <strong
      style={{
        fontFamily: valueFont,
        fontSize: valueFontSize ? `${valueFontSize}px` : undefined,
        color: valueFontColor.toRgbaCss()
      }}
    >
      <span>{v}</span>

      <Unit channelValue={channelValue} />
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
  const channelValue = useMetricField({ field: 'metric' })
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

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!channelValue?.value) {
    return <Loading />
  }

  const label = <Label channelValue={channelValue} />
  const value = <Value channelValue={channelValue} />

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

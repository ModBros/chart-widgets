import React, {
  CSSProperties,
  FunctionComponent,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  Loading,
  MissingConfigPlaceholder,
  useCheckboxField,
  useColorField,
  useFontField,
  useFormatMetricValue,
  useIsMetricFieldConfigured,
  useMemoizedMetricField,
  useNumberField,
  useSelectField,
  useStringField
} from '@modbros/dashboard-sdk'
import styled, { css, keyframes } from 'styled-components'
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

const runningText = keyframes`
  0% {
    transform: translate(0, 0);
    left: 100%;
  }
  100% {
    transform: translate(-100%, 0);
    left: 0;
  }
`

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
  const hideDate = useCheckboxField({ field: 'hide_date' })
  const hideTime = useCheckboxField({ field: 'hide_time' })

  const dateFormat = hideDate
    ? ''
    : formatDate(selectedDateFormat, dateSeparator)
  const timeFormat = hideTime
    ? ''
    : selectedTimeFormat === '12h'
    ? format12h(hideSeconds)
    : format24h(hideSeconds)

  const valueFontSize = useNumberField({ field: 'value_font_size' })

  const format = useFormatMetricValue()

  return (channelValue: ChannelValue) => {
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
  }
}

const StyledValueContainer = styled.div<{
  $overflow: string
}>`
  position: relative;

  ${({ $overflow }) => {
    if ($overflow === 'none') {
      return
    }

    return css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ${$overflow === 'ellipsis' ? 'ellipsis' : 'initial'};
    `
  }}
`

const StyledValue = styled.strong<{
  $overflow: string
}>`
  ${({ $overflow }) => {
    if ($overflow === 'running') {
      return css`
        display: inline-block;

        &.running {
          position: relative;
          animation: 5s ${runningText} linear infinite;
        }
      `
    }
  }}
`

const Value: FunctionComponent<
  ChannelValueProp & { value: FormattedMetricValue }
> = (props) => {
  const { value, channelValue } = props

  const containerRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const valueFont = useFontField({ field: 'value_font' })
  const valueFontSize = useNumberField({ field: 'value_font_size' })
  const valueFontColor = useColorField({ field: 'value_font_color' })
  const maxValue = useNumberField({ field: 'max' })
  const max = getMetricMaxValue(channelValue, maxValue)
  const { getColor } = useThresholds(valueFontColor, max)
  const truncation = useSelectField({
    field: 'truncation',
    defaultValue: 'none'
  })
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current

    if (!container || !text) {
      return
    }

    const observer = new ResizeObserver(() => {
      setRunning(container.clientWidth < text.clientWidth)
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  let color = valueFontColor

  if (channelValue.type.valueType === 'Numeric') {
    color = getColor(parseFloat(channelValue.value.value?.toString() ?? '0'))
  }

  return (
    <StyledValueContainer $overflow={truncation} ref={containerRef}>
      <StyledValue
        className={running ? 'running' : undefined}
        ref={textRef}
        $overflow={truncation}
        style={{
          fontFamily: valueFont,
          fontSize: valueFontSize ? `${valueFontSize}px` : undefined,
          color: color.toRgbaCss()
        }}
      >
        <span>{value.value}</span>

        <Unit unit={value.unit} />
      </StyledValue>
    </StyledValueContainer>
  )
}

const Label: FunctionComponent<ChannelValueProp> = (props) => {
  const { channelValue } = props
  const { metric } = channelValue

  const hideLabel = useCheckboxField({ field: 'hide_label' })
  const customLabel = useStringField({ field: 'label' })
  const truncation = useSelectField({
    field: 'truncation',
    defaultValue: 'none'
  })

  if (hideLabel) {
    return null
  }

  return (
    <span
      style={{
        whiteSpace: truncation !== 'none' ? 'nowrap' : undefined
      }}
    >
      {!isEmpty(customLabel) ? customLabel : metric.label}
    </span>
  )
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

  const formatValue = useFormatValue()

  // note: the metric value itself is memoized to avoid re-renders on identical
  // values, but the formatting is applied during render so config changes are
  // picked up immediately - even while metric updates are disabled
  const { channelValue } = useMemoizedMetricField({ field: 'metric' })

  if (!metricConfigured) {
    return <MissingConfigPlaceholder text={'Please provide a metric'} />
  }

  if (!channelValue?.value) {
    return <Loading />
  }

  const formattedValue = formatValue(channelValue)

  if (!formattedValue) {
    return <Loading />
  }

  const label = <Label channelValue={channelValue} />
  const value = <Value channelValue={channelValue} value={formattedValue} />

  let first = label
  let second = value

  const styles: CSSProperties = {
    width: spaceBetween ? '100%' : undefined,
    maxWidth: '100%',
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

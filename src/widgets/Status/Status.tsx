import React from 'react'
import {
  useColorField,
  useFileField,
  useMetricField
} from '@modbros/dashboard-sdk'
import { Image } from './Image'
import { TrafficLight } from './TrafficLight'

const Status = () => {
  const channelValue = useMetricField({ field: 'metric' })
  const imageTrue = useFileField({ field: 'image_true' })
  const imageFalse = useFileField({ field: 'image_false' })
  const colorTrue = useColorField({
    field: 'color_true',
    defaultColor: '#45c998'
  })
  const colorFalse = useColorField({
    field: 'color_false',
    defaultColor: '#e45e42'
  })

  const isTrue = Boolean(channelValue?.value.value)

  if (isTrue && imageTrue) {
    return <Image src={imageTrue.src} />
  }

  if (!isTrue && imageFalse) {
    return <Image src={imageFalse.src} />
  }

  if (isTrue) {
    return <TrafficLight color={colorTrue.toRgbaCss()} />
  }

  return <TrafficLight color={colorFalse.toRgbaCss()} />
}

export default Status

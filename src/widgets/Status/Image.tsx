import React from 'react'
import { useSelectField } from '@modbros/dashboard-sdk'
import { StyledImage } from '../../components/StyledImage'

export const Image = (props: { src: string }) => {
  const { src } = props

  const size = useSelectField({ field: 'image_size', defaultValue: 'contain' })
  const posX = useSelectField({
    field: 'image_position_x',
    defaultValue: 'center'
  })
  const posY = useSelectField({
    field: 'image_position_y',
    defaultValue: 'center'
  })

  return (
    <StyledImage
      size={size}
      posX={posX}
      posY={posY}
      style={{
        backgroundImage: `url("${src}")`
      }}
    />
  )
}

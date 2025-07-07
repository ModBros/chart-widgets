import React from 'react'
import styled from 'styled-components'

interface TrafficLightProps {
  color: string
}

const StyledTrafficLight = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`

export const TrafficLight = (props: TrafficLightProps) => {
  const { color } = props

  return <StyledTrafficLight style={{ backgroundColor: color }} />
}

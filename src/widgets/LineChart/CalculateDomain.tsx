import React from 'react'
import { useAllValues } from './AllValuesContext'
import { useCalculateDomain } from './useCalculateDomain'

export const CalculateDomain = (props: {
  minValue?: number | null
  maxValue?: number | null
}) => {
  const { minValue, maxValue } = props

  const values = useAllValues()
  useCalculateDomain(values, minValue, maxValue)

  return null
}

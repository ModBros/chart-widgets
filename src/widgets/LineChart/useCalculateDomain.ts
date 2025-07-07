import { TimedMetricValue } from '../../utils/useMetricFieldHistory'
import { useContext, useEffect } from 'react'
import { extent } from 'd3-array'
import { DomainContext } from './DomainContext'
import { useGetValue } from './hooks'
import { isEmpty, isEqual, isNaN, isNil } from 'lodash-es'

function min(domain: [number, number]) {
  if (isNaN(domain[0])) {
    return 0
  }

  return domain[0]
}

function max(domain: [number, number]) {
  if (isNaN(domain[1])) {
    return 0
  }

  return domain[1]
}

export function useCalculateDomain(
  values: TimedMetricValue[],
  minValue?: number | null,
  maxValue?: number | null
) {
  const [, setDomain] = useContext(DomainContext)
  const getValue = useGetValue()

  useEffect(() => {
    if (isEmpty(values)) {
      return
    }

    const lineDomain = extent(values, getValue)

    if (!isNil(minValue)) {
      lineDomain[0] = minValue
    }

    if (!isNil(maxValue)) {
      lineDomain[1] = maxValue
    }

    lineDomain[0] = Math.floor(min(lineDomain))
    lineDomain[1] = Math.ceil(max(lineDomain))

    setDomain((prevDomain) => {
      if (isEqual(prevDomain, lineDomain)) {
        return prevDomain
      }

      return lineDomain
    })
  }, [values, minValue, maxValue])
}

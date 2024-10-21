import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo
} from 'react'
import { createStore, useStoreSelector } from '@modbros/dashboard-sdk'
import { TimedMetricValue } from '../../utils/useMetricFieldHistory'

const AllValuesContext = createContext(
  createStore<Record<string, TimedMetricValue[]>>({})
)

export const AllValuesProvider = (props: PropsWithChildren) => {
  const { children } = props
  const store = useMemo(
    () => createStore<Record<string, TimedMetricValue[]>>({}),
    []
  )

  return (
    <AllValuesContext.Provider value={store}>
      {children}
    </AllValuesContext.Provider>
  )
}

export function useAllValues() {
  return useStoreSelector(AllValuesContext, (state) => {
    const allValues = []

    for (const values of Object.values(state)) {
      allValues.push(...values)
    }

    return allValues
  })
}

export function useResetValues() {
  const store = useContext(AllValuesContext)

  return useCallback(
    (id: string) => {
      store.setState((prev) => ({
        ...prev,
        [id]: []
      }))
    },
    [store]
  )
}

export function useSetValues() {
  const store = useContext(AllValuesContext)

  return useCallback(
    (id: string, values: TimedMetricValue[]) => {
      store.setState((prev) => ({
        ...prev,
        [id]: values
      }))
    },
    [store]
  )
}

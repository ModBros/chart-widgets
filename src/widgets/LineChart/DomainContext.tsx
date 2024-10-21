import { createThrottledDataContext } from '@modbros/dashboard-sdk'

const [_DomainContext, _DomainProvider] = createThrottledDataContext<
  [number, number]
>([0, 0])

export const DomainContext = _DomainContext
export const DomainProvider = _DomainProvider

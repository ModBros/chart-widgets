import { createThrottledDataContext } from '@modbros/dashboard-sdk'
import { MetricUnit } from '@modbros/dashboard-core/types/service'

const [_UnitContext, _UnitProvider] =
  createThrottledDataContext<MetricUnit | null>(null)

export const UnitContext = _UnitContext
export const UnitProvider = _UnitProvider

import { KpiType } from '@root/domain/performance/enterprise/entities/performance.entity'
import { PerformanceDetails } from '@root/domain/performance/enterprise/value-objects/performance-details'

export function getTotalGoalByKpi(kpiType: KpiType, performances: Array<PerformanceDetails>): number {
  return performances
    .filter((performance) => performance.kpiType === kpiType)
    .reduce((sum, performance) => sum + performance.goal, 0)
}

export function getTotalRealByKpi(kpiType: KpiType, performances: Array<PerformanceDetails>): number {
  return performances
    .filter((performance) => performance.kpiType === kpiType)
    .reduce((sum, performance) => sum + performance.real, 0)
}

export function getKpiCoverage(kpiType: KpiType, performances: Array<PerformanceDetails>): number {
  const goal = performances
    .filter((performance) => performance.kpiType === kpiType)
    .reduce((sum, performance) => sum + performance.goal, 0)

  const real = performances
    .filter((performance) => performance.kpiType === kpiType)
    .reduce((sum, performance) => sum + performance.real, 0)

  if (goal === 0) return real > 0 ? 100 : 0
  if (real === 0 && goal === 0) return 0
  return real / goal
}

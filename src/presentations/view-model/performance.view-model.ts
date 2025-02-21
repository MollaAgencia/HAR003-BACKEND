import { PerformanceDetails } from '@root/domain/performance/enterprise/value-objects/performance-details'

export class PerformanceViewModel {
  static toHttp(performance: PerformanceDetails) {
    return {
      goal: performance.goal,
      real: performance.real,
      coverage: performance.coverage,
      kpiType: performance.kpiType,
      status: performance.status,
    }
  }
}

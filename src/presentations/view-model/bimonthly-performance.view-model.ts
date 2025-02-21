import { BimonthlyPerformanceDetails } from '@root/domain/performance/enterprise/value-objects/bimonthly-performance-details'

import { PerformanceViewModel } from './performance.view-model'

export class BimonthlyPerformanceViewModel {
  static toHttp(bimonthlyPerformance: BimonthlyPerformanceDetails) {
    return {
      performances: bimonthlyPerformance.performances.map(PerformanceViewModel.toHttp),
      score: bimonthlyPerformance.totalScore,
      status: bimonthlyPerformance.status,
    }
  }
}

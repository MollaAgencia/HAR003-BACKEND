import { SemiannualPerformanceDetails } from '@root/domain/performance/enterprise/value-objects/semiannual-performance-details'

export class SemiannualPerformanceViewModel {
  static toHttp(performance: SemiannualPerformanceDetails) {
    return {
      bimonthlySellOutPerformances: performance.bimonthlySellOutPerformances.map((bimonthly) => ({
        goal: bimonthly.goal,
        real: bimonthly.real,
        period: bimonthly.period,
      })),
      teamEngagement: performance.teamEngagement.map((engagement) => ({
        achievement: engagement.achievement,
        period: engagement.period,
      })),
    }
  }
}

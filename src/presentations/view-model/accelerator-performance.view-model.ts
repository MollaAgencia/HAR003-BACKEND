import { AcceleratorDetails } from '@root/domain/performance/enterprise/value-objects/accelerator-details'

export class AcceleratorPerformanceViewModel {
  static toHttp(acceleratorPerformance: AcceleratorDetails) {
    return {
      score: acceleratorPerformance.totalScore,
      boxesSold: acceleratorPerformance.totalReal,
    }
  }
}

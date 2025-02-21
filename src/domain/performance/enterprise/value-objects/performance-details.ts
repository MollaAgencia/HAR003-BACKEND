import { ValueObject } from '@root/core/domain/value-object'

import { kpiStatus, KpiStatus, KpiType } from '../entities/performance.entity'

export type PerformanceDetailsProps = {
  goal: number
  real: number
  kpiType: KpiType
}

export class PerformanceDetails extends ValueObject<PerformanceDetailsProps> {
  get goal() {
    return this.props.goal
  }

  set goal(goal: number) {
    this.props.goal = goal
  }

  get real() {
    return this.props.real
  }

  set real(real: number) {
    this.props.real = real
  }

  get coverage() {
    if (this.goal === 0) return this.real > 0 ? 100 : 0
    if (this.real === 0 && this.goal === 0) return 0
    return this.real / this.goal
  }

  get kpiType() {
    return this.props.kpiType
  }

  set kpiType(type: KpiType) {
    this.props.kpiType = type
  }

  get status(): KpiStatus {
    return this.coverage >= 1 ? kpiStatus.HIT : kpiStatus.MISSED
  }

  static create(props: PerformanceDetailsProps) {
    return new PerformanceDetails({
      goal: props.goal,
      real: props.real,
      kpiType: props.kpiType,
    })
  }
}

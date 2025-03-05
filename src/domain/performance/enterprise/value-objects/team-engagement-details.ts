import { ValueObject } from '@root/core/domain/value-object'
import { getKpiCoverage, getTotalGoalByKpi, getTotalRealByKpi } from '@root/shared/performance-utils'

import { kpiStatus, KpiStatus, kpiType } from '../entities/performance.entity'
import { PerformanceDetails } from './performance-details'
import { SimpleUserDetails } from './simple-user-details'

type TeamEngagementDetailsProps = {
  user: SimpleUserDetails
  performances: PerformanceDetails[]
  teamSize: number
}

export class TeamEngagementDetails extends ValueObject<TeamEngagementDetailsProps> {
  get performances() {
    return this.props.performances
  }

  get user() {
    return this.props.user
  }

  get totalGoal() {
    return this.performances.reduce((total, performance) => total + performance.goal, 0)
  }

  get teamSize() {
    return this.props.teamSize
  }

  get sellOutReal(): number {
    return getTotalRealByKpi(kpiType.SELL_OUT, this.performances)
  }

  get sellOutGoal(): number {
    return getTotalGoalByKpi(kpiType.SELL_OUT, this.performances)
  }

  get sellOutoverage(): number {
    return getKpiCoverage(kpiType.SELL_OUT, this.performances)
  }

  get positivationReal(): number {
    return getTotalRealByKpi(kpiType.POSITIVATION, this.performances)
  }

  get positivationCoverage(): number {
    return getKpiCoverage(kpiType.POSITIVATION, this.performances)
  }

  get positivationGoal(): number {
    return getTotalGoalByKpi(kpiType.POSITIVATION, this.performances)
  }

  get status(): KpiStatus {
    return this.isSellOutHit() ? kpiStatus.HIT : kpiStatus.MISSED
  }

  private isSellOutHit(): boolean {
    return getKpiCoverage(kpiType.SELL_OUT, this.performances) >= 1 ? true : false
  }

  static create(props: TeamEngagementDetailsProps) {
    return new TeamEngagementDetails({
      user: props.user,
      performances: props.performances,
      teamSize: props.teamSize,
    })
  }
}

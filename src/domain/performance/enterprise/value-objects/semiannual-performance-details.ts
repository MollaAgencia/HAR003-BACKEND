import { ValueObject } from '@root/core/domain/value-object'

export type BimonthlyDetailsProps = {
  goal: number
  real: number
  period: number
}

export type TeamEngagementProps = {
  achievement: number
  period: number
}

type SemiannualPerformanceDetailsProps = {
  bimonthlySellOutPerformances: BimonthlyDetailsProps[]
  teamEngagement: TeamEngagementProps[]
}

export class SemiannualPerformanceDetails extends ValueObject<SemiannualPerformanceDetailsProps> {
  get bimonthlySellOutPerformances() {
    return this.props.bimonthlySellOutPerformances
  }

  get teamEngagement() {
    return this.props.teamEngagement
  }

  static create(props: SemiannualPerformanceDetailsProps) {
    return new SemiannualPerformanceDetails({
      bimonthlySellOutPerformances: props.bimonthlySellOutPerformances,
      teamEngagement: props.teamEngagement,
    })
  }
}

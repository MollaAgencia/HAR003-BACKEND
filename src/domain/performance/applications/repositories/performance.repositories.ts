import { SalesChannel } from '@root/domain/authorization/enterprise/interfaces/user'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { AcceleratorDetails } from '../../enterprise/value-objects/accelerator-details'
import { BimonthlyPerformanceDetails } from '../../enterprise/value-objects/bimonthly-performance-details'
import { SemiannualPerformanceDetails as SemiannualPerformanceDetails } from '../../enterprise/value-objects/semiannual-performance-details'
import { TeamEngagementDetails } from '../../enterprise/value-objects/team-engagement-details'

export type GetPerformanceProps = {
  userId: UniqueEntityID
  period: number
}

export type GetTeamPerformanceProps = {
  userId: UniqueEntityID
  period: number[]
}

export type GetSemiannuallyPerformanceProps = {
  userId: UniqueEntityID
  period: number
}

export abstract class PerformanceRepository {
  abstract getAccelerator(data: GetPerformanceProps): Promise<AcceleratorDetails>
  abstract getBimonthlyPerformance(data: GetPerformanceProps): Promise<BimonthlyPerformanceDetails>
  abstract getBimonthlySellOutGoal(data: GetPerformanceProps): Promise<{ goal: number; salesChannel: SalesChannel }>
  abstract getManagerSemiannualPerformance(data: GetSemiannuallyPerformanceProps): Promise<SemiannualPerformanceDetails>
  abstract getTeamEngagement(data: GetTeamPerformanceProps): Promise<Array<TeamEngagementDetails>>
}

import { SalesChannel, UserRole } from '@root/domain/authorization/enterprise/interfaces/user'

import { Entity } from '@core/domain/Entity'
import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { Optional } from '@core/logic/Optional'

export const kpiType = {
  SELL_OUT: 'SELL_OUT',
  POSITIVATION: 'POSITIVATION',
  URSINHOS: 'URSINHOS',
  ACCELERATOR: 'ACCELERATOR',
} as const

export type KpiType = (typeof kpiType)[keyof typeof kpiType]

export const kpiStatus = {
  HIT: 'HIT',
  MISSED: 'MISSED',
} as const

export type KpiStatus = (typeof kpiStatus)[keyof typeof kpiStatus]

export type PerformanceProps = {
  userId?: UniqueEntityID
  supervisorId?: UniqueEntityID
  managerId?: UniqueEntityID
  externalUserId?: string
  distributorId: string
  userRole: UserRole
  salesChannel?: SalesChannel
  goal: number
  real: number
  period: number
  kpiType: KpiType
  createdAt: Date
  updatedAt?: Date
}

export class Performance extends Entity<PerformanceProps> {
  get distributorId() {
    return this.props.distributorId
  }

  set distributorId(distributorId: string) {
    this.props.distributorId = distributorId
  }

  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityID | undefined) {
    this.props.userId = userId
  }

  get supervisorId() {
    return this.props.supervisorId
  }

  set supervisorId(supervisorId: UniqueEntityID | undefined) {
    this.props.supervisorId = supervisorId
  }

  get managerId() {
    return this.props.managerId
  }

  set managerId(managerId: UniqueEntityID | undefined) {
    this.props.managerId = managerId
  }

  get externalUserId() {
    return this.props.externalUserId
  }

  set externalUserId(externalUserId: string | undefined) {
    this.props.externalUserId = externalUserId
  }

  get userRole() {
    return this.props.userRole
  }

  set userRole(userRole: UserRole) {
    this.props.userRole = userRole
  }

  get salesChannel() {
    return this.props.salesChannel
  }

  set salesChannel(salesChannel: SalesChannel) {
    this.props.salesChannel = salesChannel
  }

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

  get period() {
    return this.props.period
  }

  set period(period: number) {
    this.props.period = period
  }

  get status(): KpiStatus {
    return this.coverage >= 1 ? kpiStatus.HIT : kpiStatus.MISSED
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt || new Date()
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      PerformanceProps,
      'createdAt' | 'updatedAt' | 'userId' | 'supervisorId' | 'managerId' | 'externalUserId'
    >,
    id?: UniqueEntityID,
  ) {
    if (!props.userId && !props.externalUserId) {
      throw new Error('Either userId or externalUserId must be provided.')
    }
    return new Performance(
      {
        userId: props.userId || null,
        supervisorId: props.supervisorId || null,
        managerId: props.managerId || null,
        externalUserId: props.externalUserId || null,
        distributorId: props.distributorId,
        userRole: props.userRole,
        salesChannel: props.salesChannel,
        goal: props.goal,
        real: props.real,
        period: props.period,
        kpiType: props.kpiType,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}

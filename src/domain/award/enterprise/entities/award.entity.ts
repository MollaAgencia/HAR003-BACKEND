import { Entity } from '@core/domain/Entity'
import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { Optional } from '@core/logic/Optional'

export const referencePeriod = {
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  ANNUALLY: 'ANNUALLY',
} as const

export type ReferencePeriod = (typeof referencePeriod)[keyof typeof referencePeriod]

export const type = {
  SELL_OUT: 'SELL_OUT',
  URSINHOS: 'URSINHOS',
  ACCELERATOR: 'ACCELERATOR',
  POSITIVATION: 'POSITIVATION',
} as const

export type Type = (typeof type)[keyof typeof type]

export const status = {
  APPROVED: 'APPROVED',
  REPROVED: 'REPROVED',
} as const

export type Status = (typeof status)[keyof typeof status]

export type AwardProps = {
  userId: UniqueEntityID
  description?: string
  period: number
  referencePeriod: ReferencePeriod
  type: Type
  status: Status
  goal: number
  reason: string
  disabled: Date | null
  createdAt: Date
  updatedAt?: Date
}

export class Award extends Entity<AwardProps> {
  get userId() {
    return this.props.userId
  }

  get period() {
    return this.props.period
  }

  set period(value: number) {
    this.props.period = value
  }

  get referencePeriod() {
    return this.props.referencePeriod
  }

  set referencePeriod(value: ReferencePeriod) {
    this.props.referencePeriod = value
  }

  get type() {
    return this.props.type
  }

  set type(value: Type) {
    this.props.type = value
  }

  get status() {
    return this.props.status
  }

  set status(value: Status) {
    this.props.status = value
  }

  get goal() {
    return this.props.goal
  }

  set goal(value: number) {
    this.props.goal = value
  }

  get reason() {
    return this.props.reason
  }

  set reason(value: string) {
    this.props.reason = value
  }

  get disabled() {
    return this.props.disabled
  }

  set disabled(value: Date | null) {
    this.props.disabled = value
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt || new Date()
  }

  get description() {
    return this.props.description
  }

  set description(value: string | undefined) {
    this.props.description = value
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<AwardProps, 'createdAt'>, id?: UniqueEntityID) {
    return new Award(
      {
        userId: props.userId,
        period: props.period,
        referencePeriod: props.referencePeriod,
        type: props.type,
        status: props.status,
        goal: props.goal,
        reason: props.reason,
        disabled: props.disabled,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        description: props.description,
      },
      id,
    )
  }
}

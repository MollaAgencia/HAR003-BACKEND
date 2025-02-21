import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { DomainEvent } from '@core/events/domain-event'

import { User } from '@domain/authorization/enterprise/entities/user.entity'

export type SendVerificationEmailTokensEventProps = {
  user: User
}

export class SendEmailVerifiedEvent implements DomainEvent {
  public occurredAt: Date
  public user: User

  constructor(data: SendVerificationEmailTokensEventProps) {
    this.occurredAt = new Date()
    this.user = data.user
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id
  }
}

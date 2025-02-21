import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { DomainEvent } from '@core/events/domain-event'

import { Token } from '../entities/token.entity'

export type SendTokenEventProps = {
  token: Token
}

export class SendTokenEvent implements DomainEvent {
  public occurredAt: Date
  public token: Token

  constructor(data: SendTokenEventProps) {
    this.occurredAt = new Date()
    this.token = data.token
  }

  getAggregateId(): UniqueEntityID {
    return this.token.id
  }
}

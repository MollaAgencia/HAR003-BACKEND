import { UniqueEntityID } from '@core/domain/unique-entity-id'

export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityID
}

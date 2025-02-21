import { Entity } from '@core/domain/Entity'
import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { Optional } from '@core/logic/Optional'

export type DistributorProps = {
  name: string
  externalId: string
  disabled: Date | null
  createdAt: Date
  updatedAt?: Date
}

export class Distributor extends Entity<DistributorProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get externalId() {
    return this.props.externalId
  }

  set externalId(externalId: string) {
    this.props.externalId = externalId
  }

  get disabled() {
    return this.props.disabled
  }

  set disabled(disabled: Date | null) {
    this.props.disabled = disabled
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

  static create(props: Optional<DistributorProps, 'createdAt'>, id?: UniqueEntityID) {
    return new Distributor(
      {
        name: props.name,
        externalId: props.externalId,
        disabled: props.disabled || null,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}

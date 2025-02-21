import { AggregateRoot } from '@core/domain/aggregate-root'
import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { Optional } from '@core/logic/Optional'

import { TokenProps } from '@domain/authorization/enterprise/interfaces/token'

import { SendTokenEvent } from '../events/send-token.event'

export class Token extends AggregateRoot<TokenProps> {
  get userId() {
    return this.props.userId
  }

  get type() {
    return this.props.type
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<TokenProps, 'createdAt'>, id?: UniqueEntityID) {
    const token = new Token(
      {
        userId: props.userId,
        type: props.type,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )

    const isNewResetPassword = !id

    if (isNewResetPassword) {
      token.addDomainEvent(new SendTokenEvent({ token }))
    }

    return token
  }
}

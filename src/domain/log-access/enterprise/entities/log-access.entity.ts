import { Entity } from '@root/core/domain/Entity'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Optional } from '@root/core/logic/Optional'

type LogAccessProps = {
  userId: UniqueEntityID
  page: string
  createdAt: Date
}

export class LogAccess extends Entity<LogAccessProps> {
  get userId() {
    return this.props.userId
  }

  get page() {
    return this.props.page
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<LogAccessProps, 'createdAt'>, id?: UniqueEntityID): LogAccess {
    const sac = new LogAccess(
      {
        userId: props.userId,
        page: props.page,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )

    return sac
  }
}

import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { ValueObject } from '@root/core/domain/value-object'
import { UserRole } from '@root/domain/authorization/enterprise/interfaces/user'

export type SimpleUserDetailsProps = {
  id: UniqueEntityID
  role: UserRole
  name: string
}

export class SimpleUserDetails extends ValueObject<SimpleUserDetailsProps> {
  get id() {
    return this.props.id
  }

  set id(id: UniqueEntityID) {
    this.props.id = id
  }

  get role() {
    return this.props.role
  }

  set role(role: UserRole) {
    this.props.role = role
  }

  get name() {
    return this.props.name
  }
  set name(name: string) {
    this.props.name = name
  }

  static create(props: SimpleUserDetailsProps) {
    return new SimpleUserDetails({
      name: props.name,
      id: props.id,
      role: props.role,
    })
  }
}

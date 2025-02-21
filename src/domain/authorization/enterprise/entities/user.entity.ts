import { AggregateRoot } from '@core/domain/aggregate-root'
import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { Optional } from '@core/logic/Optional'

import { SendEmailVerifiedEvent } from '@domain/authorization/enterprise/events/send-email-verified.event'
import { Region, SalesChannel, UserProps, UserRole } from '@domain/authorization/enterprise/interfaces/user'

export class User extends AggregateRoot<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get document() {
    return this.props.document
  }

  set document(document: string) {
    this.props.document = document
  }

  get role() {
    return this.props.role
  }

  set role(role: UserRole) {
    this.props.role = role
  }

  get telephone() {
    return this.props.telephone
  }

  set telephone(telephone: string) {
    this.props.telephone = telephone
  }

  get region() {
    return this.props.region
  }

  set region(region: Region) {
    this.props.region = region
  }

  get distributorId() {
    return this.props.distributorId
  }

  set distributorId(distributorId: UniqueEntityID) {
    this.props.distributorId = distributorId
  }

  get salesChannel() {
    return this.props.salesChannel
  }

  set salesChannel(salesChannel: SalesChannel) {
    this.props.salesChannel = salesChannel
  }

  get emailVerified() {
    return this.props.emailVerified
  }

  set emailVerified(emailVerified: Date | null) {
    this.props.emailVerified = emailVerified
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
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

  public verifyEmail() {
    this.props.emailVerified = new Date()
    this.addDomainEvent(new SendEmailVerifiedEvent({ user: this }))
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'document' | 'emailVerified' | 'disabled'>,
    id?: UniqueEntityID,
  ) {
    return new User(
      {
        name: props.name,
        email: props.email,
        document: props.document || null,
        distributorId: props.distributorId,
        salesChannel: props.salesChannel,
        emailVerified: props.emailVerified || null,
        telephone: props.telephone || null,
        region: props.region,
        role: props.role,
        password: props.password || null,
        disabled: props.disabled || null,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}

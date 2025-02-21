import { Entity } from '@core/domain/Entity'
import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { Optional } from '@core/logic/Optional'

export enum MailType {
  MAIL = 'MAIL',
  SAC = 'SAC',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  WELCOME = 'WELCOME',
}

export enum MailStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

type MailProps = {
  email: string
  subject: string
  body: string
  status: MailStatus
  userId?: UniqueEntityID
  type: MailType
  createdAt: Date
}

export class Mail extends Entity<MailProps> {
  get email() {
    return this.props.email
  }

  get subject() {
    return this.props.subject
  }

  get body() {
    return this.props.body
  }

  get type() {
    return this.props.type
  }

  get status() {
    return this.props.status
  }

  set status(status: MailStatus) {
    this.props.status = status
  }

  get userId() {
    return this.props.userId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<MailProps, 'status' | 'createdAt'>, id?: UniqueEntityID): Mail {
    return new Mail(
      {
        email: props.email,
        subject: props.subject,
        body: props.body,
        type: props.type,
        status: props.status || MailStatus.PENDING,
        userId: props.userId || null,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }
}

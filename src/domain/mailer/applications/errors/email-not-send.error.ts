import { DomainError } from '@root/core/errors/DomainError'

export class EmailNotSendError extends Error implements DomainError {
  constructor(email: string) {
    super(`Error to send the email to ${email}.`)
    this.name = 'EmailNotSendError'
  }
}

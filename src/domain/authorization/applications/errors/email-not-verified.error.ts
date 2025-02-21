import { DomainError } from '@core/errors/DomainError'

export class EmailNotVerifiedError extends Error implements DomainError {
  constructor(email: string) {
    super(`User with email '${email}' is not verified.`)
    this.name = 'EmailNotVerifiedError'
  }
}

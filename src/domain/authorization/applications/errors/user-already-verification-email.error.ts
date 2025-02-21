import { DomainError } from '@core/errors/DomainError'

export class UserAlreadyVerificationEmailError extends Error implements DomainError {
  constructor(email: string) {
    super(`User with email '${email}' was already verified.`)
    this.name = 'UserAlreadyVerificationEmailError'
  }
}

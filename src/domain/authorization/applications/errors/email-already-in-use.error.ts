import { DomainError } from '@core/errors/DomainError'

export class EmailAlreadyInUseError extends Error implements DomainError {
  constructor(email: string) {
    super(`The email '${email}' is already in use.`)
    this.name = 'EmailAlreadyInUseError'
  }
}

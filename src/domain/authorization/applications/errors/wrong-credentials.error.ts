import { DomainError } from '@core/errors/DomainError'

export class WrongCredentialsError extends Error implements DomainError {
  constructor() {
    super(`Invalid wrong credencials.`)
    this.name = 'WrongCredentialsError'
  }
}

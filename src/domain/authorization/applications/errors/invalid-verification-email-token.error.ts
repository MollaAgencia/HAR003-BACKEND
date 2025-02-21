import { DomainError } from '@core/errors/DomainError'

export class InvalidVerificationEmailTokenError extends Error implements DomainError {
  constructor(token: string) {
    super(`Verification token '${token}' is invalid.`)
    this.name = 'InvalidVerificationEmailTokenError'
  }
}

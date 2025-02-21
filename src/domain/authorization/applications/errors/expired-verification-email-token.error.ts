import { DomainError } from '@core/errors/DomainError'

export class ExpiredVerificationEmailTokenError extends Error implements DomainError {
  constructor(token: string) {
    super(`Verification token '${token}' is expired.`)
    this.name = 'ExpiredVerificationEmailTokenError'
  }
}

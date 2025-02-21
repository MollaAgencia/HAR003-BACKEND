import { DomainError } from '@core/errors/DomainError'

export class InvalidPasswordResetTokenError extends Error implements DomainError {
  constructor(token: string) {
    super(`Password reset token '${token}' is invalid.`)
    this.name = 'InvalidPasswordResetTokenError'
  }
}

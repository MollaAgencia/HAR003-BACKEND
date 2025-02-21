import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { TokensRepository } from '@domain/authorization/applications/repositories/tokens.repository'
import { Token } from '@domain/authorization/enterprise/entities/token.entity'

export class InMemoryPasswordResetTokensRepository implements TokensRepository {
  public items: Token[] = []

  async sendToken(passwordResetToken: Token): Promise<void> {
    this.items.push(passwordResetToken)
  }

  async findById(token: UniqueEntityID): AsyncMaybe<Token> {
    const passwordResetToken = this.items.find((item) => item.token.equals(token))
    if (!passwordResetToken) return null
    return passwordResetToken
  }

  async findByUserId(email: string): AsyncMaybe<Token> {
    const passwordResetToken = this.items.find((item) => item.email === email)
    if (!passwordResetToken) return null
    return passwordResetToken
  }

  async delete(passwordResetToken: Token): Promise<void> {
    this.items = this.items.filter((item) => !item.equals(passwordResetToken))
  }
}

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { VerificationEmailTokensRepository } from '@domain/authorization/applications/repositories/verification-email-tokens.repository'
import { VerificationEmailToken } from '@domain/authorization/enterprise/entities/verification-email-token.entity'

export class InMemoryVerificationEmailTokensRepository implements VerificationEmailTokensRepository {
  public items: Array<VerificationEmailToken> = []

  async sendToken(verificationEmailToken: VerificationEmailToken): Promise<void> {
    this.items.push(verificationEmailToken)
  }

  async findByToken(token: UniqueEntityID): AsyncMaybe<VerificationEmailToken> {
    const verificationToken = this.items.find((item) => item.token.equals(token))
    if (!verificationToken) return null
    return verificationToken
  }

  async findByEmail(email: string): AsyncMaybe<VerificationEmailToken> {
    const verificationToken = this.items.find((item) => item.email === email)
    if (!verificationToken) return null
    return verificationToken
  }

  async deleteToken(verificationEmailToken: VerificationEmailToken): Promise<void> {
    this.items = this.items.filter((item) => !item.token.equals(verificationEmailToken.token))
  }
}

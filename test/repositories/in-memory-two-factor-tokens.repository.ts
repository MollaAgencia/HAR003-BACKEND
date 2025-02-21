import { UniqueTwoFactorTokenId } from '@core/domain/unique-two-factor-token-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { TwoFactorTokensRepository } from '@domain/authorization/applications/repositories/two-factor-tokens.repository'
import { TwoFactorToken } from '@domain/authorization/enterprise/entities/two-factor-token.entity'

export class InMemoryTwoFactorTokens implements TwoFactorTokensRepository {
  public items: TwoFactorToken[] = []

  async register(twoFactorToken: TwoFactorToken): Promise<void> {
    this.items.push(twoFactorToken)
  }

  async findByToken(token: UniqueTwoFactorTokenId): AsyncMaybe<TwoFactorToken> {
    const item = this.items.find((item) => item.token.equals(token))
    if (!item) return null
    return item
  }

  async findByEmail(email: string): AsyncMaybe<TwoFactorToken> {
    const item = this.items.find((item) => item.email === email)
    if (!item) return null
    return item
  }

  async deleteToken(twoFactorToken: TwoFactorToken): Promise<void> {
    this.items = this.items.filter((item) => !item.token.equals(twoFactorToken.token))
  }
}

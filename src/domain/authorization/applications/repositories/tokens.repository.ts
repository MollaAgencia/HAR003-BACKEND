import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { Token } from '@domain/authorization/enterprise/entities/token.entity'

export abstract class TokensRepository {
  abstract sendToken(passwordResetToken: Token): Promise<void>
  abstract findById(id: UniqueEntityID): AsyncMaybe<Token>
  abstract findByUserId(id: UniqueEntityID): AsyncMaybe<Token>
  abstract delete(passwordResetToken: Token): Promise<void>
}

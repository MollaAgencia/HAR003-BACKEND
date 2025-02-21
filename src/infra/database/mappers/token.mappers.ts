import { Token as TokenPrisma, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { Token } from '@domain/authorization/enterprise/entities/token.entity'
import { TokenType } from '@domain/authorization/enterprise/interfaces/token'

export class TokenMappers {
  static toDomain(data: TokenPrisma): Token {
    return Token.create(
      {
        userId: new UniqueEntityID(data.userId),
        type: data.type as TokenType,
        createdAt: new Date(data.createdAt),
      },
      new UniqueEntityID(data.id),
    )
  }

  static toPersistence(data: Token): Prisma.TokenCreateInput {
    return {
      id: data.id.toValue(),
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      type: data.type,
      createdAt: new Date(data.createdAt),
    }
  }
}

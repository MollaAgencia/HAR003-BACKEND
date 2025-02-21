import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { DomainEvents } from '@core/events/domain-events'
import { AsyncMaybe } from '@core/logic/Maybe'

import { TokensRepository } from '@domain/authorization/applications/repositories/tokens.repository'
import { Token } from '@domain/authorization/enterprise/entities/token.entity'

import { TokenMappers } from '../mappers/token.mappers'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaTokensRepository implements TokensRepository {
  constructor(private readonly db: PrismaService) {}

  async sendToken(token: Token): Promise<void> {
    const raw = TokenMappers.toPersistence(token)

    await this.db.token.create({ data: raw })
    DomainEvents.dispatchEventsForAggregate(token.id)
  }

  async findById(id: UniqueEntityID): AsyncMaybe<Token> {
    const token = await this.db.token.findFirst({
      where: {
        id: id.toValue(),
      },
    })

    if (!token) return null

    return TokenMappers.toDomain(token)
  }

  async findByUserId(id: UniqueEntityID): AsyncMaybe<Token> {
    const token = await this.db.token.findFirst({
      where: {
        userId: id.toValue(),
      },
    })

    if (!token) return null

    return TokenMappers.toDomain(token)
  }

  async delete(token: Token): Promise<void> {
    await this.db.token.delete({
      where: {
        id: token.id.toValue(),
      },
    })
  }
}

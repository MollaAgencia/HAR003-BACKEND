import { ManagerRanking as ManagerRankingPrisma, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { RankingManager } from '@root/domain/ranking/enterprise/entities/ranking-manager.entity'
import { RankingStatus } from '@root/domain/ranking/enterprise/interfaces/ranking-manager'

export class ManagerRankingMappers {
  static toDomain(data: ManagerRankingPrisma): RankingManager {
    return RankingManager.create(
      {
        period: data.period,
        position: data.position,
        status: data.status as RankingStatus,
        userId: data.userId ? new UniqueEntityID(data.userId) : undefined,
        score: data.score,
        region: data.region || null,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      new UniqueEntityID(data.id),
    )
  }

  static toPersistence(data: RankingManager): Prisma.ManagerRankingCreateInput {
    return {
      id: data.id.toValue(),
      period: data.period,
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      score: data.score,
      position: data.position,
      status: data.status,
      region: data.region || null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
}

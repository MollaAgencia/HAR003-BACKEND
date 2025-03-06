import { Injectable } from '@nestjs/common'
import {
  FindCurrentRankingProps,
  FindManyProps,
  ManagerRankingRepository,
} from '@root/domain/ranking/applications/repositories/manager-ranking.repositories'
import { RankingManager } from '@root/domain/ranking/enterprise/entities/ranking-manager.entity'
import { RankingStatus } from '@root/domain/ranking/enterprise/interfaces/ranking-manager'
import { RankingsManagerDetails } from '@root/domain/ranking/enterprise/value-objects/ranking-manager-details'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { ManagerRankingMappers } from '../../mappers/ranking.mappers'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaManagerRankingRepository implements ManagerRankingRepository {
  constructor(private readonly db: PrismaService) {}

  async findCurrentRanking(data: FindCurrentRankingProps): Promise<RankingManager> {
    const { userId, period } = data

    const managerRanking = await this.db.managerRanking.findFirst({
      where: {
        userId: userId.toValue(),
        period,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!managerRanking) return null

    return ManagerRankingMappers.toDomain(managerRanking)
  }

  async findMany(data: FindManyProps): Promise<RankingsManagerDetails[]> {
    const { period, region } = data

    const managerRankings = await this.db.managerRanking.findMany({
      where: {
        period,
        region,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    })

    return managerRankings.map((ranking) =>
      RankingsManagerDetails.create({
        id: new UniqueEntityID(ranking.id),
        userName: ranking.user.name,
        status: ranking.status as RankingStatus,
        score: ranking.score,
        position: ranking.position,
        region: ranking.region,
      }),
    )
  }
}

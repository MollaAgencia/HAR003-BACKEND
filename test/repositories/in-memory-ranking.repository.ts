import {
  GetCurrentRankingProps,
  GetRankingProps,
  RankingRepository,
} from '@root/domain/ranking/applications/repositories/ranking.repositories'
import { Ranking } from '@root/domain/ranking/enterprise/entities/ranking.entity'
import { RankingDetails } from '@root/domain/ranking/enterprise/value-objects/ranking-details'

import { InMemoryUsersRepository } from './in-memory-users.repository'

export class InMemoryRankingRepository implements RankingRepository {
  constructor(private readonly usersRepository: InMemoryUsersRepository) {}
  public ranking: Array<Ranking> = []

  async getCurrentRanking(data: GetCurrentRankingProps): Promise<Ranking> {
    const { userId, type } = data

    const ranking = this.ranking.find((ranking) => ranking.userId.equals(userId) && ranking.type === type)

    if (!ranking) return null

    return ranking
  }

  async getRankingsByGroup(data: GetRankingProps): Promise<RankingDetails[]> {
    const { group, type, referenceType } = data

    const rankings = this.ranking.filter(
      (ranking) => ranking.group === group && ranking.type === type && referenceType === ranking.referenceType,
    )

    if (!rankings) return null
    return rankings.map((ranking) => {
      const user = this.usersRepository.items.find((item) => item.id.equals(ranking.userId))

      return RankingDetails.create({
        id: ranking.id,
        position: ranking.position,
        score: ranking.score,
        username: user?.name,
        userId: user?.id,
      })
    })
  }
}

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { RankingManager } from '../../enterprise/entities/ranking-manager.entity'
import { RankingsManagerDetails } from '../../enterprise/value-objects/ranking-manager-details'

export type FindCurrentRankingProps = {
  userId: UniqueEntityID
  period: number
  region?: string | null
}

export type FindManyProps = {
  period: number
  region?: string | null
}

export type UpdateEligibilityProps = {
  period: number
  userId: string
  isEligible: boolean
}

export abstract class ManagerRankingRepository {
  abstract findCurrentRanking(data: FindCurrentRankingProps): Promise<RankingManager>
  abstract findMany(data: FindManyProps): Promise<RankingsManagerDetails[]>
}

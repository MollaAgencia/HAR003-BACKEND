import { UniqueEntityID } from '@core/domain/unique-entity-id'

export const rankingStatus = {
  WINNER: 'WINNER',
  AWARDZONE: 'AWARDZONE',
  LOSER: 'LOSER',
} as const

export type RankingStatus = (typeof rankingStatus)[keyof typeof rankingStatus]

export type RankingManagerProps = {
  userId: UniqueEntityID
  period: number
  position: number
  score: number
  status: RankingStatus
  region?: string | null
  createdAt: Date
  updatedAt?: Date
}

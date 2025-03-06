import { Entity } from '@core/domain/Entity'
import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { Optional } from '@core/logic/Optional'

import { RankingManagerProps, RankingStatus } from '../interfaces/ranking-manager'

export class RankingManager extends Entity<RankingManagerProps> {
  get userId() {
    return this.props.userId
  }

  get period() {
    return this.props.period
  }

  set period(period: number) {
    this.props.period = period
  }

  get position() {
    return this.props.position
  }

  set position(position: number) {
    this.props.position = position
  }

  get score() {
    return this.props.score
  }

  set score(score: number) {
    this.props.score = score
  }

  get status() {
    return this.props.status
  }

  set status(status: RankingStatus) {
    this.props.status = status
  }

  get region() {
    return this.props.region
  }

  set region(region: string | null) {
    this.props.region = region
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt || new Date()
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<RankingManagerProps, 'createdAt'>, id?: UniqueEntityID) {
    return new RankingManager(
      {
        userId: props.userId,
        period: props.period,
        position: props.position || 0,
        score: props.score || 0,
        status: props.status || 'LOSER',
        region: props.region || null,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    )
  }
}

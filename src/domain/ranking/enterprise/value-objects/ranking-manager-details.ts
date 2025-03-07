import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { ValueObject } from '@root/core/domain/value-object'

import { RankingStatus } from '../interfaces/ranking-manager'

type RankingsManagerDetailsProps = {
  userName: string
  userId: UniqueEntityID
  position: number
  score: number
  id: UniqueEntityID
  status: RankingStatus
  region?: string | null
}

export class RankingsManagerDetails extends ValueObject<RankingsManagerDetailsProps> {
  get userName() {
    return this.props.userName
  }

  get id() {
    return this.props.id
  }
  get userId() {
    return this.props.userId
  }

  get position() {
    return this.props.position
  }

  get score() {
    return this.props.score
  }

  get status() {
    return this.props.status
  }

  get region() {
    return this.props.region
  }

  static create(props: RankingsManagerDetailsProps) {
    return new RankingsManagerDetails({
      id: props.id,
      userId: props.userId,
      userName: props.userName,
      position: props.position,
      score: props.score,
      status: props.status,
      region: props.region,
    })
  }
}

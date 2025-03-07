import { RankingsManagerDetails } from '@root/domain/ranking/enterprise/value-objects/ranking-manager-details'

export class RankingManagerDetailsViewModel {
  static toHttp(rank: RankingsManagerDetails) {
    return {
      id: rank.id.toValue(),
      userName: rank.userName,
      userId: rank.userId.toValue(),
      position: rank.position,
      score: rank.score,
      status: rank.status,
    }
  }
}

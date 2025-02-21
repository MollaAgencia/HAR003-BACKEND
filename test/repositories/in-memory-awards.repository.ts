import { AwardsRepository, GetAwardProps } from '@root/domain/awards/applications/repositories/awards.repositories'
import { Award } from '@root/domain/awards/enterprise/entities/award.entity'

export class InMemoryAwardsRepository implements AwardsRepository {
  public awards: Array<Award> = []

  async getAward(data: GetAwardProps): Promise<Award> {
    const { userId, type, referenceType } = data

    const awards = this.awards.find(
      (award) => award.userId.equals(userId) && award.type === type && award.referenceType === referenceType,
    )

    return awards
  }
}

import { Injectable } from '@nestjs/common'
import {
  AwardRepository,
  GetAwardAccumulatedProps,
} from '@root/domain/award/applications/repositories/award.repositories'

import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaAwardRepository implements AwardRepository {
  constructor(private readonly db: PrismaService) {}

  async getAccumulatedAward(data: GetAwardAccumulatedProps): Promise<number> {
    const { userId } = data
    const award = await this.db.award.aggregate({
      where: {
        userId: userId.toValue(),
      },
      _sum: { goal: true },
    })

    return award._sum.goal
  }
}

import { Injectable } from '@nestjs/common'
import { PerformanceRepository } from '@root/domain/performance/applications/repositories/performance.repositories'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { TeamEngagementDetails } from '../../enterprise/value-objects/team-engagement-details'

type InputProps = {
  embedUserId: UniqueEntityID
  userId?: UniqueEntityID
  period: number
}

type OutputProps = Either<ResourceNotFoundError, Array<TeamEngagementDetails>>

@Injectable()
export class GetTeamEngagementUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly performanceRepository: PerformanceRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { embedUserId, userId, period } = data

    const embedUser = await this.userRepository.findById(embedUserId)
    if (!embedUser) return left(new ResourceNotFoundError())

    if (userId !== null) {
      const user = await this.userRepository.findById(userId)
      if (!user) return left(new ResourceNotFoundError())

      const performanceDetails = await this.performanceRepository.getTeamEngagement({
        userId: user.id,
        period: period,
      })
      return right(performanceDetails)
    }

    const performanceDetails = await this.performanceRepository.getTeamEngagement({
      userId: embedUser.id,
      period: period,
    })
    return right(performanceDetails)
  }
}

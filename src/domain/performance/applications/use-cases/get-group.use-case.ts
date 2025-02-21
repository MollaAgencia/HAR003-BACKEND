import { Injectable } from '@nestjs/common'
import { PerformanceRepository } from '@root/domain/performance/applications/repositories/performance.repositories'
import { mapGroup } from '@root/shared/map-group'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { Group } from '../../enterprise/value-objects/bimonthly-performance-details'

type InputProps = {
  userId: UniqueEntityID
  period: number
}

type OutputProps = Either<ResourceNotFoundError, Group>

@Injectable()
export class GetPerformanceGroupUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly performanceRepository: PerformanceRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId, period } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    const bimonthlyGoal = await this.performanceRepository.getBimonthlySellOutGoal({
      userId: user.id,
      period: period,
    })

    if (!bimonthlyGoal) return left(new ResourceNotFoundError())
    console.log(
      mapGroup({
        value: bimonthlyGoal.goal,
        sallesChannel: bimonthlyGoal.salesChannel,
      }),
    )
    return right(
      mapGroup({
        value: bimonthlyGoal.goal,
        sallesChannel: bimonthlyGoal.salesChannel,
      }),
    )
  }
}

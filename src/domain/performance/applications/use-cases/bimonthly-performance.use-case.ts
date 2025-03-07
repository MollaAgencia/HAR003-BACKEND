import { Injectable } from '@nestjs/common'
import { PerformanceRepository } from '@root/domain/performance/applications/repositories/performance.repositories'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { kpiType } from '../../enterprise/entities/performance.entity'
import { BimonthlyPerformanceDetails } from '../../enterprise/value-objects/bimonthly-performance-details'

type InputProps = {
  userId: UniqueEntityID
  period: number
}

type OutputProps = Either<ResourceNotFoundError, BimonthlyPerformanceDetails>

@Injectable()
export class GetBimonthlyPerformanceUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly performanceRepository: PerformanceRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId, period } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    const performanceDetails = await this.performanceRepository.getBimonthlyPerformance({
      userId: user.id,
      period: period,
    })

    const order = [kpiType.SELL_OUT, kpiType.POSITIVATION, kpiType.URSINHOS, kpiType.ACCELERATOR]

    performanceDetails.performances.sort((a, b) => order.indexOf(a.kpiType) - order.indexOf(b.kpiType))
    return right(performanceDetails)
  }
}

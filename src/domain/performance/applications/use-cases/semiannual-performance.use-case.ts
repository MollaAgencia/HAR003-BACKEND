import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@root/core/errors/errors/not-allowed-error'
import { userRole } from '@root/domain/authorization/enterprise/interfaces/user'
import { PerformanceRepository } from '@root/domain/performance/applications/repositories/performance.repositories'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { SemiannualPerformanceDetails } from '../../enterprise/value-objects/semiannual-performance-details'

type InputProps = {
  userId: UniqueEntityID
  period: number
}

type OutputProps = Either<ResourceNotFoundError, SemiannualPerformanceDetails>

@Injectable()
export class GetSemiannualPerformanceUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly performanceRepository: PerformanceRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId, period } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())
    if (user.role === userRole.SELLER || user.role === userRole.SUPERVISOR) return left(new NotAllowedError())

    const performances = await this.performanceRepository.getManagerSemiannualPerformance({
      userId: user.id,
      period: period,
    })

    return right(performances)
  }
}

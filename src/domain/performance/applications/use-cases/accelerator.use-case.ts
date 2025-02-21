import { Injectable } from '@nestjs/common'
import { PerformanceRepository } from '@root/domain/performance/applications/repositories/performance.repositories'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { AcceleratorDetails } from '../../enterprise/value-objects/accelerator-details'

type InputProps = {
  userId: UniqueEntityID
  period: number
}

type OutputProps = Either<ResourceNotFoundError, AcceleratorDetails>

@Injectable()
export class GetAcceleratorPerformanceUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly performanceRepository: PerformanceRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId, period } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    const acceleratorDetails = await this.performanceRepository.getAccelerator({
      userId: user.id,
      period,
    })

    return right(acceleratorDetails)
  }
}

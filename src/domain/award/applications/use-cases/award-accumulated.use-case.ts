import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { AwardRepository } from '../repositories/award.repositories'

type InputProps = {
  userId: UniqueEntityID
}

type OutputProps = Either<ResourceNotFoundError, number>

@Injectable()
export class GetAccumulatedAwardUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly awardRepository: AwardRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    const award = await this.awardRepository.getAccumulatedAward({
      userId: user.id,
    })

    return right(award)
  }
}

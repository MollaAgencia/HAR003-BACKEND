import { Injectable } from '@nestjs/common'
import { ManagerRankingRepository } from '@root/domain/ranking/applications/repositories/manager-ranking.repositories'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { RankingManager } from '../../enterprise/entities/ranking-manager.entity'

type InputProps = {
  userId: UniqueEntityID
}

type OutputProps = Either<ResourceNotFoundError, RankingManager>

@Injectable()
export class GetCurrentManagerRankingUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly managerRankingRepository: ManagerRankingRepository, // Alterado para repositório de gerentes
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    const ranking = await this.managerRankingRepository.findCurrentRanking({
      userId: userId,
    })

    if (!ranking) return left(new ResourceNotFoundError())

    return right(ranking)
  }
}

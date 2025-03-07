import { Injectable } from '@nestjs/common'
import { ManagerRankingRepository } from '@root/domain/ranking/applications/repositories/manager-ranking.repositories'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'

import { RankingsManagerDetails } from '../../enterprise/value-objects/ranking-manager-details'

type InputProps = {
  userId: UniqueEntityID
  period: number
}

type OutputProps = Either<ResourceNotFoundError, Array<RankingsManagerDetails>>

@Injectable()
export class GetManagerRankingsUseCase {
  constructor(
    private readonly managerRankingRepository: ManagerRankingRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId, period } = data

    const user = await this.usersRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    const rankings = await this.managerRankingRepository.findMany({
      period,
      region: user.region,
    })

    return right(rankings)
  }
}

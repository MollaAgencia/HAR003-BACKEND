import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@root/domain/authorization/applications/repositories/users.repository'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { NotAllowedError } from '@core/errors/errors/not-allowed-error'
import { Either, left, right } from '@core/logic/Either'

import { Distributor } from '../../enterprise/entities/distrubutor.entity'
import { DistributorRepository } from '../repositories/distributor.repository'

type InputProps = {
  userId: UniqueEntityID
}

type OutputProps = Either<NotAllowedError, Array<Distributor>>

@Injectable()
export class FindDistributorsUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly distributorRepository: DistributorRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId } = data

    const user = await this.usersRepository.findById(userId)
    if (!user) return left(new NotAllowedError())

    const distributors = await this.distributorRepository.findMany()
    return right(distributors)
  }
}

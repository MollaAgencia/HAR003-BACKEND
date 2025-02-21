import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { User } from '@domain/authorization/enterprise/entities/user.entity'

import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  id: UniqueEntityID
}

type OutputProps = Either<ResourceNotFoundError | InactiveResourceError, User>

@Injectable()
export class FindUserUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { id } = data

    const user = await this.userRepository.findById(id)
    if (!user) return left(new ResourceNotFoundError())

    if (user.disabled) return left(new InactiveResourceError())

    return right(user)
  }
}

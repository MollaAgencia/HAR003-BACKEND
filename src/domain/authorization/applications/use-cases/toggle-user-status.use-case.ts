import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { NotAllowedError } from '@root/core/errors/errors/not-allowed-error'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'

import { userRole } from '../../enterprise/interfaces/user'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  sub: UniqueEntityID
  userId: UniqueEntityID
}

type OutputProps = Either<EmailBadFormattedError | ResourceNotFoundError | InactiveResourceError, null>

@Injectable()
export class ToggleUserStatusUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { sub, userId } = data

    const subUser = await this.usersRepository.findById(sub)
    if (subUser.role !== userRole.MASTER && subUser.role !== userRole.ADMIN && subUser.role !== userRole.MANAGER)
      return left(new NotAllowedError())

    const user = await this.usersRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    await this.usersRepository.toggleStatus(user)

    return right(null)
  }
}

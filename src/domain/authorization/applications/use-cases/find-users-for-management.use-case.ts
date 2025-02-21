import { Injectable } from '@nestjs/common'
import { PaginatedResult } from '@root/core/dto/paginated-result'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { NotAllowedError } from '@core/errors/errors/not-allowed-error'
import { Either, left, right } from '@core/logic/Either'

import { User } from '../../enterprise/entities/user.entity'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  userId: UniqueEntityID
  pageIndex: number
  status?: string
  name?: string
  document?: string
}

type OutputProps = Either<NotAllowedError, PaginatedResult<User[]>>

@Injectable()
export class FindUsersForManagementUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId, pageIndex, status, name, document } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new NotAllowedError())

    const users = await this.userRepository.findManyForManagement({ pageIndex, limit: 10 }, { status, name, document })
    return right(users)
  }
}

import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { NotAllowedError } from '@core/errors/errors/not-allowed-error'
import { Either, left, right } from '@core/logic/Either'

import { userRole, UserRole } from '@domain/authorization/enterprise/interfaces/user'

import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  userId: UniqueEntityID
}

type OutputProps = Either<
  NotAllowedError,
  Array<{
    id: UniqueEntityID
    name: string
    role: UserRole
  }>
>

@Injectable()
export class FindUsersForIncorporateUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId } = data

    const user = await this.userRepository.findById(userId)
    if (!user) return left(new NotAllowedError())

    if (user.role === userRole.MASTER) {
      const users = await this.userRepository.findManyByIncorporate([
        userRole.ADMIN,
        userRole.DISTRIBUTOR,
        userRole.MANAGER,
        userRole.SUPERVISOR,
        userRole.SELLER,
      ])

      const usersWithMe = users.concat({
        id: user.id,
        name: user.name,
        role: user.role,
      })

      return right(usersWithMe)
    }

    if (user.role === userRole.ADMIN) {
      const users = await this.userRepository.findManyByIncorporate([
        userRole.DISTRIBUTOR,
        userRole.MANAGER,
        userRole.SUPERVISOR,
        userRole.SELLER,
      ])

      const usersWithMe = users.concat({
        id: user.id,
        name: user.name,
        role: user.role,
      })

      return right(usersWithMe)
    }

    return right([])
  }
}

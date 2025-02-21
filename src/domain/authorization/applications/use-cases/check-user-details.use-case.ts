import { Injectable } from '@nestjs/common'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { User } from '@domain/authorization/enterprise/entities/user.entity'

import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  email: string
}

type OutputProps = Either<
  ResourceNotFoundError | InactiveResourceError,
  {
    firstAccess: boolean
    user: User
  }
>

@Injectable()
export class CheckUserDetailsUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email } = data

    const user = await this.userRepository.findByEmail(email)
    if (!user) return left(new ResourceNotFoundError())

    if (user.disabled) return left(new InactiveResourceError())

    return right({
      firstAccess: !user.password,
      user,
    })
  }
}

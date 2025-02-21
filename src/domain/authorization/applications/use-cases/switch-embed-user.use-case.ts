import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { NotAllowedError } from '@core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { Encrypter } from '../cryptography/encrypter'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  userId: UniqueEntityID
  embedUserId: UniqueEntityID
}

type OutputProps = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    accessToken: string
  }
>

@Injectable()
export class SwitchEmbedUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { userId, embedUserId } = data

    const user = await this.usersRepository.findById(userId)
    if (!user) return left(new NotAllowedError())

    const embedUser = await this.usersRepository.findById(embedUserId)
    if (!embedUser) return left(new ResourceNotFoundError())

    const accessToken = await this.encrypter.encrypt({
      payload: {
        sub: user.id.toValue(),
        subRole: user.role,
        embed: embedUser.id.toValue(),
        embedRole: embedUser.role,
      },
    })

    return right({ accessToken })
  }
}

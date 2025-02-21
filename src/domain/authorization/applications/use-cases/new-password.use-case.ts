import { Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { Either, left, right } from '@core/logic/Either'

import { ExpiredPasswordResetTokenError } from '@domain/authorization/applications/errors/expired-password-reset-token.error'
import { InvalidPasswordResetTokenError } from '@domain/authorization/applications/errors/invalid-password-reset-token.error'

import { HashGenerator } from '../cryptography/hash-generator'
import { TokensRepository } from '../repositories/tokens.repository'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  token: UniqueEntityID
  newPassword: string
}

type OutputProps = Either<InvalidPasswordResetTokenError | ExpiredPasswordResetTokenError | InactiveResourceError, null>

@Injectable()
export class NewPasswordUseCase {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { token, newPassword } = data

    const passwordResetToken = await this.tokensRepository.findById(token)
    if (!passwordResetToken) return left(new InvalidPasswordResetTokenError(token.toValue()))

    const isExpired = dayjs().diff(passwordResetToken.createdAt, 'minutes') > 7
    if (isExpired) {
      await this.tokensRepository.delete(passwordResetToken)
      return left(new ExpiredPasswordResetTokenError(token.toValue()))
    }

    const user = await this.usersRepository.findById(passwordResetToken.userId)
    if (!user) return left(new InvalidPasswordResetTokenError(token.toValue()))

    if (user.disabled) return left(new InactiveResourceError())

    const passwordHashed = await this.hashGenerator.hash(newPassword)

    user.password = passwordHashed
    user.touch()

    await Promise.all([this.usersRepository.save(user), this.tokensRepository.delete(passwordResetToken)])

    return right(null)
  }
}

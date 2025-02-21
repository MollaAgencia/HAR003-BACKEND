import { Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { Either, left, right } from '@core/logic/Either'

import { TokensRepository } from '@domain/authorization/applications/repositories/tokens.repository'

import { ExpiredVerificationEmailTokenError } from '../errors/expired-verification-email-token.error'
import { InvalidVerificationEmailTokenError } from '../errors/invalid-verification-email-token.error'
import { UserAlreadyVerificationEmailError } from '../errors/user-already-verification-email.error'
import { UsersRepository } from '../repositories/users.repository'
type InputProps = {
  token: UniqueEntityID
}

type OutputProps = Either<
  | InvalidVerificationEmailTokenError
  | UserAlreadyVerificationEmailError
  | ExpiredVerificationEmailTokenError
  | InactiveResourceError,
  null
>

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { token } = data

    const verificationEmailToken = await this.tokensRepository.findById(token)
    if (!verificationEmailToken) return left(new InvalidVerificationEmailTokenError(token.toValue()))

    const isExpired = dayjs().diff(verificationEmailToken.createdAt, 'minutes') > 7
    if (isExpired) {
      await this.tokensRepository.delete(verificationEmailToken)
      return left(new ExpiredVerificationEmailTokenError(token.toValue()))
    }

    const user = await this.usersRepository.findById(verificationEmailToken.userId)
    if (!user) return left(new InvalidVerificationEmailTokenError(token.toValue()))

    if (user.disabled) return left(new InactiveResourceError())

    const isUserAlreadyVerified = !!user.emailVerified
    if (isUserAlreadyVerified) return left(new UserAlreadyVerificationEmailError(token.toValue()))

    user.verifyEmail()
    user.touch()

    await Promise.all([this.usersRepository.save(user), this.tokensRepository.delete(verificationEmailToken)])

    return right(null)
  }
}

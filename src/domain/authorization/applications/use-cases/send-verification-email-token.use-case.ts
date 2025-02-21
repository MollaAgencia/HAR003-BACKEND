import { Injectable } from '@nestjs/common'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { WrongCredentialsError } from '@domain/authorization/applications/errors/wrong-credentials.error'
import { TokensRepository } from '@domain/authorization/applications/repositories/tokens.repository'
import { Token } from '@domain/authorization/enterprise/entities/token.entity'
import { Email } from '@domain/authorization/enterprise/value-objects/email'

import { UserAlreadyVerificationEmailError } from '../errors/user-already-verification-email.error'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  email: string
}

type OutputProps = Either<
  EmailBadFormattedError | WrongCredentialsError | UserAlreadyVerificationEmailError | InactiveResourceError,
  null
>

@Injectable()
export class SendVerificationEmailTokenUseCase {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email } = data

    const isInvalidEmail = !Email.validate(email)
    if (isInvalidEmail) return left(new EmailBadFormattedError(email))

    const user = await this.usersRepository.findByEmail(email)
    if (!user) return left(new WrongCredentialsError())

    if (user.disabled) return left(new InactiveResourceError())

    const userAlreadyVerified = !!user.emailVerified
    if (userAlreadyVerified) return left(new UserAlreadyVerificationEmailError(email))

    const verificationAlreadySent = await this.tokensRepository.findByUserId(user.id)
    if (verificationAlreadySent) {
      await this.tokensRepository.delete(verificationAlreadySent)
    }

    const verificationToken = Token.create({ userId: user.id, type: 'EMAIL_VERIFICATION' })
    await this.tokensRepository.sendToken(verificationToken)

    return right(null)
  }
}

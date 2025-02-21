import { Injectable } from '@nestjs/common'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { Token } from '@domain/authorization/enterprise/entities/token.entity'
import { Email } from '@domain/authorization/enterprise/value-objects/email'

import { TokensRepository } from '../repositories/tokens.repository'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  email: string
}

type OutputProps = Either<EmailBadFormattedError | ResourceNotFoundError | InactiveResourceError, null>

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email } = data

    const isInvalidEmail = !Email.validate(email)
    if (isInvalidEmail) return left(new EmailBadFormattedError(email))

    const user = await this.usersRepository.findByEmail(email)
    if (!user) return left(new ResourceNotFoundError())

    if (user.disabled) return left(new InactiveResourceError())

    const passwordResetTokenAlreadySent = await this.tokensRepository.findByUserId(user.id)
    if (passwordResetTokenAlreadySent) {
      await this.tokensRepository.delete(passwordResetTokenAlreadySent)
    }
    console.log(email)

    const passwordResetToken = Token.create({ userId: user.id, type: 'PASSWORD_RESET' })

    await this.tokensRepository.sendToken(passwordResetToken)

    return right(null)
  }
}

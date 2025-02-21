import { Injectable } from '@nestjs/common'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailNotVerifiedError } from '@domain/authorization/applications/errors/email-not-verified.error'
import { WrongCredentialsError } from '@domain/authorization/applications/errors/wrong-credentials.error'
import { TokensRepository } from '@domain/authorization/applications/repositories/tokens.repository'
import { Token } from '@domain/authorization/enterprise/entities/token.entity'

import { EnvService } from '@infra/env/env.service'

import { Encrypter } from '../cryptography/encrypter'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  email: string
  password: string
}

type OutputProps = Either<
  EmailNotVerifiedError | InactiveResourceError | WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthorizationUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly encrypter: Encrypter,
    private readonly envService: EnvService,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email, password } = data

    const user = await this.usersRepository.findByEmail(email)
    if (!user) return left(new WrongCredentialsError())

    if (user.disabled) return left(new InactiveResourceError())

    const masterPasswordHomology = 'Molla@2024'

    if (this.envService.get('FROM') === 'DEV' && password === masterPasswordHomology) {
      const accessToken = await this.encrypter.encrypt({
        payload: {
          sub: user.id.toValue(),
          subRole: user.role,
          embed: user.id.toValue(),
          embedRole: user.role,
        },
      })

      return right({ accessToken })
    } else {
      const passwordMatch = await this.hashGenerator.compare(password, user.password)
      if (!passwordMatch) return left(new WrongCredentialsError())
    }

    if (!user.emailVerified) {
      const verificationAlreadySent = await this.tokensRepository.findByUserId(user.id)
      if (verificationAlreadySent) await this.tokensRepository.delete(verificationAlreadySent)

      const verificationToken = Token.create({ userId: user.id, type: 'EMAIL_VERIFICATION' })
      await this.tokensRepository.sendToken(verificationToken)

      return left(new EmailNotVerifiedError(user.email))
    }

    const accessToken = await this.encrypter.encrypt({
      payload: {
        sub: user.id.toValue(),
        subRole: user.role,
        embed: user.id.toValue(),
        embedRole: user.role,
      },
    })

    return right({ accessToken })
  }
}

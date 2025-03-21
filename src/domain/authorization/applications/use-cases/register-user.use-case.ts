import { Injectable } from '@nestjs/common'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceAlreadyExistsError } from '@core/errors/errors/resource-already-exists-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { TokensRepository } from '@domain/authorization/applications/repositories/tokens.repository'
import { Token } from '@domain/authorization/enterprise/entities/token.entity'

import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  email: string
  password: string
  telephone: string
  document: string
}

type OutputProps = Either<
  EmailBadFormattedError | ResourceNotFoundError | ResourceAlreadyExistsError | InactiveResourceError,
  null
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly tokensRepository: TokensRepository,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email, password, document, telephone } = data

    const user = await this.usersRepository.findByEmail(email)
    if (!user) return left(new ResourceNotFoundError())

    const cpfAlreadyInUse = await this.usersRepository.findByDocument(document)
    if (cpfAlreadyInUse) return left(new ResourceAlreadyExistsError())

    if (user.disabled) return left(new InactiveResourceError())

    user.password = await this.hashGenerator.hash(password)
    user.telephone = telephone
    user.document = document

    await this.usersRepository.save(user)

    const verificationAlreadySent = await this.tokensRepository.findByUserId(user.id)
    if (verificationAlreadySent) {
      await this.tokensRepository.delete(verificationAlreadySent)
    }

    const verificationToken = Token.create({ userId: user.id, type: 'EMAIL_VERIFICATION' })
    await this.tokensRepository.sendToken(verificationToken)

    return right(null)
  }
}

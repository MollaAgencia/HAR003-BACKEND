import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'

import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  sub: UniqueEntityID
  document: string
}

type OutputProps = Either<EmailBadFormattedError | ResourceNotFoundError | InactiveResourceError, null>

@Injectable()
export class UpdateDocumentUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { document, sub } = data

    const user = await this.usersRepository.findById(sub)
    if (!user) return left(new ResourceNotFoundError())

    user.document = document

    await this.usersRepository.update(user)

    return right(null)
  }
}

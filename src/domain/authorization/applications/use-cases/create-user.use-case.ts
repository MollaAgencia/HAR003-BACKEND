import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { NotAllowedError } from '@root/core/errors/errors/not-allowed-error'
import { ResourceAlreadyExistsError } from '@root/core/errors/errors/resource-already-exists-error'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { Email } from '@domain/authorization/enterprise/value-objects/email'

import { User } from '../../enterprise/entities/user.entity'
import { Region, SalesChannel, userRole, UserRole } from '../../enterprise/interfaces/user'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  sub: UniqueEntityID
  name: string
  email: string
  telephone: string
  document: string
  role: UserRole
  distributorId: string
  salesChannel: SalesChannel
  region: Region
}

type OutputProps = Either<EmailBadFormattedError | ResourceNotFoundError | InactiveResourceError, null>

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email, name, document, telephone, role, sub, distributorId, salesChannel, region } = data
    const subUser = await this.usersRepository.findById(sub)

    if (subUser.role !== userRole.MASTER) return left(new NotAllowedError())

    const isInvalidEmail = !Email.validate(email)
    if (isInvalidEmail) return left(new EmailBadFormattedError(email))

    const userDb = await this.usersRepository.findByEmail(email)
    if (userDb) return left(new ResourceAlreadyExistsError())

    const user = User.create(
      {
        name: name,
        telephone: telephone,
        document: document,
        email: email,
        role: role,
        distributorId: new UniqueEntityID(distributorId),
        salesChannel: salesChannel,
        region: region,
      },
      new UniqueEntityID(),
    )

    await this.usersRepository.create(user)

    return right(null)
  }
}

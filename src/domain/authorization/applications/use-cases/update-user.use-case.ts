import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { NotAllowedError } from '@root/core/errors/errors/not-allowed-error'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'
import { Either, left, right } from '@core/logic/Either'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { Email } from '@domain/authorization/enterprise/value-objects/email'

import { Region, SalesChannel, userRole, UserRole } from '../../enterprise/interfaces/user'
import { UsersRepository } from '../repositories/users.repository'

type InputProps = {
  sub: UniqueEntityID
  name: string
  email: string
  telephone: string
  document: string
  role: UserRole
  userId: UniqueEntityID
  distributorId: string
  salesChannel: SalesChannel
  region: Region
}

type OutputProps = Either<EmailBadFormattedError | ResourceNotFoundError | InactiveResourceError, null>

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email, name, document, telephone, role, sub, userId, distributorId, salesChannel, region } = data

    const subUser = await this.usersRepository.findById(sub)
    if (subUser.role !== userRole.MASTER && subUser.role !== userRole.ADMIN && subUser.role !== userRole.MANAGER)
      return left(new NotAllowedError())

    const isInvalidEmail = !Email.validate(email)
    if (isInvalidEmail) return left(new EmailBadFormattedError(email))

    const user = await this.usersRepository.findById(userId)
    if (!user) return left(new ResourceNotFoundError())

    user.name = name
    user.telephone = telephone
    user.document = document
    user.email = email
    user.role = role
    user.distributorId = new UniqueEntityID(distributorId)
    user.salesChannel = salesChannel
    user.region = region

    await this.usersRepository.update(user)

    return right(null)
  }
}

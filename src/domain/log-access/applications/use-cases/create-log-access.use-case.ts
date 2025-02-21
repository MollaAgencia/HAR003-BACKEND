import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Either, right } from '@root/core/logic/Either'

import { LogAccess } from '../../enterprise/entities/log-access.entity'
import { LogAccessRepository } from '../repositories/log-access.repository'

type InputProps = {
  userId: UniqueEntityID
  page: string
}

type Output = Either<null, null>

@Injectable()
export class CreateLogAccessUseCase {
  constructor(private readonly logAccessRepository: LogAccessRepository) {}

  async execute(data: InputProps): Promise<Output> {
    const { page, userId } = data

    const userAlreadyAccessedToday = await this.logAccessRepository.findAccess({ page, userId })

    if (userAlreadyAccessedToday) return right(null)

    const logAccess = LogAccess.create({
      page,
      userId,
    })

    await this.logAccessRepository.create(logAccess)

    return right(null)
  }
}

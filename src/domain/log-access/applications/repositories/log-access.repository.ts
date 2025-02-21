import { UniqueEntityID } from '@root/core/domain/unique-entity-id'

import { LogAccess } from '../../enterprise/entities/log-access.entity'

type FindAccessProps = {
  userId: UniqueEntityID
  page: string
}

export abstract class LogAccessRepository {
  abstract create(logAccess: LogAccess): Promise<void>
  abstract findAccess({ page, userId }: FindAccessProps): Promise<LogAccess>
}

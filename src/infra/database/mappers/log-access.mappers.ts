import { LogAccessPage as LogAccessPrisma, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { LogAccess } from '@domain/log-access/enterprise/entities/log-access.entity'

export class LogAccessMappers {
  static toDomain(data: LogAccessPrisma): LogAccess {
    return LogAccess.create(
      {
        page: data.page,
        userId: new UniqueEntityID(data.userId),
        createdAt: new Date(data.createdAt),
      },
      new UniqueEntityID(data.id),
    )
  }

  static toPersistence(data: LogAccess): Prisma.LogAccessPageCreateInput {
    return {
      id: data.id.toValue(),
      page: data.page,
      createdAt: data.createdAt,
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
    }
  }
}

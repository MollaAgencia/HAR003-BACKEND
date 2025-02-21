import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { LogAccessRepository } from '@domain/log-access/applications/repositories/log-access.repository'
import { LogAccess } from '@domain/log-access/enterprise/entities/log-access.entity'

import { LogAccessMappers } from '@infra/database/mappers/log-access.mappers'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaLogAccessRepository implements LogAccessRepository {
  constructor(private readonly db: PrismaService) {}

  async create(logAccess: LogAccess): Promise<void> {
    const raw = LogAccessMappers.toPersistence(logAccess)

    await this.db.logAccessPage.create({
      data: raw,
    })

    return
  }

  async findAccess({ page, userId }: { userId: UniqueEntityID; page: string }): AsyncMaybe<LogAccess> {
    const userAlreadyAccessedToday = await this.db.logAccessPage.findFirst({
      where: {
        userId: userId.toValue(),
        page,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    })

    if (!userAlreadyAccessedToday) return null

    return LogAccessMappers.toDomain(userAlreadyAccessedToday)
  }
}

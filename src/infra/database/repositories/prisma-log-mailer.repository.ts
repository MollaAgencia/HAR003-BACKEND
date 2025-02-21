import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { MailRepository } from '@domain/mailer/applications/repositories/mail.repository'
import { Mail } from '@domain/mailer/enterprise/entities/mail'

import { MailMappers } from '@infra/database/mappers/log-mailer.mappers'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMailRepository implements MailRepository {
  constructor(private readonly db: PrismaService) {}

  async create(log: Mail): Promise<void> {
    const raw = MailMappers.toPersistence(log)

    await this.db.mail.create({ data: raw })

    return
  }

  async findById(id: UniqueEntityID): AsyncMaybe<Mail> {
    const log = await this.db.mail.findUnique({
      where: {
        id: id.toValue(),
      },
    })

    if (!log) return null

    return MailMappers.toDomain(log)
  }

  async save(log: Mail): Promise<void> {
    const raw = MailMappers.toPersistence(log)

    await this.db.mail.update({
      where: {
        id: raw.id,
      },
      data: raw,
    })

    return
  }
}

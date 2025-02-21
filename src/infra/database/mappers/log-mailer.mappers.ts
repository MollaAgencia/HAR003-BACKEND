import { Mail as MailPrisma, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { Mail, MailStatus, MailType } from '@domain/mailer/enterprise/entities/mail'

export class MailMappers {
  static toDomain(data: MailPrisma): Mail {
    return Mail.create(
      {
        body: data.body,
        status: MailStatus[data.status as keyof typeof MailStatus],
        email: data.email,
        subject: data.subject,
        userId: data.userId ? new UniqueEntityID(data.userId) : undefined,
        type: MailType[data.type as keyof typeof MailType],
        createdAt: new Date(data.createdAt),
      },
      new UniqueEntityID(data.id),
    )
  }

  static toPersistence(data: Mail): Prisma.MailCreateInput {
    return {
      id: data.id.toValue(),
      body: data.body,
      status: data.status,
      type: data.type,
      email: data.email,
      subject: data.subject,
      user: data.userId ? { connect: { id: data.userId.toValue() } } : undefined,
      createdAt: new Date(data.createdAt),
    }
  }
}

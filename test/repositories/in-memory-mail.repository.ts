import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { AsyncMaybe } from '@root/core/logic/Maybe'
import { MailRepository } from '@root/domain/mailer/applications/repositories/mail.repository'
import { Mail } from '@root/domain/mailer/enterprise/entities/mail'

export class InMemoryMailRepository implements MailRepository {
  public mails: Array<Mail> = []

  async create(log: Mail): Promise<void> {
    this.mails.push(log)
    return
  }
  async findById(id: UniqueEntityID): AsyncMaybe<Mail> {
    const mail = this.mails.find((item) => item.id.toValue() === id.toValue())
    if (!mail) return null

    return mail
  }
  async save(mail: Mail): Promise<void> {
    const index = this.mails.findIndex((m) => mail.id.toValue() === m.id.toValue())

    this.mails[index] = mail
    return
  }
}

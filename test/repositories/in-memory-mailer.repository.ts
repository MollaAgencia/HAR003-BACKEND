import { Mail } from '@root/domain/mailer/enterprise/entities/mail'

import { MailerRepository } from '@infra/mailer/mailer.repository'

export class InMemoryMailerRepository implements MailerRepository {
  public mailers: Array<Mail> = []

  async sendMail(mailer: Mail): Promise<void> {
    this.mailers.push(mailer)
    return
  }
}

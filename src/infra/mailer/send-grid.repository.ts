import { Injectable } from '@nestjs/common'

import { Mail } from '@domain/mailer/enterprise/entities/mail'

import { MailerRepository } from '@infra/mailer/mailer.repository'

import { SendGridClient } from './send-grid.client'

@Injectable()
export class SendGridRepository implements MailerRepository {
  constructor(private readonly sendGridClient: SendGridClient) {}

  async sendMail(mailer: Mail): Promise<void> {
    await this.sendGridClient.send({
      from: 'contato@haribogames.haribo.com',
      to: mailer.email,
      subject: mailer.subject,
      html: mailer.body,
    })

    return
  }
}

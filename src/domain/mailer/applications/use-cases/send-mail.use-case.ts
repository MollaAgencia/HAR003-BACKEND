import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@root/core/logic/Either'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { EmailNotSendError } from '@domain/mailer/applications/errors/email-not-send.error'
import { MailRepository } from '@domain/mailer/applications/repositories/mail.repository'
import { Mail, MailStatus, MailType } from '@domain/mailer/enterprise/entities/mail'

import { MailerRepository } from '@infra/mailer/mailer.repository'

type InputProps = {
  userId?: UniqueEntityID
  subject: string
  email: string
  body: string
  type: MailType
}

type Output = Either<EmailNotSendError, Mail>

@Injectable()
export class SendMailUseCase {
  constructor(
    private readonly mailerRepository: MailerRepository,
    private readonly mailRepoistory: MailRepository,
  ) {}

  async execute(data: InputProps): Promise<Output> {
    const { userId, subject, body, type, email } = data
    const mail = Mail.create({ userId, subject, body, type, email })
    try {
      await this.mailRepoistory.create(mail)
      await this.mailerRepository.sendMail(mail)
      mail.status = MailStatus.SUCCESS
      await this.mailRepoistory.save(mail)
      return right(mail)
    } catch (error) {
      mail.status = MailStatus.FAILED
      return left(new EmailNotSendError(email))
    }
  }
}

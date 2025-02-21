import { Mail } from '@domain/mailer/enterprise/entities/mail'

export abstract class MailerRepository {
  abstract sendMail(mailer: Mail): Promise<void>
}

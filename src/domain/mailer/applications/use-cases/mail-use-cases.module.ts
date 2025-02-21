import { Module } from '@nestjs/common'
import { DatabaseModule } from '@root/infra/database/database.module'

import { SendMailUseCase } from '@domain/mailer/applications/use-cases/send-mail.use-case'

import { MailerModule } from '@infra/mailer/mailer.module'

@Module({
  imports: [DatabaseModule, MailerModule],
  providers: [SendMailUseCase],
  exports: [SendMailUseCase],
})
export class MailUseCaseModule {}

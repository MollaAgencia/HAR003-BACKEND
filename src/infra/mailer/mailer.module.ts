import { Module } from '@nestjs/common'

import { EnvModule } from '@infra/env/env.module'
import { MailerRepository } from '@infra/mailer/mailer.repository'
import { SendGridClient } from '@infra/mailer/send-grid.client'
import { SendGridRepository } from '@infra/mailer/send-grid.repository'

@Module({
  imports: [EnvModule],
  providers: [
    SendGridClient,
    {
      provide: MailerRepository,
      useClass: SendGridRepository,
    },
  ],
  exports: [MailerRepository],
})
export class MailerModule {}

import { Module } from '@nestjs/common'

import { AuthorizationUseCasesModule } from '@domain/authorization/applications/use-cases/authorization-use-cases.module'
import { MailUseCaseModule } from '@domain/mailer/applications/use-cases/mail-use-cases.module'

import { EnvModule } from '@infra/env/env.module'

import { OnSendEmailFromTokensSubscriber } from './subscribers/on-send-email-from-tokens.subscriber'
import { OnSendEmailVerifiedSubscriber } from './subscribers/on-send-email-verified.subscriber'

@Module({
  imports: [EnvModule, MailUseCaseModule, AuthorizationUseCasesModule],
  providers: [OnSendEmailFromTokensSubscriber, OnSendEmailVerifiedSubscriber],
})
export class EventsModule {}

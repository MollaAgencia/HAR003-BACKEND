import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@core/events/domain-events'
import { EventHandler } from '@core/events/event-handler'

import { FindUserUseCase } from '@domain/authorization/applications/use-cases/find-user.use-case'
import { SendTokenEvent } from '@domain/authorization/enterprise/events/send-token.event'
import { SendMailUseCase } from '@domain/mailer/applications/use-cases/send-mail.use-case'
import { MailType } from '@domain/mailer/enterprise/entities/mail'

import { EnvService } from '@infra/env/env.service'
import { forgotPasswordTemplate } from '@infra/mailer/templates/forgot-password.template'
import { verifyEmailTemplate } from '@infra/mailer/templates/verify-email.template'

@Injectable()
export class OnSendEmailFromTokensSubscriber implements EventHandler {
  constructor(
    private readonly envService: EnvService,
    private readonly sendMail: SendMailUseCase,
    private readonly findUser: FindUserUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.handle.bind(this), SendTokenEvent.name)
  }

  private async handle({ token }: SendTokenEvent): Promise<void> {
    try {
      const user = await this.findUser.execute({ id: token.userId })
      if (user.isLeft()) return

      if (token.type === 'EMAIL_VERIFICATION') {
        const redirect = new URL('/auth/verify-email', this.envService.get('APP_URL_DASHBOARD'))
        redirect.searchParams.set('token', token.id.toValue())

        await this.sendMail.execute({
          userId: user.value.id,
          email: 'hiago.maciel@agenciamolla.com.br',
          type: MailType.VERIFY_EMAIL,
          subject: 'Verificação de e-mail',
          body: verifyEmailTemplate({ url: redirect.toString(), name: user.value.name }),
        })
      }

      if (token.type === 'PASSWORD_RESET') {
        const redirect = new URL('/auth/new-password', this.envService.get('APP_URL_DASHBOARD'))
        redirect.searchParams.set('token', token.id.toValue())

        await this.sendMail.execute({
          userId: user.value.id,
          email: 'hiago.maciel@agenciamolla.com.br',
          type: MailType.FORGOT_PASSWORD,
          subject: 'Recuperação de senha',
          body: forgotPasswordTemplate({ url: redirect.toString(), name: user.value.name }),
        })
      }
    } catch {}
  }
}

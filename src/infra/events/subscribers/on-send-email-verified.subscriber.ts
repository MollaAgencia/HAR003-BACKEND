import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@core/events/domain-events'
import { EventHandler } from '@core/events/event-handler'

import { SendEmailVerifiedEvent } from '@domain/authorization/enterprise/events/send-email-verified.event'
import { SendMailUseCase } from '@domain/mailer/applications/use-cases/send-mail.use-case'
import { MailType } from '@domain/mailer/enterprise/entities/mail'

import { registeredTemplate } from '@infra/mailer/templates/registered.template'

@Injectable()
export class OnSendEmailVerifiedSubscriber implements EventHandler {
  constructor(private readonly sendMail: SendMailUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendPasswordResetToken.bind(this), SendEmailVerifiedEvent.name)
  }

  private async sendPasswordResetToken({ user }: SendEmailVerifiedEvent): Promise<void> {
    try {
      await this.sendMail.execute({
        userId: user.id,
        email: user.email,
        type: MailType.WELCOME,
        subject: 'Verificação de e-mail',
        body: registeredTemplate(user.name),
      })
    } catch {}
  }
}

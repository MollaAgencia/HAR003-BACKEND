import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import { SendEmailBodySwaggerDto, SendSacSwaggerDto } from '@root/presentations/swagger/send-sac.dto'

import { EmailNotSendError } from '@domain/mailer/applications/errors/email-not-send.error'
import { SendMailUseCase } from '@domain/mailer/applications/use-cases/send-mail.use-case'
import { MailType } from '@domain/mailer/enterprise/entities/mail'

import { SacTemplate } from '@infra/mailer/templates/sac.template'

@Public()
@ApiTags('Suport')
@Controller({ path: 'support', version: '1' })
export class SacController {
  constructor(private readonly sendEmail: SendMailUseCase) {}

  @SendSacSwaggerDto()
  @HttpCode(200)
  @Post()
  async handle(@Body() body: SendEmailBodySwaggerDto) {
    const { email, message, name, telephone, subject } = body

    const result = await this.sendEmail.execute({
      email: 'contato-haribogames@agenciamolla.com.br',
      body: SacTemplate({ email, message, name, telephone, subject }),
      type: MailType.SAC,
      subject: 'Contato - SAC',
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailNotSendError:
          throw new BadRequestException(error.message, {
            description: error.name,
          })

        default:
          throw new BadRequestException('Bad request', {
            description: 'BadRequestError',
          })
      }
    }

    return {
      message: 'Success in sending the message',
    }
  }
}

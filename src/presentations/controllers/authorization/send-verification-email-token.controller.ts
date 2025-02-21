import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import {
  SendVerificationEmailTokenBodySwaggerDto,
  SendVerificationEmailTokenSwaggerDto,
} from '@root/presentations/swagger/send-verification-email-token-swagger.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { UserAlreadyVerificationEmailError } from '@domain/authorization/applications/errors/user-already-verification-email.error'
import { WrongCredentialsError } from '@domain/authorization/applications/errors/wrong-credentials.error'
import { SendVerificationEmailTokenUseCase } from '@domain/authorization/applications/use-cases/send-verification-email-token.use-case'

@Public()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class SendVerificationEmailTokenController {
  constructor(private sendVerificationEmail: SendVerificationEmailTokenUseCase) {}

  @Post('/send-email-verification')
  @HttpCode(200)
  @SendVerificationEmailTokenSwaggerDto()
  async handle(@Body() body: SendVerificationEmailTokenBodySwaggerDto) {
    const { email } = body

    const result = await this.sendVerificationEmail.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case EmailBadFormattedError:
          throw new BadRequestException(error.message, {
            description: error.name,
          })

        case WrongCredentialsError:
          throw new UnauthorizedException(error.message, {
            description: error.name,
          })

        case InactiveResourceError:
          throw new UnauthorizedException(error.message, {
            description: error.name,
          })

        case UserAlreadyVerificationEmailError:
          throw new ConflictException(error.message, {
            description: error.name,
          })

        default:
          throw new BadRequestException('Bad request', {
            description: 'BadRequestError',
          })
      }
    }

    return {
      message: 'Verification send to email address',
    }
  }
}

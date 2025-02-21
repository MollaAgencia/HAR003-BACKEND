import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import {
  ForgotPasswordBodySwaggerDto,
  ForgotPasswordSwaggerDto,
} from '@root/presentations/swagger/forgot-password-swagger.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { ForgotPasswordUseCase } from '@domain/authorization/applications/use-cases/forgot-password.use-case'

@Public()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class ForgotPasswordController {
  constructor(private forgotPassword: ForgotPasswordUseCase) {}

  @Post('/forgot-password')
  @HttpCode(200)
  @ForgotPasswordSwaggerDto()
  async handle(@Body() body: ForgotPasswordBodySwaggerDto) {
    const { email } = body

    const result = await this.forgotPassword.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case EmailBadFormattedError:
          throw new BadRequestException(error.message, {
            description: error.name,
          })

        case ResourceNotFoundError:
          throw new NotFoundException(error.message, {
            description: error.name,
          })

        case InactiveResourceError:
          throw new UnauthorizedException(error.message, {
            description: error.name,
          })

        default:
          throw new BadRequestException('Bad request', {
            description: 'BadRequestError',
          })
      }
    }

    return {
      message: 'Password recovery sent to your email',
    }
  }
}

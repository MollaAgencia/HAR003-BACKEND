import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import { SwaggerVerifyEmailDto, VerifyEmailQueryDto } from '@root/presentations/swagger/verify-email-swagger.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'

import { ExpiredVerificationEmailTokenError } from '@domain/authorization/applications/errors/expired-verification-email-token.error'
import { InvalidVerificationEmailTokenError } from '@domain/authorization/applications/errors/invalid-verification-email-token.error'
import { UserAlreadyVerificationEmailError } from '@domain/authorization/applications/errors/user-already-verification-email.error'
import { VerifyEmailUseCase } from '@domain/authorization/applications/use-cases/verify-email.use-case'

@Public()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class VerifyEmailController {
  constructor(private verifyEmail: VerifyEmailUseCase) {}

  @Post('/verify-email')
  @HttpCode(200)
  @SwaggerVerifyEmailDto()
  async handle(@Query() query: VerifyEmailQueryDto) {
    const { token } = query

    const result = await this.verifyEmail.execute({
      token: new UniqueEntityID(token),
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidVerificationEmailTokenError:
          throw new ConflictException(error.message, {
            description: error.name,
          })

        case UserAlreadyVerificationEmailError:
          throw new BadRequestException(error.message, {
            description: error.name,
          })

        case ExpiredVerificationEmailTokenError:
          throw new ConflictException(error.message, {
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
      message: 'This email has been verified',
    }
  }
}

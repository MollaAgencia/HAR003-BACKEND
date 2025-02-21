import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import { SessionBodySwaggerDto, SessionSwaggerDto } from '@root/presentations/swagger/session-swagger.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { EmailNotVerifiedError } from '@domain/authorization/applications/errors/email-not-verified.error'
import { WrongCredentialsError } from '@domain/authorization/applications/errors/wrong-credentials.error'
import { AuthorizationUseCase } from '@domain/authorization/applications/use-cases/authorization.use-case'

@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class SessionController {
  constructor(private authorization: AuthorizationUseCase) {}

  @Public()
  @Post('/session')
  @HttpCode(200)
  @SessionSwaggerDto()
  async handle(@Body() body: SessionBodySwaggerDto) {
    const { email, password } = body
    console.log(body)
    const result = await this.authorization.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case EmailNotVerifiedError:
          throw new BadRequestException(error.message, {
            description: error.name,
          })

        case InactiveResourceError:
          throw new UnauthorizedException(error.message, {
            description: error.name,
          })

        case EmailBadFormattedError:
          throw new BadRequestException(error.message, {
            description: error.name,
          })

        case WrongCredentialsError:
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
      accessToken: result.value.accessToken,
    }
  }
}

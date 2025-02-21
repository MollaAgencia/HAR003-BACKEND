import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Patch,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import {
  NewPasswordBodySwaggerDto,
  NewPasswordQueryDto,
  NewPasswordSwaggerDto,
} from '@root/presentations/swagger/new-password-swagger.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'

import { ExpiredPasswordResetTokenError } from '@domain/authorization/applications/errors/expired-password-reset-token.error'
import { InvalidPasswordResetTokenError } from '@domain/authorization/applications/errors/invalid-password-reset-token.error'
import { NewPasswordUseCase } from '@domain/authorization/applications/use-cases/new-password.use-case'

@Public()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class NewPasswordController {
  constructor(private newPassword: NewPasswordUseCase) {}

  @Patch('/new-password')
  @HttpCode(200)
  @NewPasswordSwaggerDto()
  async handle(@Body() body: NewPasswordBodySwaggerDto, @Query() query: NewPasswordQueryDto) {
    const { token } = query
    const { newPassword } = body

    const result = await this.newPassword.execute({
      newPassword,
      token: new UniqueEntityID(token),
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InvalidPasswordResetTokenError:
          throw new ConflictException(error.message, {
            description: error.name,
          })

        case ExpiredPasswordResetTokenError:
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
      message: 'Password successfully updated',
    }
  }
}

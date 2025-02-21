import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import {
  RegisterUserBodySwaggerDto,
  RegisterUserSwaggerDto,
} from '@root/presentations/swagger/register-user-swagger.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceAlreadyExistsError } from '@core/errors/errors/resource-already-exists-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { RegisterUserUseCase } from '@domain/authorization/applications/use-cases/register-user.use-case'

@Public()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post('/sign-up')
  @HttpCode(201)
  @RegisterUserSwaggerDto()
  async handle(@Body() body: RegisterUserBodySwaggerDto) {
    const { email, password, document, telephone } = body

    const result = await this.registerUser.execute({
      email,
      password,
      document,
      telephone,
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

        case ResourceAlreadyExistsError:
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
      message: 'User successfully registered',
    }
  }
}

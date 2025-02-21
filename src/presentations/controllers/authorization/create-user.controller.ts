import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { CreateUserUseCase } from '@root/domain/authorization/applications/use-cases/create-user.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { CreateUserBodyDto, SwaggerCreateUserDto } from '@root/presentations/swagger/create-user.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'

@ApiTags('User')
@ApiBearerAuth()
@Controller({ path: '/user', version: '1' })
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post('/create')
  @HttpCode(201)
  @SwaggerCreateUserDto()
  async handle(@CurrentUser() user: UserPayload, @Body() body: CreateUserBodyDto) {
    const { sub } = user
    const { email, name, role, telephone, document, distributorId, salesChannel, region } = body

    const result = await this.createUser.execute({
      email,
      name,
      role,
      telephone,
      document,
      sub: new UniqueEntityID(sub),
      distributorId: distributorId,
      salesChannel: salesChannel,
      region: region,
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
      message: 'User successfully created',
    }
  }
}

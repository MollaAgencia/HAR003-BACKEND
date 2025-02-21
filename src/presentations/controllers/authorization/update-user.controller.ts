import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { UpdateUserUseCase } from '@root/domain/authorization/applications/use-cases/update-user.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { SwaggerUpdateUserDto, UpdateUserBodyDto } from '@root/presentations/swagger/update-user.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'

@ApiTags('User')
@ApiBearerAuth()
@Controller({ path: '/user', version: '1' })
export class UpdateUserController {
  constructor(private updateUser: UpdateUserUseCase) {}

  @Put('/update')
  @HttpCode(201)
  @SwaggerUpdateUserDto()
  async handle(@CurrentUser() user: UserPayload, @Body() body: UpdateUserBodyDto) {
    const { sub } = user
    const { id, email, name, role, telephone, document, distributorId, salesChannel, region } = body
    const result = await this.updateUser.execute({
      email,
      name,
      role,
      telephone,
      document,
      userId: new UniqueEntityID(id),
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
      message: 'User successfully updated',
    }
  }
}

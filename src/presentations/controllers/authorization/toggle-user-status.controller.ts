import { BadRequestException, Controller, HttpCode, NotFoundException, Param, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { ToggleUserStatusUseCase } from '@root/domain/authorization/applications/use-cases/toggle-user-status.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { SwaggerToggleUserStatusDto } from '@root/presentations/swagger/toggle-status-user.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'

@ApiTags('User')
@ApiBearerAuth()
@Controller({ path: '/user', version: '1' })
export class ToggleUserStatusController {
  constructor(private toggleUserStatus: ToggleUserStatusUseCase) {}

  @Patch('/toggle-status/:id')
  @HttpCode(201)
  @SwaggerToggleUserStatusDto()
  @ApiParam({ name: 'id', description: 'ID of the user to activate or inactivate', type: String })
  async handle(@CurrentUser() user: UserPayload, @Param('id') userId: string) {
    const { sub } = user
    const result = await this.toggleUserStatus.execute({
      sub: new UniqueEntityID(sub),
      userId: new UniqueEntityID(userId),
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
      message: 'User status successfully toggled',
    }
  }
}

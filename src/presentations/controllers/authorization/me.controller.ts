import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { MeSwaggerDto } from '@root/presentations/swagger/me-swagger.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { FindUserUseCase } from '@domain/authorization/applications/use-cases/find-user.use-case'

import { UserViewModel } from '../../view-model/user.view-model'

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller({ version: '1' })
export class MeController {
  constructor(private findUser: FindUserUseCase) {}

  @Get('/me')
  @HttpCode(200)
  @MeSwaggerDto()
  async handle(@CurrentUser() user: UserPayload) {
    const { embed } = user
    const result = await this.findUser.execute({
      id: new UniqueEntityID(embed),
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
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

    return UserViewModel.toHttp(result.value)
  }
}

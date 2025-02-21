import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import {
  SwaggerSwitchEmbedUserDto,
  SwitchEmbedUserBodySwaggerDto,
} from '@root/presentations/swagger/switch-embed-user-swagger.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { NotAllowedError } from '@core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { SwitchEmbedUserUseCase } from '@domain/authorization/applications/use-cases/switch-embed-user.use-case'

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller({ path: '/auth', version: '1' })
export class SwitchChoseUserController {
  constructor(private switchEmbedUser: SwitchEmbedUserUseCase) {}

  @Post('/switch-chose-user')
  @HttpCode(200)
  @SwaggerSwitchEmbedUserDto()
  async handle(@CurrentUser() user: UserPayload, @Body() body: SwitchEmbedUserBodySwaggerDto) {
    const { sub } = user
    const { embedId } = body

    const result = await this.switchEmbedUser.execute({
      userId: new UniqueEntityID(sub),
      embedUserId: new UniqueEntityID(embedId),
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message, {
            description: error.name,
          })

        case ResourceNotFoundError:
          throw new NotFoundException(error.message, {
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

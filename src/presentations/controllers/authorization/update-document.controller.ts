import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { UpdateDocumentUseCase } from '@root/domain/authorization/applications/use-cases/update-document.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { SwaggerUpdateDocumentDto, UpdateDocumentBodyDto } from '@root/presentations/swagger/update-document.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('User')
@ApiBearerAuth()
@Controller({ path: '/user', version: '1' })
export class UpdateDocumentController {
  constructor(private updateUser: UpdateDocumentUseCase) {}

  @Put('/update/document')
  @HttpCode(201)
  @SwaggerUpdateDocumentDto()
  async handle(@CurrentUser() user: UserPayload, @Body() body: UpdateDocumentBodyDto) {
    const { sub } = user
    const { document } = body
    const result = await this.updateUser.execute({
      document,
      sub: new UniqueEntityID(sub),
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
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

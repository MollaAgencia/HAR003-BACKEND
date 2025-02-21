import { BadRequestException, Controller, Get, HttpCode, NotFoundException } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetAccumulatedAwardUseCase } from '@root/domain/award/applications/use-cases/award-accumulated.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { SwaggerFindCurrentAwardDto } from '@root/presentations/swagger/find-current-award.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('Award')
@ApiBearerAuth()
@Controller({ path: '/awards/accumulated', version: '1' })
export class FindAccumulatedAwardController {
  constructor(private getAccumulatedAward: GetAccumulatedAwardUseCase) {}

  @Get()
  @HttpCode(200)
  @SwaggerFindCurrentAwardDto()
  async handle(@CurrentUser() user: UserPayload) {
    const { embed } = user

    const result = await this.getAccumulatedAward.execute({
      userId: new UniqueEntityID(embed),
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
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

    return { amount: result.value }
  }
}

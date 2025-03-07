import { BadRequestException, Controller, Get, HttpCode, NotFoundException } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetCurrentManagerRankingUseCase } from '@root/domain/ranking/applications/use-cases/get-current-manager-ranking.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { SwaggerGetCurrentRankingManagerDto } from '@root/presentations/swagger/find-current-ranking-manager.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('Ranking')
@ApiBearerAuth()
@Controller({ version: '1' })
export class FindCurrentRankingManagerController {
  constructor(private getCurrentRankingsManager: GetCurrentManagerRankingUseCase) {}

  @Get('/rankings/manager/current')
  @HttpCode(200)
  @SwaggerGetCurrentRankingManagerDto()
  async handle(@CurrentUser() user: UserPayload) {
    const { embed } = user

    const result = await this.getCurrentRankingsManager.execute({
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

    return { position: result.value.position }
  }
}

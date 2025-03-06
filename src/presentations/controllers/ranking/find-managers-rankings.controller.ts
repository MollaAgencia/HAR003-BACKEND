import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetManagerRankingsUseCase } from '@root/domain/ranking/applications/use-cases/get-manager-rankings.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('Ranking')
@ApiBearerAuth()
@Controller({ version: '1' })
export class FindRankingsManagerController {
  constructor(private getRankingsManager: GetManagerRankingsUseCase) {}

  @Get('/rankings/manager')
  @HttpCode(200)
  @SwaggerGetRankingsManagerDto()
  async handle(@CurrentUser() user: UserPayload, @Query() query: GetRankingsQueryDto) {
    const { period } = query
    const { embed } = user

    const result = await this.getRankingsManager.execute({
      userId: new UniqueEntityID(embed),
      period,
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

    return result.value.map(RankingDetailsViewModel.toHttp)
  }
}

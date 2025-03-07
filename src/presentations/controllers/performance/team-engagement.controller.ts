import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetTeamEngagementUseCase } from '@root/domain/performance/applications/use-cases/team-engagement.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import {
  FindTeamEngagement,
  FindTeamEngagementQuerySwaggerDto,
} from '@root/presentations/swagger/find-team-engagement-details.dto'
import { TeamEngagementViewModel } from '@root/presentations/view-model/team-engagement.view-model'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('Performance')
@ApiBearerAuth()
@Controller({ path: '/performance', version: '1' })
export class TeamEngagementController {
  constructor(private teamEngagement: GetTeamEngagementUseCase) {}

  @Get('/team-engagement')
  @HttpCode(200)
  @FindTeamEngagement()
  async handle(@CurrentUser() user: UserPayload, @Query() query: FindTeamEngagementQuerySwaggerDto) {
    const { embed } = user
    const { userId, referenceType } = query
    let period = [query.period]

    if (referenceType === 'BIMONTHLY') {
      const availableMonths: Record<number, Array<number>> = {
        1: [1, 2],
        2: [3, 4],
        3: [5, 6],
        4: [7, 8],
      }

      period = availableMonths[period[0]]
    }

    const result = await this.teamEngagement.execute({
      userId: userId ? new UniqueEntityID(userId) : null,
      embedUserId: new UniqueEntityID(embed),
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

    return result.value.map(TeamEngagementViewModel.toHttp)
  }
}

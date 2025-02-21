import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetPerformanceGroupUseCase } from '@root/domain/performance/applications/use-cases/get-group.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { FindPerformanceParamsSwaggerDto } from '@root/presentations/swagger/find-performance-details.dto'
import { SwaggerFindPerformanceGroupDto } from '@root/presentations/swagger/find-performance-group-award.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('Performance')
@ApiBearerAuth()
@Controller({ path: '/performance', version: '1' })
export class FindPerformanceGroupController {
  constructor(private getGroup: GetPerformanceGroupUseCase) {}

  @Get('/group')
  @HttpCode(200)
  @SwaggerFindPerformanceGroupDto()
  async handle(@CurrentUser() user: UserPayload, @Query() query: FindPerformanceParamsSwaggerDto) {
    const { embed } = user
    const { period } = query

    const result = await this.getGroup.execute({
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
    return { group: result.value }
  }
}

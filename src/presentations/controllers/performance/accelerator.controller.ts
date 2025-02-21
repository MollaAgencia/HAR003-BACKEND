import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetAcceleratorPerformanceUseCase } from '@root/domain/performance/applications/use-cases/accelerator.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { FindAcceleratorPerformanceDetails } from '@root/presentations/swagger/find-accelerator-details.dto'
import { FindPerformanceParamsSwaggerDto } from '@root/presentations/swagger/find-performance-details.dto'
import { AcceleratorPerformanceViewModel } from '@root/presentations/view-model/accelerator-performance.view-model'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('Performance')
@ApiBearerAuth()
@Controller({ path: '/performance', version: '1' })
export class AcceleratorPerformanceController {
  constructor(private bimonthlyPerformance: GetAcceleratorPerformanceUseCase) {}

  @Get('/accelerator')
  @HttpCode(200)
  @FindAcceleratorPerformanceDetails()
  async handle(@CurrentUser() user: UserPayload, @Query() query: FindPerformanceParamsSwaggerDto) {
    const { embed } = user
    const { period } = query

    const result = await this.bimonthlyPerformance.execute({
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

    return AcceleratorPerformanceViewModel.toHttp(result.value)
  }
}

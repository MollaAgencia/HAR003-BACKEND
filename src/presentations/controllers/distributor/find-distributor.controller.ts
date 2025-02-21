import { BadRequestException, Controller, Get, HttpCode, NotFoundException } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FindDistributorsUseCase } from '@root/domain/distributor/applications/use-cases/find-distributors.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { SwaggerFindDistributorsDto } from '@root/presentations/swagger/find-distributors.dto'
import { DistributorViewModel } from '@root/presentations/view-model/distributor.view-model'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

@ApiTags('Distributor')
@ApiBearerAuth()
@Controller({ path: '/distributors', version: '1' })
export class FindDistributorsController {
  constructor(private findDitributors: FindDistributorsUseCase) {}

  @Get()
  @HttpCode(200)
  @SwaggerFindDistributorsDto()
  async handle(@CurrentUser() user: UserPayload) {
    const { embed } = user

    const result = await this.findDitributors.execute({
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
    return { results: result.value.map(DistributorViewModel.toHttp) }
  }
}

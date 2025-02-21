import { BadRequestException, Controller, Get, HttpCode, Query, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FindUsersForManagementUseCase } from '@root/domain/authorization/applications/use-cases/find-users-for-management.use-case'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import {
  SwaggerFindUsersForManagementDto,
  QueryUserForManagementDto,
} from '@root/presentations/swagger/find-users-for-management.dto'
import { UserForManagementViewModel } from '@root/presentations/view-model/user-for-management.view-model'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { NotAllowedError } from '@core/errors/errors/not-allowed-error'

@ApiTags('User')
@ApiBearerAuth()
@Controller({ path: '/users', version: '1' })
export class FindUsersForManagementController {
  constructor(private findUsersForManagementd: FindUsersForManagementUseCase) {}

  @Get('/management')
  @HttpCode(200)
  @SwaggerFindUsersForManagementDto()
  async handle(@CurrentUser() user: UserPayload, @Query() data: QueryUserForManagementDto) {
    const { sub } = user
    const { pageIndex, status, name, document } = data
    const result = await this.findUsersForManagementd.execute({
      userId: new UniqueEntityID(sub),
      pageIndex,
      name,
      status,
      document,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message, {
            description: error.name,
          })

        default:
          throw new BadRequestException('Bad request', {
            description: 'BadRequestError',
          })
      }
    }
    return {
      results: result.value.results.map(UserForManagementViewModel.toHttp),
      meta: {
        pageIndex: result.value.meta.pageIndex,
        perPage: result.value.meta.perPage,
        totalCount: result.value.meta.totalCount,
      },
    }
  }
}

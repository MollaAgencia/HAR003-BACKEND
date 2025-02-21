import { BadRequestException, Controller, Get, HttpCode, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { FindUsersForIncorporateSwaggerDto } from '@root/presentations/swagger/find-users-for-incorporate.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { NotAllowedError } from '@core/errors/errors/not-allowed-error'

import { FindUsersForIncorporateUseCase } from '@domain/authorization/applications/use-cases/find-users-for-incorporate.use-case'

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller({ path: '/auth', version: '1' })
export class FindUsersForIncorporateController {
  constructor(private findUsersForIncorporated: FindUsersForIncorporateUseCase) {}

  @Get('/incorporate')
  @HttpCode(200)
  @FindUsersForIncorporateSwaggerDto()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.findUsersForIncorporated.execute({
      userId: new UniqueEntityID(sub),
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
      results: result.value.map((user) => ({
        id: user.id.toValue(),
        name: user.name,
        role: user.role,
      })),
    }
  }
}

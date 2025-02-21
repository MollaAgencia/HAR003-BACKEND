import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@root/presentations/auth/public'
import {
  CheckUserDetailsQueryDto,
  CheckUserDetailsSwaggerDto,
} from '@root/presentations/swagger/check-user-details-swagger.dto'

import { InactiveResourceError } from '@core/errors/errors/inactive-resource-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { CheckUserDetailsUseCase } from '@domain/authorization/applications/use-cases/check-user-details.use-case'

@Public()
@ApiTags('Authorization')
@Controller({ path: '/auth', version: '1' })
export class CheckUserDetailsController {
  constructor(private checkUserDetails: CheckUserDetailsUseCase) {}

  @Get('/check-details')
  @HttpCode(200)
  @CheckUserDetailsSwaggerDto()
  async handle(@Query() query: CheckUserDetailsQueryDto) {
    const { email } = query

    const result = await this.checkUserDetails.execute({ email })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message, {
            description: error.name,
          })

        case InactiveResourceError:
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
      firstAccess: result.value.firstAccess,
    }
  }
}

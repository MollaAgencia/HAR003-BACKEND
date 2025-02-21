import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
import { UserPayload } from '@root/presentations/auth/jwt.strategy'
import { CreateLogAccessBodyDto, CreateLogAccessSwaggerDto } from '@root/presentations/swagger/register-log-access.dto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { CreateLogAccessUseCase } from '@domain/log-access/applications/use-cases/create-log-access.use-case'

@ApiTags('Log Access')
@ApiBearerAuth()
@Controller({ path: 'log-access-page', version: '1' })
export class RegisterLogAccessController {
  constructor(private readonly createLogAccessUseCase: CreateLogAccessUseCase) {}

  @CreateLogAccessSwaggerDto()
  @HttpCode(201)
  @Post()
  async handle(@CurrentUser() user: UserPayload, @Body() body: CreateLogAccessBodyDto) {
    const { page } = body
    await this.createLogAccessUseCase.execute({ page, userId: new UniqueEntityID(user.sub) })
    return {
      message: 'Success in creating access',
    }
  }
}

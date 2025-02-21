import { Module } from '@nestjs/common'
import { MailUseCaseModule } from '@root/domain/mailer/applications/use-cases/mail-use-cases.module'
import { DatabaseModule } from '@root/infra/database/database.module'

import { GetAccumulatedAwardUseCase } from './award-accumulated.use-case'

@Module({
  imports: [DatabaseModule, MailUseCaseModule],
  providers: [GetAccumulatedAwardUseCase],
  exports: [GetAccumulatedAwardUseCase],
})
export class AwardUseCaseModule {}

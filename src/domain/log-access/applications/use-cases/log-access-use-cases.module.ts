import { Module } from '@nestjs/common'

import { DatabaseModule } from '@infra/database/database.module'

import { CreateLogAccessUseCase } from './create-log-access.use-case'

@Module({
  imports: [DatabaseModule],
  providers: [CreateLogAccessUseCase],
  exports: [CreateLogAccessUseCase],
})
export class LogAccessUseCasesModule {}

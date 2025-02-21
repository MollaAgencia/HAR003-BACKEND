import { Module } from '@nestjs/common'
import { DatabaseModule } from '@root/infra/database/database.module'
import { EnvModule } from '@root/infra/env/env.module'

import { FindDistributorsUseCase } from './find-distributors.use-case'

@Module({
  imports: [DatabaseModule, EnvModule],
  providers: [FindDistributorsUseCase],
  exports: [FindDistributorsUseCase],
})
export class DistributorUseCaseModule {}

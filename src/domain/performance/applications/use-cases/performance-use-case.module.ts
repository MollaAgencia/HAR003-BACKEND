import { Module } from '@nestjs/common'
import { MailUseCaseModule } from '@root/domain/mailer/applications/use-cases/mail-use-cases.module'
import { DatabaseModule } from '@root/infra/database/database.module'
import { EnvModule } from '@root/infra/env/env.module'

import { GetAcceleratorPerformanceUseCase } from './accelerator.use-case'
import { GetBimonthlyPerformanceUseCase } from './bimonthly-performance.use-case'
import { GetPerformanceGroupUseCase } from './get-group.use-case'
import { GetSemiannuallyPerformanceUseCase } from './semiannual-performance.use-case'
import { GetTeamEngagementUseCase } from './team-engagement.use-case'

@Module({
  imports: [DatabaseModule, EnvModule, MailUseCaseModule],
  providers: [
    GetSemiannuallyPerformanceUseCase,
    GetAcceleratorPerformanceUseCase,
    GetBimonthlyPerformanceUseCase,
    GetPerformanceGroupUseCase,
    GetTeamEngagementUseCase,
  ],
  exports: [
    GetSemiannuallyPerformanceUseCase,
    GetAcceleratorPerformanceUseCase,
    GetBimonthlyPerformanceUseCase,
    GetPerformanceGroupUseCase,
    GetTeamEngagementUseCase,
  ],
})
export class PerformanceUseCaseModule {}

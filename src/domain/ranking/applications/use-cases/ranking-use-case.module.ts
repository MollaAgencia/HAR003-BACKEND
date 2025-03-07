import { Module } from '@nestjs/common'
import { MailUseCaseModule } from '@root/domain/mailer/applications/use-cases/mail-use-cases.module'
import { DatabaseModule } from '@root/infra/database/database.module'
import { EnvModule } from '@root/infra/env/env.module'

import { GetCurrentManagerRankingUseCase } from './get-current-manager-ranking.use-case'
import { GetManagerRankingsUseCase } from './get-manager-rankings.use-case'

@Module({
  imports: [DatabaseModule, MailUseCaseModule, EnvModule],
  providers: [GetCurrentManagerRankingUseCase, GetManagerRankingsUseCase],
  exports: [GetCurrentManagerRankingUseCase, GetManagerRankingsUseCase],
})
export class ManagerRankingUseCasesModule {}

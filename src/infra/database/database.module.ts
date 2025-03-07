import { Module } from '@nestjs/common'
import { UsersRepository } from '@root/domain/authorization/applications/repositories/users.repository'
import { AwardRepository } from '@root/domain/award/applications/repositories/award.repositories'
import { DistributorRepository } from '@root/domain/distributor/applications/repositories/distributor.repository'
import { LogAccessRepository } from '@root/domain/log-access/applications/repositories/log-access.repository'
import { PerformanceRepository } from '@root/domain/performance/applications/repositories/performance.repositories'
import { ManagerRankingRepository } from '@root/domain/ranking/applications/repositories/manager-ranking.repositories'

import { TokensRepository } from '@domain/authorization/applications/repositories/tokens.repository'
import { MailRepository } from '@domain/mailer/applications/repositories/mail.repository'

import { PrismaLogAccessRepository } from '@infra/database/repositories/prisma-log-access.repository'
import { PrismaMailRepository } from '@infra/database/repositories/prisma-log-mailer.repository'
import { EnvModule } from '@infra/env/env.module'

import { PrismaService } from './prisma.service'
import { PrismaAwardRepository } from './repositories/award/prisma-award.repository'
import { PrismaDistributorRepository } from './repositories/distributor/prisma-distributor.repository'
import { PrismaPerformanceRepository } from './repositories/performance/prisma-performance.repository'
import { PrismaTokensRepository } from './repositories/prisma-tokens.repository'
import { PrismaUsersRepository } from './repositories/prisma-users.repository'
import { PrismaManagerRankingRepository } from './repositories/ranking/prisma-ranking-repository'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    { provide: TokensRepository, useClass: PrismaTokensRepository },
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: LogAccessRepository, useClass: PrismaLogAccessRepository },
    { provide: MailRepository, useClass: PrismaMailRepository },
    { provide: PerformanceRepository, useClass: PrismaPerformanceRepository },
    { provide: AwardRepository, useClass: PrismaAwardRepository },
    { provide: DistributorRepository, useClass: PrismaDistributorRepository },
    { provide: ManagerRankingRepository, useClass: PrismaManagerRankingRepository },
  ],
  exports: [
    PrismaService,
    LogAccessRepository,
    TokensRepository,
    UsersRepository,
    MailRepository,
    PerformanceRepository,
    AwardRepository,
    DistributorRepository,
    ManagerRankingRepository,
  ],
})
export class DatabaseModule {}

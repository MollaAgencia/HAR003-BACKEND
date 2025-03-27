import { Module } from '@nestjs/common'
import { AwardUseCaseModule } from '@root/domain/award/applications/use-cases/award-use-case.module'
import { DistributorUseCaseModule } from '@root/domain/distributor/applications/use-cases/distributor-use-cases.module'
import { PerformanceUseCaseModule } from '@root/domain/performance/applications/use-cases/performance-use-case.module'
import { ManagerRankingUseCasesModule } from '@root/domain/ranking/applications/use-cases/ranking-use-case.module'
import { HealthzController } from '@root/presentations/healthz/healthz.controller'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'

import { AuthorizationUseCasesModule } from '@domain/authorization/applications/use-cases/authorization-use-cases.module'
import { LogAccessUseCasesModule } from '@domain/log-access/applications/use-cases/log-access-use-cases.module'
import { MailUseCaseModule } from '@domain/mailer/applications/use-cases/mail-use-cases.module'

import { CheckUserDetailsController } from './controllers/authorization/check-user-details.controller'
import { CreateUserController } from './controllers/authorization/create-user.controller'
import { FindUsersForIncorporateController } from './controllers/authorization/find-users-for-incorporate.controller'
import { FindUsersForManagementController } from './controllers/authorization/find-users-for-management.controller'
import { ForgotPasswordController } from './controllers/authorization/forgot-password.controller'
import { MeController } from './controllers/authorization/me.controller'
import { NewPasswordController } from './controllers/authorization/new-password.controller'
import { RegisterUserController } from './controllers/authorization/register-user.controller'
import { SendVerificationEmailTokenController } from './controllers/authorization/send-verification-email-token.controller'
import { SessionController } from './controllers/authorization/session.controller'
import { SwitchChoseUserController } from './controllers/authorization/switch-chose-user.controller'
import { ToggleUserStatusController } from './controllers/authorization/toggle-user-status.controller'
import { UpdateDocumentController } from './controllers/authorization/update-document.controller'
import { UpdateUserController } from './controllers/authorization/update-user.controller'
import { VerifyEmailController } from './controllers/authorization/verify-email.controller'
import { FindAccumulatedAwardController } from './controllers/award/find-accumulated-award.controller'
import { FindDistributorsController } from './controllers/distributor/find-distributor.controller'
import { AcceleratorPerformanceController } from './controllers/performance/accelerator.controller'
import { BimonthlyPerformanceController } from './controllers/performance/bimonthly.controller'
import { FindPerformanceGroupController } from './controllers/performance/find-group.controller'
import { SemiannualPerformanceController } from './controllers/performance/semiannual.controller'
import { TeamEngagementController } from './controllers/performance/team-engagement.controller'
import { FindCurrentRankingManagerController } from './controllers/ranking/find-current-manager-ranking.controller'
import { FindRankingsManagerController } from './controllers/ranking/find-managers-rankings.controller'
import { RegisterLogAccessController } from './controllers/register-log-access.controller'
import { SacController } from './controllers/sac.controller'

@Module({
  imports: [
    AuthorizationUseCasesModule,
    LogAccessUseCasesModule,
    MailUseCaseModule,
    PerformanceUseCaseModule,
    AwardUseCaseModule,
    DistributorUseCaseModule,
    ManagerRankingUseCasesModule,
    PrometheusModule.register(),
  ],
  controllers: [
    SessionController,
    CheckUserDetailsController,
    MeController,
    FindUsersForIncorporateController,
    ForgotPasswordController,
    NewPasswordController,
    RegisterUserController,
    SendVerificationEmailTokenController,
    SwitchChoseUserController,
    VerifyEmailController,
    SacController,
    RegisterLogAccessController,
    BimonthlyPerformanceController,
    FindAccumulatedAwardController,
    FindPerformanceGroupController,
    AcceleratorPerformanceController,
    FindDistributorsController,
    HealthzController,
    FindUsersForManagementController,
    CreateUserController,
    UpdateUserController,
    ToggleUserStatusController,
    TeamEngagementController,
    SemiannualPerformanceController,
    FindCurrentRankingManagerController,
    FindRankingsManagerController,
    UpdateDocumentController,
  ],
})
export class PresentationsModule {}

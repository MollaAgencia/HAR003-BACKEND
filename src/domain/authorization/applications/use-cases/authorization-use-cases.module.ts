import { Module } from '@nestjs/common'
import { DatabaseModule } from '@root/infra/database/database.module'

import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { EnvModule } from '@infra/env/env.module'

import { AuthorizationUseCase } from './authorization.use-case'
import { CheckUserDetailsUseCase } from './check-user-details.use-case'
import { CreateUserUseCase } from './create-user.use-case'
import { FindUserUseCase } from './find-user.use-case'
import { FindUsersForIncorporateUseCase } from './find-users-for-incorporate.use-case'
import { FindUsersForManagementUseCase } from './find-users-for-management.use-case'
import { ForgotPasswordUseCase } from './forgot-password.use-case'
import { NewPasswordUseCase } from './new-password.use-case'
import { RegisterUserUseCase } from './register-user.use-case'
import { SendVerificationEmailTokenUseCase } from './send-verification-email-token.use-case'
import { SwitchEmbedUserUseCase } from './switch-embed-user.use-case'
import { UpdateUserUseCase } from './update-user.use-case'
import { VerifyEmailUseCase } from './verify-email.use-case'
import { ToggleUserStatusUseCase } from './toggle-user-status.use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  providers: [
    AuthorizationUseCase,
    CheckUserDetailsUseCase,
    FindUserUseCase,
    FindUsersForIncorporateUseCase,
    ForgotPasswordUseCase,
    NewPasswordUseCase,
    RegisterUserUseCase,
    SendVerificationEmailTokenUseCase,
    SwitchEmbedUserUseCase,
    VerifyEmailUseCase,
    UpdateUserUseCase,
    CreateUserUseCase,
    FindUsersForManagementUseCase,
    ToggleUserStatusUseCase,
  ],
  exports: [
    AuthorizationUseCase,
    CheckUserDetailsUseCase,
    FindUserUseCase,
    FindUsersForIncorporateUseCase,
    ForgotPasswordUseCase,
    NewPasswordUseCase,
    RegisterUserUseCase,
    SendVerificationEmailTokenUseCase,
    SwitchEmbedUserUseCase,
    VerifyEmailUseCase,
    UpdateUserUseCase,
    CreateUserUseCase,
    FindUsersForManagementUseCase,
    ToggleUserStatusUseCase,
  ],
})
export class AuthorizationUseCasesModule {}

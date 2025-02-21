import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { envSchema } from '@root/infra/env/env'
import { EnvModule } from '@root/infra/env/env.module'
import { AuthModule } from '@root/presentations/auth/auth.module'
import { PresentationsModule } from '@root/presentations/presentations.module'

import { InfraModule } from './infra/infra.module'

@Module({
  imports: [
    AuthModule,
    InfraModule,
    PresentationsModule,
    EnvModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common'

import { CronModule } from '@infra/cron/cron.module'
import { EventsModule } from '@infra/events/events.module'

@Module({
  imports: [CronModule, EventsModule],
})
export class InfraModule {}

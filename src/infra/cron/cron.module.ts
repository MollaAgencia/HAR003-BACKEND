import { Module } from '@nestjs/common'

import { RankingMerchandisingCron } from '@infra/cron/ranking-merchandising.cron'

@Module({
  providers: [RankingMerchandisingCron],
})
export class CronModule {}

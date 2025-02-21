import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class RankingMerchandisingCron {
  private readonly logger = new Logger(RankingMerchandisingCron.name)

  @Cron(CronExpression.EVERY_10_HOURS, {
    timeZone: 'America/Sao_Paulo',
  })
  handleCron() {
    this.logger.debug('Called when the current time is 10 hours')
  }
}

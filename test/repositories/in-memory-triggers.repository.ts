import {
  GetTriggersProps,
  TriggerRepository,
} from '@root/domain/performance/applications/repositories/trigger.repositories'
import { Trigger } from '@root/domain/performance/enterprise/entities/trigger.entity'

export class InMemoryTriggersRepository implements TriggerRepository {
  public triggers: Array<Trigger> = []
  async getTriggers(data: GetTriggersProps): Promise<Array<Trigger>> {
    const { type, userId, referenceType } = data

    const triggers = this.triggers.filter(
      (trigger) => trigger.type === type && trigger.userId.equals(userId) && referenceType === trigger.referenceType,
    )

    if (!triggers) return null

    return triggers
  }
}

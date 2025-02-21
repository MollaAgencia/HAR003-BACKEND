import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { Mail } from '@domain/mailer/enterprise/entities/mail'

export abstract class MailRepository {
  abstract create(log: Mail): Promise<void>
  abstract findById(id: UniqueEntityID): AsyncMaybe<Mail>
  abstract save(log: Mail): Promise<void>
}

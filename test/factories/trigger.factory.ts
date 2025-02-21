import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Optional } from '@root/core/logic/Optional'
import {
  Trigger,
  TriggerGroup,
  TriggerProps,
  TriggerStatus,
  TriggerType,
} from '@root/domain/performance/enterprise/entities/trigger.entity'

type Overrides = Partial<TriggerProps>

export function makeFakeTrigger(data = {} as Overrides) {
  const userId = new UniqueEntityID()
  const name = faker.company.bs()
  const goal = faker.number.int({ min: 1000, max: 100000 })
  const real = faker.number.int({ min: 0, max: 100000 })
  const coverage = faker.number.float({ min: 0, max: 1 })
  const type = faker.helpers.arrayElement(Object.values(TriggerType))
  const referenceType = faker.number.int({ min: 1, max: 12 })
  const group = faker.helpers.arrayElement(Object.values(TriggerGroup))
  const status = faker.helpers.arrayElement(Object.values(TriggerStatus))
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: Optional<TriggerProps, 'updatedAt'> = {
    userId: data.userId || userId,
    name: data.name || name,
    goal: data.goal || goal,
    real: data.real || real,
    coverage: data.coverage || coverage,
    type: data.type || type,
    referenceType: data.referenceType || referenceType,
    group: data.group || group,
    status: data.status || status,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const trigger = Trigger.create(props)

  return trigger
}

import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Optional } from '@root/core/logic/Optional'
import { Kpi, KpiGroup, KpiProps, KpiStatus, KpiType } from '@root/domain/performance/enterprise/entities/kpi.entity'

type Overrides = Partial<KpiProps>

export function makeFakeKpi(data = {} as Overrides) {
  const userId = new UniqueEntityID()
  const name = faker.company.bs()
  const goal = faker.number.int({ min: 1000, max: 100000 })
  const real = faker.number.int({ min: 0, max: 100000 })
  const coverage = faker.number.float({ min: 0, max: 1 })
  const type = faker.helpers.arrayElement(Object.values(KpiType))
  const referenceType = faker.number.int({ min: 1, max: 12 })
  const group = faker.helpers.arrayElement(Object.values(KpiGroup))
  const status = faker.helpers.arrayElement(Object.values(KpiStatus))
  const points = faker.number.int({ min: 0, max: 1000 })
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: Optional<KpiProps, 'updatedAt'> = {
    userId: data.userId || userId,
    name: data.name || name,
    goal: data.goal || goal,
    real: data.real || real,
    coverage: data.coverage || coverage,
    type: data.type || type,
    referenceType: data.referenceType || referenceType,
    group: data.group || group,
    status: data.status || status,
    points: data.points || points,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const kpi = Kpi.create(props)

  return kpi
}

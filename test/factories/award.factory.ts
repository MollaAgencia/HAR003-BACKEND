import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Optional } from '@root/core/logic/Optional'
import { Award, AwardProps, AwardsType } from '@root/domain/awards/enterprise/entities/award.entity'

type Overrides = Partial<AwardProps>

export function makeFakeAward(data = {} as Overrides) {
  const userId = new UniqueEntityID()
  const goal = faker.number.float({ min: 0, max: 10000 })
  const real = faker.number.float({ min: 0, max: 10000 })
  const coverage = faker.number.float({ min: 0, max: 100 })
  const type = faker.helpers.arrayElement(Object.values(AwardsType))
  const referenceType = faker.number.int({ min: 1, max: 12 })
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: Optional<AwardProps, 'updatedAt'> = {
    userId: data.userId || userId,
    goal: data.goal || goal,
    real: data.real || real,
    coverage: data.coverage || coverage,
    type: data.type || type,
    referenceType: data.referenceType || referenceType,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const award = Award.create(props)

  return award
}

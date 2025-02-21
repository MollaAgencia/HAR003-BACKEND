import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Optional } from '@root/core/logic/Optional'
import {
  Ranking,
  RankingGroup,
  RankingProps,
  RankingTendency,
  RankingType,
} from '@root/domain/ranking/enterprise/entities/ranking.entity'

type Overrides = Partial<RankingProps>

export function makeFakeRanking(data = {} as Overrides) {
  const userId = new UniqueEntityID()
  const position = faker.number.int({ min: 1, max: 100 })
  const type = faker.helpers.arrayElement(Object.values(RankingType))
  const referenceType = faker.number.int({ min: 1, max: 12 })
  const group = faker.helpers.arrayElement(Object.values(RankingGroup))
  const tendency = faker.helpers.maybe(() => faker.helpers.arrayElement(Object.values(RankingTendency)))
  const score = faker.number.float({ min: 0, max: 1000 })
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: Optional<RankingProps, 'updatedAt'> = {
    userId: data.userId || userId,
    position: data.position || position,
    type: data.type || type,
    referenceType: data.referenceType || referenceType,
    group: data.group || group,
    tendency: data.tendency || tendency,
    score: data.score || score,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const ranking = Ranking.create(props)

  return ranking
}

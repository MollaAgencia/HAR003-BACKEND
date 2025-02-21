import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import {
  VerificationEmailToken,
  VerificationEmailTokenProps,
} from '@domain/authorization/enterprise/entities/verification-email-token.entity'

type Overrides = Partial<VerificationEmailTokenProps>

export function makeFakeVerificationEmailToken(data = {} as Overrides) {
  const email = faker.internet.email()
  const token = new UniqueEntityID()
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: VerificationEmailTokenProps = {
    email: data.email || email,
    token: data.token || token,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  return VerificationEmailToken.create(props)
}

import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { Token, TokenProps } from '@domain/authorization/enterprise/entities/token.entity'

type Overrides = Partial<PasswordResetTokenProps>

export function makeFakePasswordResetToken(data = {} as Overrides) {
  const email = faker.internet.email()
  const token = new UniqueEntityID()
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: PasswordResetTokenProps = {
    email: data.email || email,
    token: data.token || token,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const passwordResetToken = Token.create(props)

  return passwordResetToken
}

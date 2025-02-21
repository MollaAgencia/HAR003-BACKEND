import { faker } from '@faker-js/faker'

import { UniqueTwoFactorTokenId } from '@core/domain/unique-two-factor-token-id'

import { TwoFactorToken, TwoFactorTokenProps } from '@domain/authorization/enterprise/entities/two-factor-token.entity'

type Overrides = Partial<TwoFactorTokenProps>

export function makeFakeTwoFactorToken(data = {} as Overrides) {
  const email = faker.internet.email()
  const code = new UniqueTwoFactorTokenId()
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: TwoFactorTokenProps = {
    email: data.email || email,
    token: data.token || code,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const twoFactorToken = TwoFactorToken.create(props)

  return twoFactorToken
}

import { faker } from '@faker-js/faker'
import { Optional } from '@root/core/logic/Optional'

import { Role, User, UserProps } from '@domain/authorization/enterprise/entities/user.entity'

type Overrides = Partial<UserProps>

export function makeFakeUser(data = {} as Overrides) {
  const name = faker.person.fullName()
  const cpf = faker.number.int({ min: 0, max: 99999999999 }).toString()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: Optional<UserProps, 'disabled'> = {
    name: data.name || name,
    cpf: data.cpf || cpf,
    email: data.email || email,
    password: data.password || password,
    emailVerified: data.emailVerified || null,
    role: data.role || Role.SELLER,
    isTwoFactorEnabled: data.isTwoFactorEnabled || null,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const user = User.create(props)

  return user
}

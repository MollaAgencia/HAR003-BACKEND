import { faker } from '@faker-js/faker'
import { randomInt } from 'node:crypto'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { Address, AddressProps } from '@domain/authorization/enterprise/entities/user-address.entity'

type Overrides = Partial<AddressProps>

export function makeFakeAddress(data = {} as Overrides) {
  const userId = new UniqueEntityID()
  const neighborhood = faker.address.street()
  const street = faker.address.street()
  const number = randomInt(1, 1000).toString()
  const complement = faker.address.secondaryAddress()
  const city = faker.address.city()
  const state = faker.address.state()
  const cep = faker.address.zipCode()
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: AddressProps = {
    userId: data.userId || userId,
    neighborhood: data.neighborhood || neighborhood,
    street: data.street || street,
    number: data.number || number,
    complement: data.complement || complement,
    city: data.city || city,
    state: data.state || state,
    cep: data.cep || cep,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const user = Address.create(props)

  return user
}

import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { Optional } from '@root/core/logic/Optional'

import { PdvEntity, PdvProps } from '@domain/pdvs/enterprise/entities/pdv.entity'

type Overrides = Partial<PdvProps>

export function makeFakePdv(data = {} as Overrides) {
  const userId = new UniqueEntityID()
  const sap = faker.lorem.text()
  const name = faker.company.name()
  const cnpj = faker.number.int({ min: 11111111111111, max: 99999999999999 }).toString()
  const uf = faker.location.state()
  const city = faker.location.city()
  const region = faker.location.county()
  const createdAt = faker.date.past()
  const updatedAt = faker.date.recent()

  const props: Optional<PdvProps, 'updatedAt'> = {
    userId: data.userId || userId,
    sap: data.sap || sap,
    name: data.name || name,
    cnpj: data.cnpj || cnpj,
    uf: data.uf || uf,
    city: data.city || city,
    region: data.region || region,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  }

  const pdv = PdvEntity.create(props)

  return pdv
}

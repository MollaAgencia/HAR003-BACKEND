import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { AsyncMaybe } from '@root/core/logic/Maybe'

import { AddressRepository } from '@domain/authorization/applications/repositories/address.repository'
import { Address } from '@domain/authorization/enterprise/entities/user-address.entity'

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = []

  async create(address: Address): Promise<void> {
    this.items.push(address)
  }

  async findByUserId(id: UniqueEntityID): AsyncMaybe<Address> {
    const address = this.items.find((item) => item.userId.equals(id))
    if (!address) return null
    return address
  }

  async save(address: Address): Promise<void> {
    this.items = this.items.map((item) => (item.id.equals(address.id) ? address : item))
  }
}

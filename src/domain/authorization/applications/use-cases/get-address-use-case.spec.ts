import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { expect } from 'vitest'

import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { makeFakeAddress } from '@test/factories/address.factory'
import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryAddressRepository } from '@test/repositories/in-memory-address.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { GetAddressUseCase } from './get-address.use-case'

describe('Get Address - Use Case', () => {
  let sut: GetAddressUseCase
  let inMemoryUsersRepository: InMemoryUsersRepository
  let inMemoryAddressRepository: InMemoryAddressRepository

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    sut = new GetAddressUseCase(inMemoryUsersRepository, inMemoryAddressRepository)
  })

  it('should be able to find address by user', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.items.push(user)

    const address = makeFakeAddress({ userId: user.id })
    inMemoryAddressRepository.items.push(address)

    const output = await sut.execute({ userId: user.id })

    expect(output.isRight()).toBeTruthy()
    expect(output.value).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          neighborhood: address.neighborhood,
          street: address.street,
          number: address.number,
          complement: address.complement,
          city: address.city,
          state: address.state,
          cep: address.cep,
        }),
      }),
    )
  })

  it('should not be able to find address if user not found', async () => {
    const output = await sut.execute({
      userId: new UniqueEntityID(),
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

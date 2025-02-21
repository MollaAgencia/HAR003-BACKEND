import { expect } from 'vitest'

import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EditAddressUseCase } from '@domain/authorization/applications/use-cases/edit-address-use-case'

import { makeFakeAddress } from '@test/factories/address.factory'
import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryAddressRepository } from '@test/repositories/in-memory-address.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

describe('Edit Address - Use Case', () => {
  let sut: EditAddressUseCase
  let inMemoryUsersRepository: InMemoryUsersRepository
  let inMemoryAddressRepository: InMemoryAddressRepository

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    sut = new EditAddressUseCase(inMemoryUsersRepository, inMemoryAddressRepository)
  })

  it('should be able to edit address', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.items.push(user)

    const address = makeFakeAddress({ userId: user.id })
    inMemoryAddressRepository.items.push(address)

    const output = await sut.execute({
      userId: user.id,
      neighborhood: 'New Neighborhood',
      street: 'New Street',
      number: 'New Number',
      complement: 'New Complement',
      city: 'New City',
      state: 'New State',
      cep: 'New CEP',
    })

    expect(output.isRight()).toBeTruthy()
    expect(inMemoryAddressRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          neighborhood: 'New Neighborhood',
          street: 'New Street',
          number: 'New Number',
          complement: 'New Complement',
          city: 'New City',
          state: 'New State',
          cep: 'New CEP',
        }),
      ]),
    )
  })

  it('should able to create address if address not found', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.items.push(user)

    const output = await sut.execute({
      userId: user.id,
      neighborhood: 'New Neighborhood',
      street: 'New Street',
      number: 'New Number',
      complement: 'New Complement',
      city: 'New City',
      state: 'New State',
      cep: 'New CEP',
    })

    expect(output.isRight()).toBeTruthy()
    expect(inMemoryAddressRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          neighborhood: 'New Neighborhood',
          street: 'New Street',
          number: 'New Number',
          complement: 'New Complement',
          city: 'New City',
          state: 'New State',
          cep: 'New CEP',
        }),
      ]),
    )
  })

  it('should not be able to edit address if user not found', async () => {
    const user = makeFakeUser()

    const address = makeFakeAddress({ userId: user.id })
    inMemoryAddressRepository.items.push(address)

    const output = await sut.execute({
      userId: user.id,
      neighborhood: 'New Neighborhood',
      street: 'New Street',
      number: 'New Number',
      complement: 'New Complement',
      city: 'New City',
      state: 'New State',
      cep: 'New CEP',
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

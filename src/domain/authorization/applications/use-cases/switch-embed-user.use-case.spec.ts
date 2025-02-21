import { expect } from 'vitest'

import { NotAllowedError } from '@core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { SwitchEmbedUserUseCase } from '@domain/authorization/applications/use-cases/switch-embed-user.use-case'

import { FakeEncrypter } from '@test/cryptography/fake-encrypter'
import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

describe('Switch Embed User - Use Case', () => {
  let sut: SwitchEmbedUserUseCase
  let inMemoryUsersRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    const fakeEncrypter = new FakeEncrypter()
    sut = new SwitchEmbedUserUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to switch embed user', async () => {
    const user = makeFakeUser()
    await inMemoryUsersRepository.items.push(user)

    const embedUser = makeFakeUser()
    await inMemoryUsersRepository.items.push(embedUser)

    const output = await sut.execute({
      userId: user.id,
      embedUserId: embedUser.id,
    })

    expect(output.isRight()).toBeTruthy()
    expect(output.value).toEqual(
      expect.objectContaining({
        accessToken: JSON.stringify({
          sub: user.id.toValue(),
          subRole: 'SELLER',
          embed: embedUser.id.toValue(),
          embedRole: 'SELLER',
          email: user.email,
        }),
      }),
    )
  })

  it('should not be able to switch embed user when user not found', async () => {
    const user = makeFakeUser()

    const embedUser = makeFakeUser()
    await inMemoryUsersRepository.items.push(embedUser)

    const output = await sut.execute({
      userId: user.id,
      embedUserId: embedUser.id,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to switch embed user when embed user not found', async () => {
    const user = makeFakeUser()
    await inMemoryUsersRepository.items.push(user)

    const embedUser = makeFakeUser()

    const output = await sut.execute({
      userId: user.id,
      embedUserId: embedUser.id,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

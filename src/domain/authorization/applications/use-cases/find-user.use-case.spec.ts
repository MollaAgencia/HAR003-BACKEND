import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { FindUserUseCase } from './find-user.use-case'

describe('Find User - Use Case', () => {
  let sut: FindUserUseCase
  let inMemoryUserRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    sut = new FindUserUseCase(inMemoryUserRepository)
  })

  it('should be able to find User', async () => {
    const user = makeFakeUser()
    await inMemoryUserRepository.items.push(user)

    const output = await sut.execute({ id: user.id })

    expect(output.isRight()).toBeTruthy()
    expect(output.value).toEqual(user)
  })

  it("Should not be able to find user if it doesn't exist", async () => {
    const output = await sut.execute({ id: new UniqueEntityID() })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

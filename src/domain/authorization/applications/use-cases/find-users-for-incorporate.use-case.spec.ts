import { repeat } from '@root/shared/repeat'

import { NotAllowedError } from '@core/errors/errors/not-allowed-error'

import { FindUsersForIncorporateUseCase } from '@domain/authorization/applications/use-cases/find-users-for-incorporate.use-case'

import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

describe('Find Users For Incorporate - Use Case', () => {
  let sut: FindUsersForIncorporateUseCase
  let inMemoryUserRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    sut = new FindUsersForIncorporateUseCase(inMemoryUserRepository)
  })

  it('should be able to find users for incorporate', async () => {
    const user = makeFakeUser()
    await inMemoryUserRepository.items.push(user)

    await repeat(30, () => inMemoryUserRepository.items.push(makeFakeUser()))

    const output = await sut.execute({ userId: user.id })

    expect(output.isRight()).toBeTruthy()
    expect(output.value).toHaveLength(31)
  })

  it('should not be able to find users for incorporate if user not found', async () => {
    const user = makeFakeUser()

    await repeat(30, () => inMemoryUserRepository.items.push(makeFakeUser()))

    const output = await sut.execute({ userId: user.id })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(NotAllowedError)
  })
})

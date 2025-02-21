import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { CheckUserDetailsUseCase } from '@domain/authorization/applications/use-cases/check-user-details.use-case'

import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

describe('Check User Details - Use Case', () => {
  let sut: CheckUserDetailsUseCase
  let inMemoryUserRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    sut = new CheckUserDetailsUseCase(inMemoryUserRepository)
  })

  it('should be able to check user details', async () => {
    const user = makeFakeUser()
    inMemoryUserRepository.items.push(user)

    const output = await sut.execute({ cpf: user.cpf })

    expect(output.isRight()).toBeTruthy()
    expect(output.value).toEqual(
      expect.objectContaining({
        firstAccess: false,
        isTwoFactorEnabled: false,
        role: user.role,
      }),
    )
  })

  it('should be able to check user details with not found user', async () => {
    const output = await sut.execute({ cpf: '00000000000' })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

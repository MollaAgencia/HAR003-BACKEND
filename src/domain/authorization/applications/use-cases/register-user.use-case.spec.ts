import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'

import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'
import { InMemoryVerificationEmailTokensRepository } from '@test/repositories/in-memory-verification-tokens.repository'

import { RegisterUserUseCase } from './register-user.use-case'

describe('RegisterUsersUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let verificationTokenRepository: InMemoryVerificationEmailTokensRepository
  let sut: RegisterUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    const hash = new FakeHasher()
    verificationTokenRepository = new InMemoryVerificationEmailTokensRepository()
    sut = new RegisterUserUseCase(usersRepository, hash, verificationTokenRepository)
  })

  it('should be able to register new user', async () => {
    const email = 'johnDoe@hotmail.com'
    const cpf = '12345678900'

    const user = makeFakeUser({ email, cpf })
    usersRepository.register(user)

    const output = await sut.execute({
      name: 'Joe Doe',
      email,
      password: '123456',
      cpf: '12345678900',
    })

    expect(output.isRight()).toBeTruthy()
    expect(usersRepository.items).toHaveLength(1)
    expect(usersRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Joe Doe',
        email: 'johnDoe@hotmail.com',
        password: '123456-hashed',
      }),
    )
  })

  it('should not be able to complete register new user if not exists', async () => {
    const output = await sut.execute({
      name: 'Joe Doe2',
      email: 'johnDoe@hotmail.com',
      password: '1234567',
      cpf: '12345678900',
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register new user if bad format email', async () => {
    const output = await sut.execute({
      name: 'Joe Doe',
      email: 'johnDoehotmail.com',
      password: '123456-hashed',
      cpf: '12345678900',
    })
    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(EmailBadFormattedError)
  })
})

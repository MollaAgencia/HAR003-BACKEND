import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeFakePasswordResetToken } from '@test/factories/password-reset-token.factory'
import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryPasswordResetTokensRepository } from '@test/repositories/in-memory-password-reset-tokens.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { ExpiredPasswordResetTokenError } from '../errors/expired-password-reset-token.error'
import { InvalidPasswordResetTokenError } from '../errors/invalid-password-reset-token.error'
import { NewPasswordUseCase } from './new-password.use-case'

describe('New Password - Use Case', () => {
  let sut: NewPasswordUseCase
  let inMemoryPasswordResetTokensRepository: InMemoryPasswordResetTokensRepository
  let inMemoryUsersRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryPasswordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    const hash = new FakeHasher()
    sut = new NewPasswordUseCase(inMemoryPasswordResetTokensRepository, inMemoryUsersRepository, hash)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to change password', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() })
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken)

    const output = await sut.execute({
      token: passwordResetToken.token,
      newPassword: 'new-password',
    })

    expect(output.isRight()).toBeTruthy()
    expect(inMemoryUsersRepository.items[0].password).toBe('new-password-hashed')
  })

  it('should not be able to change password with invalid token', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() })
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken)

    const output = await sut.execute({
      token: new UniqueEntityID(),
      newPassword: 'new-password',
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(InvalidPasswordResetTokenError)
  })

  it('should not be able to change password with invalid user', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() })
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken)

    inMemoryUsersRepository.items = []

    const output = await sut.execute({
      token: passwordResetToken.token,
      newPassword: 'new-password',
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(InvalidPasswordResetTokenError)
  })

  it('should not be able to change password with invalid expired', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    vi.setSystemTime(new Date(2024, 2, 2, 8, 0, 0))
    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() })
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken)
    vi.setSystemTime(new Date(2024, 2, 2, 8, 8, 0))

    const output = await sut.execute({
      token: passwordResetToken.token,
      newPassword: 'new-password',
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ExpiredPasswordResetTokenError)
    expect(inMemoryPasswordResetTokensRepository.items).toHaveLength(0)
  })
})

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { ExpiredVerificationEmailTokenError } from '@domain/authorization/applications/errors/expired-verification-email-token.error'
import { InvalidVerificationEmailTokenError } from '@domain/authorization/applications/errors/invalid-verification-email-token.error'

import { makeFakeUser } from '@test/factories/users.factory'
import { makeFakeVerificationEmailToken } from '@test/factories/verification-email-tokens.factory'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'
import { InMemoryVerificationEmailTokensRepository } from '@test/repositories/in-memory-verification-tokens.repository'

import { UserAlreadyVerificationEmailError } from '../errors/user-already-verification-email.error'
import { VerifyEmailUseCase } from './verify-email.use-case'

describe('Verify Email - Use Case', () => {
  let sut: VerifyEmailUseCase
  let inMemoryVerificationEmailTokensRepository: InMemoryVerificationEmailTokensRepository
  let inMemoryUsersRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryVerificationEmailTokensRepository = new InMemoryVerificationEmailTokensRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new VerifyEmailUseCase(inMemoryVerificationEmailTokensRepository, inMemoryUsersRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to verify email', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    const verificationEmailToken = makeFakeVerificationEmailToken({ email: user.email, createdAt: new Date() })
    inMemoryVerificationEmailTokensRepository.sendToken(verificationEmailToken)

    const output = await sut.execute({ token: verificationEmailToken.token })

    expect(output.isRight()).toBeTruthy()
    expect(inMemoryVerificationEmailTokensRepository.items).toHaveLength(0)
    expect(inMemoryUsersRepository.items[0].emailVerified).toBeTruthy()
  })

  it('should not be able to verify email if token not found', async () => {
    const output = await sut.execute({
      token: new UniqueEntityID(),
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(InvalidVerificationEmailTokenError)
  })

  it('should not be able to verify email if user not found', async () => {
    const verificationEmailToken = makeFakeVerificationEmailToken({ createdAt: new Date() })
    inMemoryVerificationEmailTokensRepository.sendToken(verificationEmailToken)

    const output = await sut.execute({ token: verificationEmailToken.token })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(InvalidVerificationEmailTokenError)
  })

  it('should not be able to verify email if user already verified', async () => {
    const user = makeFakeUser({ emailVerified: new Date() })
    inMemoryUsersRepository.register(user)

    const verificationEmailToken = makeFakeVerificationEmailToken({ email: user.email, createdAt: new Date() })
    inMemoryVerificationEmailTokensRepository.sendToken(verificationEmailToken)

    const output = await sut.execute({ token: verificationEmailToken.token })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(UserAlreadyVerificationEmailError)
  })

  it('should not be able to verify email if token is expired', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    vi.setSystemTime(new Date(2024, 2, 2, 8, 0, 0))
    const verificationEmailToken = makeFakeVerificationEmailToken({ email: user.email })
    inMemoryVerificationEmailTokensRepository.sendToken(verificationEmailToken)
    vi.setSystemTime(new Date(2024, 2, 2, 8, 8, 0))

    const output = await sut.execute({ token: verificationEmailToken.token })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ExpiredVerificationEmailTokenError)
    expect(inMemoryVerificationEmailTokensRepository.items).toHaveLength(0)
  })
})

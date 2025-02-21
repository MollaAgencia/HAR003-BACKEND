import { expect } from 'vitest'

import { UniqueTwoFactorTokenId } from '@core/domain/unique-two-factor-token-id'

import { EmailNotVerifiedError } from '@domain/authorization/applications/errors/email-not-verified.error'
import { WrongCredentialsError } from '@domain/authorization/applications/errors/wrong-credentials.error'

import { FakeEncrypter } from '@test/cryptography/fake-encrypter'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeFakeTwoFactorToken } from '@test/factories/two-factor-tokens.factory'
import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryTwoFactorTokens } from '@test/repositories/in-memory-two-factor-tokens.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'
import { InMemoryVerificationEmailTokensRepository } from '@test/repositories/in-memory-verification-tokens.repository'

import { ExpiredTwoFactorCodeError } from '../errors/expired-two-factor-code.error'
import { InvalidTwoFactorCodeError } from '../errors/invalid-two-factor-code.error'
import { WithoutTwoFactorCodeError } from '../errors/without-two-factor-code.error'
import { AuthorizationUseCase } from './authorization.use-case'

describe('Authorization - Use Case', () => {
  let sut: AuthorizationUseCase
  let inMemoryUserRepository: InMemoryUsersRepository
  let inMemoryVerificationEmailTokens: InMemoryVerificationEmailTokensRepository
  let inMemoryTwoFactorTokens: InMemoryTwoFactorTokens

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    const fakeHasher = new FakeHasher()
    inMemoryVerificationEmailTokens = new InMemoryVerificationEmailTokensRepository()
    inMemoryTwoFactorTokens = new InMemoryTwoFactorTokens()
    const fakeEncrypter = new FakeEncrypter()
    sut = new AuthorizationUseCase(
      inMemoryUserRepository,
      inMemoryVerificationEmailTokens,
      fakeHasher,
      inMemoryTwoFactorTokens,
      fakeEncrypter,
    )
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to authorization user', async () => {
    const user = makeFakeUser({ emailVerified: new Date() })
    inMemoryUserRepository.items.push(user)
    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: null,
    })

    expect(output.isRight()).toBeTruthy()
    expect(output.value).toEqual(
      expect.objectContaining({
        accessToken: JSON.stringify({
          sub: user.id.toValue(),
          subRole: 'SELLER',
          embed: user.id.toValue(),
          embedRole: 'SELLER',
          email: user.email,
        }),
      }),
    )
  })

  it('should be able to send a two factor code, and user active factor token without code', async () => {
    const user = makeFakeUser({ isTwoFactorEnabled: true, emailVerified: new Date() })
    inMemoryUserRepository.items.push(user)
    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: null,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(WithoutTwoFactorCodeError)
  })

  it("Should be able to resend a two factor code if it's already exists if user active two factor and not send code", async () => {
    const user = makeFakeUser({ isTwoFactorEnabled: true, emailVerified: new Date() })
    inMemoryUserRepository.items.push(user)
    const twoFactorToken = makeFakeTwoFactorToken({ email: user.email })
    inMemoryTwoFactorTokens.items.push(twoFactorToken)

    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: null,
    })
    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(WithoutTwoFactorCodeError)
    expect(inMemoryTwoFactorTokens.items.length).toBe(1)
    expect(inMemoryTwoFactorTokens.items[0].token).not.toBe(twoFactorToken.token)
  })

  it('should be able to authorization user with two factor code', async () => {
    vi.setSystemTime(new Date(2024, 2, 2, 8, 0, 0))
    const user = makeFakeUser({ isTwoFactorEnabled: true, emailVerified: new Date() })
    inMemoryUserRepository.items.push(user)
    const twoFactorToken = makeFakeTwoFactorToken({ email: user.email, createdAt: new Date() })
    inMemoryTwoFactorTokens.items.push(twoFactorToken)
    vi.setSystemTime(new Date(2024, 2, 2, 8, 5, 0))

    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: twoFactorToken.token,
    })

    expect(output.isRight()).toBeTruthy()
    expect(output.value).toEqual(
      expect.objectContaining({
        accessToken: JSON.stringify({
          sub: user.id.toValue(),
          embed: user.id.toValue(),
          email: user.email,
        }),
      }),
    )
  })

  it('should not be able to authorization user with invalid two factor code', async () => {
    const user = makeFakeUser({ isTwoFactorEnabled: true, emailVerified: new Date() })
    inMemoryUserRepository.items.push(user)
    const twoFactorToken = makeFakeTwoFactorToken({ email: user.email })
    inMemoryTwoFactorTokens.items.push(twoFactorToken)

    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: new UniqueTwoFactorTokenId(),
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(InvalidTwoFactorCodeError)
  })

  it('should not be able to authorization user with expired two factor code', async () => {
    vi.setSystemTime(new Date(2024, 2, 2, 8, 0, 0))
    const user = makeFakeUser({ isTwoFactorEnabled: true, emailVerified: new Date() })
    inMemoryUserRepository.items.push(user)
    const twoFactorToken = makeFakeTwoFactorToken({ email: user.email, createdAt: new Date() })
    inMemoryTwoFactorTokens.items.push(twoFactorToken)
    vi.setSystemTime(new Date(2024, 2, 2, 8, 15, 0))

    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: twoFactorToken.token,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ExpiredTwoFactorCodeError)
    expect(inMemoryTwoFactorTokens.items).toHaveLength(0)
  })

  it('should not be able to authorization user with bad formatted code', async () => {
    const user = makeFakeUser({ isTwoFactorEnabled: true })
    inMemoryUserRepository.items.push(user)

    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: new UniqueTwoFactorTokenId('12345'),
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(InvalidTwoFactorCodeError)
  })

  it('should not be able to authorization user with not found cpf', async () => {
    const user = makeFakeUser()
    inMemoryUserRepository.items.push(user)
    const output = await sut.execute({
      cpf: '0000000000000',
      password: user.password,
      code: null,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authorization user with invalid password', async () => {
    const user = makeFakeUser({ emailVerified: new Date() })
    inMemoryUserRepository.items.push(user)

    const output = await sut.execute({
      cpf: user.cpf,
      password: 'other-password',
      code: null,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('Should not be able to authorization user with email not verified', async () => {
    const user = makeFakeUser()
    inMemoryUserRepository.items.push(user)

    const output = await sut.execute({
      cpf: user.cpf,
      password: user.password,
      code: null,
    })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(EmailNotVerifiedError)
    expect(inMemoryVerificationEmailTokens.items).toHaveLength(1)
  })
})

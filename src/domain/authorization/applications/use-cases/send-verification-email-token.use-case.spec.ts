import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'
import { UserAlreadyVerificationEmailError } from '@domain/authorization/applications/errors/user-already-verification-email.error'
import { WrongCredentialsError } from '@domain/authorization/applications/errors/wrong-credentials.error'

import { makeFakeUser } from '@test/factories/users.factory'
import { makeFakeVerificationEmailToken } from '@test/factories/verification-email-tokens.factory'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'
import { InMemoryVerificationEmailTokensRepository } from '@test/repositories/in-memory-verification-tokens.repository'

import { SendVerificationEmailTokenUseCase } from './send-verification-email-token.use-case'

describe('Send Verification Token - Use Case', () => {
  let sut: SendVerificationEmailTokenUseCase
  let inMemoryUsersRepository: InMemoryUsersRepository
  let inMemoryVerificationTokens: InMemoryVerificationEmailTokensRepository

  beforeEach(() => {
    inMemoryVerificationTokens = new InMemoryVerificationEmailTokensRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new SendVerificationEmailTokenUseCase(inMemoryVerificationTokens, inMemoryUsersRepository)
  })

  it('should be able to send verification token', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)
    const output = await sut.execute({ email: user.email })
    expect(output.isRight()).toBeTruthy()
    expect(inMemoryVerificationTokens.items).toHaveLength(1)
    expect(inMemoryVerificationTokens.items[0].email).toBe(user.email)
  })

  it('should not be able to send verification token with invalid email', async () => {
    const output = await sut.execute({ email: 'invalid_email' })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(EmailBadFormattedError)
  })

  it('should not be able to send verification token if user not found', async () => {
    const user = makeFakeUser()
    const output = await sut.execute({ email: user.email })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('Should be able to send verification token if user already has a token', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    const verificationToken = makeFakeVerificationEmailToken({ email: user.email })
    inMemoryVerificationTokens.sendToken(verificationToken)

    const output = await sut.execute({ email: user.email })

    expect(output.isRight()).toBeTruthy()
    expect(inMemoryVerificationTokens.items).toHaveLength(1)
    expect(inMemoryVerificationTokens.items[0].token).not.toBe(verificationToken.token)
  })

  it('Should not be able to send verification token if user already verified', async () => {
    const user = makeFakeUser({ emailVerified: new Date() })
    inMemoryUsersRepository.register(user)

    const output = await sut.execute({ email: user.email })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(UserAlreadyVerificationEmailError)
    expect(inMemoryVerificationTokens.items).toHaveLength(0)
  })
})

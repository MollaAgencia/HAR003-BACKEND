import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

import { EmailBadFormattedError } from '@domain/authorization/applications/errors/email-bad-formatted-error'

import { makeFakePasswordResetToken } from '@test/factories/password-reset-token.factory'
import { makeFakeUser } from '@test/factories/users.factory'
import { InMemoryPasswordResetTokensRepository } from '@test/repositories/in-memory-password-reset-tokens.repository'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users.repository'

import { ForgotPasswordUseCase } from './forgot-password.use-case'

describe('Forgot Password - Use Case', () => {
  let sut: ForgotPasswordUseCase
  let inMemoryUsersRepository: InMemoryUsersRepository
  let inMemoryPasswordResetTokensRepository: InMemoryPasswordResetTokensRepository

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryPasswordResetTokensRepository = new InMemoryPasswordResetTokensRepository()
    sut = new ForgotPasswordUseCase(inMemoryPasswordResetTokensRepository, inMemoryUsersRepository)
  })

  it('should be able to forgot password - Use case', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    const output = await sut.execute({ email: user.email })

    expect(output.isRight()).toBeTruthy()
    expect(inMemoryPasswordResetTokensRepository.items).toHaveLength(1)
    expect(inMemoryPasswordResetTokensRepository.items[0].email).toBe(user.email)
  })

  it('should not be able to forgot password with invalid email', async () => {
    const output = await sut.execute({ email: 'invalid_email' })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(EmailBadFormattedError)
  })

  it('should not be able to send forgot password token if user not found', async () => {
    const user = makeFakeUser()
    const output = await sut.execute({ email: user.email })

    expect(output.isLeft()).toBeTruthy()
    expect(output.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should be able to send forgot password token if user already has a token', async () => {
    const user = makeFakeUser()
    inMemoryUsersRepository.register(user)

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email })
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken)

    const output = await sut.execute({ email: user.email })

    expect(output.isRight()).toBeTruthy()
    expect(inMemoryPasswordResetTokensRepository.items).toHaveLength(1)
    expect(inMemoryPasswordResetTokensRepository.items[0].token).not.toBe(passwordResetToken.token)
  })
})

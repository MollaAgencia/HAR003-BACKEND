import { InMemoryMailRepository } from '@test/repositories/in-memory-mail.repository'
import { InMemoryMailerRepository } from '@test/repositories/in-memory-mailer.repository'

import { MailType } from '../../enterprise/entities/mail'
import { SendMailUseCase } from './send-mail.use-case'

describe('Send Mail - Use Case', () => {
  let sut: SendMailUseCase
  let inMemoryMailRepository: InMemoryMailRepository
  let inMemoryMailerRepository: InMemoryMailerRepository

  beforeEach(() => {
    inMemoryMailRepository = new InMemoryMailRepository()
    inMemoryMailerRepository = new InMemoryMailerRepository()
    sut = new SendMailUseCase(inMemoryMailerRepository, inMemoryMailRepository)
  })

  it('should be able to create a mailer', async () => {
    const output = await sut.execute({
      body: 'body-test',
      email: 'my-email@email.com',
      subject: 'subject-test',
      type: MailType.SAC,
    })

    expect(output.isRight()).toBe(true)
    expect(output.value).toEqual(
      expect.objectContaining({
        body: 'body-test',
        email: 'my-email@email.com',
        subject: 'subject-test',
        type: MailType.SAC,
      }),
    )
    expect(inMemoryMailerRepository.mailers.length).toBe(1)
    expect(inMemoryMailRepository.mails.length).toBe(1)
  })
})

import { UniqueEntityID } from '@root/core/domain/unique-entity-id'

import { InMemoryLogAccesRepository } from '@test/repositories/in-memory-log-access-repository'

import { CreateLogAccessUseCase } from './create-log-access.use-case'

describe('Create Log Access - Use Case', () => {
  let sut: CreateLogAccessUseCase
  let inMemoryLogAccesRepository: InMemoryLogAccesRepository

  beforeEach(() => {
    inMemoryLogAccesRepository = new InMemoryLogAccesRepository()
    sut = new CreateLogAccessUseCase(inMemoryLogAccesRepository)
  })

  it('should be able to create a log access in database if the user has not yet accessed the system on that page and on the current day', async () => {
    const output = await sut.execute({
      page: 'home/test',
      userId: new UniqueEntityID('123'),
    })

    expect(output.isRight()).toBe(true)
    expect(inMemoryLogAccesRepository.logAccess.length).toBe(1)
    expect(inMemoryLogAccesRepository.logAccess[0]).toEqual(
      expect.objectContaining({
        page: 'home/test',
        userId: new UniqueEntityID(`123`),
      }),
    )
  })

  it('not should be able to create a log access in database if the user ha accessed the system on that page and on the current day', async () => {
    await sut.execute({
      page: 'home/test',
      userId: new UniqueEntityID('123'),
    })

    const output = await sut.execute({
      page: 'home/test',
      userId: new UniqueEntityID('123'),
    })

    expect(output.isRight()).toBe(true)
    expect(inMemoryLogAccesRepository.logAccess.length).toBe(1)
  })
})

import { UniqueEntityID } from '@root/core/domain/unique-entity-id'

import { LogAccess } from './log-access.entity'

describe('Log Access - Entity', () => {
  it('should be able to create a entities of log access with all fields', () => {
    const logAccess = LogAccess.create(
      {
        userId: new UniqueEntityID('1'),
        page: 'home',
        createdAt: new Date(),
      },
      new UniqueEntityID('123'),
    )

    expect(logAccess.userId).toBeInstanceOf(UniqueEntityID)
    expect(logAccess.userId.toValue()).toEqual('1')
    expect(logAccess.id).toBeInstanceOf(UniqueEntityID)
    expect(logAccess.id.toValue()).toEqual('123')
    expect(logAccess.page).toBe('home')
    expect(logAccess.createdAt).toBeInstanceOf(Date)
  })

  it('should be able to create a entities of log access without id', () => {
    const logAccess = LogAccess.create({
      userId: new UniqueEntityID('1'),
      page: 'home',
      createdAt: new Date(),
    })

    expect(logAccess.userId).toBeInstanceOf(UniqueEntityID)
    expect(logAccess.userId.toValue()).toEqual('1')
    expect(logAccess.id).toBeInstanceOf(UniqueEntityID)
    expect(logAccess.id.toValue()).toEqual(logAccess.id.toValue())
    expect(logAccess.page).toBe('home')
    expect(logAccess.createdAt).toBeInstanceOf(Date)
  })

  it('should be able to create a entities of log access without createdAt and id', () => {
    const logAccess = LogAccess.create({
      userId: new UniqueEntityID('1'),
      page: 'home',
    })

    expect(logAccess.userId).toBeInstanceOf(UniqueEntityID)
    expect(logAccess.userId.toValue()).toEqual('1')
    expect(logAccess.id).toBeInstanceOf(UniqueEntityID)
    expect(logAccess.id.toValue()).toEqual(logAccess.id.toValue())
    expect(logAccess.page).toBe('home')
    expect(logAccess.createdAt).toBeInstanceOf(Date)
    expect(logAccess.createdAt).toEqual(logAccess.createdAt)
  })
})

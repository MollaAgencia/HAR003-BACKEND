import { UniqueEntityID } from './unique-entity-id'

describe('unique entities id - domain', () => {
  it('should be able create unique entities id', () => {
    const id = new UniqueEntityID()
    expect(id).toBeTruthy()
    expect(id).toBeDefined()
    expect(id.toValue()).toBeDefined()
  })

  it('should be able create unique entities id with value', () => {
    const uniqueId = 'e06669f4-4895-4de0-a737-085e072b8cda'
    const id = new UniqueEntityID(uniqueId)
    expect(id).toBeTruthy()
    expect(id).toBeDefined()
    expect(id.toValue()).toBe(uniqueId)
  })
})

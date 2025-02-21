import { UniqueTwoFactorTokenId } from './unique-two-factor-token-id'

describe('Unique Two Factor Token Id - domain', () => {
  it('should be able create unique two factor token id', () => {
    const id = new UniqueTwoFactorTokenId()
    expect(id).toBeTruthy()
    expect(id.toValue()).toBeDefined()
    expect(id.toValue()).toHaveLength(6)
  })

  it('should be able create unique two factor token id with value', () => {
    const uniqueId = '123456'
    const id = new UniqueTwoFactorTokenId(uniqueId)
    expect(id.toValue()).toBe(uniqueId)
  })

  it('should be able to verify if two factor token id is valid', () => {
    const id = new UniqueTwoFactorTokenId('12345')
    expect(id.validate()).toBeFalsy()
  })
})

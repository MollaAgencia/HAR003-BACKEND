import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { Token } from './token.entity'

describe('Passoword Reset Token - Entity', () => {
  it('should be able to create a passoword reset token', () => {
    const output = Token.create({ email: 'johnDoe@hotmail.com' })
    expect(output).instanceOf(Token)
    expect(output.id).not.toBeUndefined()
    expect(output.email).toBe('johnDoe@hotmail.com')
    expect(output.token).toBeDefined()
    expect(output.createdAt).instanceOf(Date)
    expect(output.updatedAt).instanceOf(Date)
  })

  it('should be able to create a passoword reset token with id', () => {
    const id = new UniqueEntityID()
    const output = Token.create({ email: 'johndoe@htomail.com' }, id)
    expect(output.id).toBe(id)
  })
})

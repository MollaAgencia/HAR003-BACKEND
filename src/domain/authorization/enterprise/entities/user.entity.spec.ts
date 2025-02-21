import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { User } from './user.entity'

describe('User - Entity', () => {
  it('should be able to create a user', () => {
    const output = User.create({
      name: 'Joe Doe',
      email: 'joedoe@htomail.com',
      password: '123456',
      cpf: '12345678900',
    })

    console.log(output.id)

    expect(output).instanceOf(User)
    expect(output.id).not.toBeUndefined()
    expect(output.name).toBe('Joe Doe')
    expect(output.cpf).toBe('12345678900')
    expect(output.email).toBe('joedoe@htomail.com')
    expect(output.role).toBe('SELLER')
    expect(output.password).toBe('123456')
    expect(output.emailVerified).toBeNull()
    expect(output.telephone).toBeNull()
    expect(output.isTwoFactorEnabled).toEqual(false)
    expect(output.createdAt).instanceOf(Date)
    expect(output.updatedAt).instanceOf(Date)
  })

  it('should be able to create a user with id', () => {
    const id = new UniqueEntityID()

    const output = User.create(
      {
        name: 'Joe Doe',
        email: 'joedoe@htomail.com',
        password: '123456',
        cpf: '12345678900',
      },
      id,
    )

    expect(output.id).toBe(id)
  })
})

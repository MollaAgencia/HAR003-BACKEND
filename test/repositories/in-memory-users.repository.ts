import { UniqueEntityID } from '@core/domain/unique-entity-id'
import { AsyncMaybe } from '@core/logic/Maybe'

import { UsersRepository } from '@domain/authorization/applications/repositories/users.repository'
import { Role, User } from '@domain/authorization/enterprise/entities/user.entity'

export class InMemoryUsersRepository implements UsersRepository {
  public items: Array<User> = []

  async register(user: User): Promise<void> {
    this.items.push(user)
  }

  async findById(id: UniqueEntityID): AsyncMaybe<User> {
    const user = this.items.find((item) => item.id.equals(id))
    if (!user) return null
    return user
  }

  async findByCpf(cpf: string): AsyncMaybe<User> {
    const user = this.items.find((item) => item.cpf === cpf)
    if (!user) return null
    return user
  }

  async findByEmail(email: string): AsyncMaybe<User> {
    const user = this.items.find((item) => item.email === email)
    if (!user) return null
    return user
  }

  async findManyByIncorporate(): Promise<{ id: UniqueEntityID; name: string; role: Role }[]> {
    return this.items.map((item) => ({ id: item.id, name: item.name, role: item.role }))
  }

  async save(user: User): Promise<void> {
    this.items = this.items.map((item) => (item.id.equals(user.id) ? user : item))
  }
}

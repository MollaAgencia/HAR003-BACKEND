import { User } from '@domain/authorization/enterprise/entities/user.entity'

export class UserViewModel {
  static toHttp(user: User) {
    return {
      name: user.name,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
    }
  }
}

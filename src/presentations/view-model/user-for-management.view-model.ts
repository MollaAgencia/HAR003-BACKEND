import { User } from '@root/domain/authorization/enterprise/entities/user.entity'

export class UserForManagementViewModel {
  static toHttp(user: User) {
    return {
      id: user.id.toValue(),
      name: user.name,
      email: user.email,
      document: user.document,
      telephone: user.telephone,
      role: user.role,
      region: user.region,
      salesChannel: user.salesChannel,
      distributorId: user.distributorId.toValue(),
      status: user.disabled ? 'INACTIVE' : 'ACTIVE',
    }
  }
}

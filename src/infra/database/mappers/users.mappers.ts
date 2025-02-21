import { User as UserPrisma, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

import { User } from '@domain/authorization/enterprise/entities/user.entity'
import { Region, SalesChannel, UserRole } from '@domain/authorization/enterprise/interfaces/user'

export class UserMappers {
  static toDomain(data: UserPrisma): User {
    return User.create(
      {
        name: data.name,
        email: data?.email,
        document: data.document,
        role: data.role as UserRole,
        emailVerified: data.emailVerified,
        password: data.password,
        disabled: data.disabled,
        telephone: data.telephone,
        salesChannel: data.salesChannel as SalesChannel,
        region: data.region as Region,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        distributorId: new UniqueEntityID(data.distributorId),
      },
      new UniqueEntityID(data.id),
    )
  }

  static toPersistence(data: User): Prisma.UserCreateInput {
    return {
      name: data.name,
      email: data?.email,
      document: data.document,
      distributor: {
        connect: { id: data.distributorId.toValue() },
      },
      role: data.role,
      salesChannel: data.salesChannel,
      emailVerified: data.emailVerified,
      disabled: data.disabled,
      telephone: data.telephone,
      password: data.password,
      region: data.region,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      id: data.id.toValue(),
    }
  }
}

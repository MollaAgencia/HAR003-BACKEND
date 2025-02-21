import { Distributor as DistributorPrisma, Prisma } from '@prisma/client'
import { Distributor } from '@root/domain/distributor/enterprise/entities/distrubutor.entity'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

export class DistributorMappers {
  static toDomain(data: DistributorPrisma): Distributor {
    return Distributor.create(
      {
        name: data.name,
        externalId: data.externalId,
        disabled: data.disabled || null,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      new UniqueEntityID(data.id),
    )
  }

  static toPersistence(data: Distributor): Prisma.DistributorCreateInput {
    return {
      name: data.name,
      externalId: data.externalId,
      disabled: data.disabled || null,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      id: data.id.toValue(),
    }
  }
}

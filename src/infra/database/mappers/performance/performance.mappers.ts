import { Performance as PerformancePrisma, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { SalesChannel, UserRole } from '@root/domain/authorization/enterprise/interfaces/user'
import { PerformanceDetails } from '@root/domain/performance/enterprise/value-objects/performance-details'

import { KpiType, Performance } from '@domain/performance/enterprise/entities/performance.entity'

export class PerformanceMappers {
  static toDomain(data: PerformancePrisma): Performance {
    return Performance.create(
      {
        userId: data.userId ? new UniqueEntityID(data.userId) : undefined,
        supervisorId: data.supervisorId ? new UniqueEntityID(data.supervisorId) : undefined,
        managerId: data.managerId ? new UniqueEntityID(data.managerId) : undefined,
        goal: data.goal,
        real: data.real,
        period: data.period,
        kpiType: data.kpiType as KpiType,
        createdAt: new Date(data.createdAt),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
        externalUserId: data.externalUserId,
        userRole: data.userRole as UserRole,
        salesChannel: data.salesChannel as SalesChannel,
        distributorId: data.distributorId,
      },
      new UniqueEntityID(data.id),
    )
  }

  static toDetails(data: PerformancePrisma): PerformanceDetails {
    return PerformanceDetails.create({
      goal: data.goal,
      real: data.real,
      kpiType: data.kpiType as KpiType,
    })
  }

  static toPersistence(data: Performance): Prisma.PerformanceCreateInput {
    return {
      id: data.id.toValue(),
      distributor: {
        connect: {
          id: data.distributorId,
        },
      },
      userRole: data.userRole,
      salesChannel: data.salesChannel,
      goal: data.goal,
      real: data.real,
      period: data.period,
      kpiType: data.kpiType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
}

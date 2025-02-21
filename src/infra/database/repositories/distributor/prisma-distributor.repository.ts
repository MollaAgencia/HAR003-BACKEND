import { Injectable } from '@nestjs/common'
import { DistributorRepository } from '@root/domain/distributor/applications/repositories/distributor.repository'
import { Distributor } from '@root/domain/distributor/enterprise/entities/distrubutor.entity'

import { PrismaService } from '../../prisma.service'
import { DistributorMappers } from '../../mappers/distributor.mappers'

@Injectable()
export class PrismaDistributorRepository implements DistributorRepository {
  constructor(private readonly db: PrismaService) {}
  async findMany(): Promise<Array<Distributor>> {
    const distributors = await this.db.distributor.findMany({
      where: {
        disabled: null,
      },
    })

    return distributors.map((distributor) => DistributorMappers.toDomain(distributor))
  }
}

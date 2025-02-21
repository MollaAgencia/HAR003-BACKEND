import { Distributor } from '@root/domain/distributor/enterprise/entities/distrubutor.entity'

export class DistributorViewModel {
  static toHttp(distributor: Distributor) {
    return {
      id: distributor.id.toString(),
      name: distributor.name,
      externalId: distributor.externalId,
    }
  }
}

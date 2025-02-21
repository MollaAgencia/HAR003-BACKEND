import { Distributor } from '../../enterprise/entities/distrubutor.entity'

export abstract class DistributorRepository {
  abstract findMany(): Promise<Array<Distributor>>
}

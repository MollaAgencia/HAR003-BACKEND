import {
  GetPdvsProps,
  MerchandisingPdvRepository,
} from '@domain/pdvs/applications/repositories/merchandising-pdv.repository'
import { PdvEntity } from '@domain/pdvs/enterprise/entities/pdv.entity'

export class InMemoryPdvsRepository implements MerchandisingPdvRepository {
  public pdvs: Array<PdvEntity> = []

  async getPdvs(data: GetPdvsProps): Promise<Array<PdvEntity>> {
    const { userId } = data

    const pdvs = this.pdvs.filter((pdv) => pdv.userId.equals(userId))

    return pdvs
  }
}

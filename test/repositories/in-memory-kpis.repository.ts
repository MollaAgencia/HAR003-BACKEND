import { GetKpiProps, KpiRepository } from '@root/domain/performance/applications/repositories/kpi.repositories'
import { Kpi } from '@root/domain/performance/enterprise/entities/kpi.entity'

export class InMemoryKpisRepository implements KpiRepository {
  public kpis: Array<Kpi> = []

  async getKpis(data: GetKpiProps): Promise<Array<Kpi>> {
    const { type, userId, referenceType } = data

    const kpi = this.kpis.filter(
      (kpi) => kpi.type === type && kpi.userId.equals(userId) && kpi.referenceType === referenceType,
    )

    if (!kpi) return null

    return kpi
  }
}

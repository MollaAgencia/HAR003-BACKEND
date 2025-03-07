import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@root/core/domain/unique-entity-id'
import { SalesChannel, UserRole } from '@root/domain/authorization/enterprise/interfaces/user'
import {
  GetPerformanceProps,
  GetSemiannuallyPerformanceProps,
  GetTeamPerformanceProps,
  PerformanceRepository,
} from '@root/domain/performance/applications/repositories/performance.repositories'
import { KpiType, kpiType } from '@root/domain/performance/enterprise/entities/performance.entity'
import { AcceleratorDetails } from '@root/domain/performance/enterprise/value-objects/accelerator-details'
import { BimonthlyPerformanceDetails } from '@root/domain/performance/enterprise/value-objects/bimonthly-performance-details'
import { PerformanceDetails } from '@root/domain/performance/enterprise/value-objects/performance-details'
import {
  SemiannualPerformanceDetails,
  BimonthlyDetailsProps,
} from '@root/domain/performance/enterprise/value-objects/semiannual-performance-details'
import { SimpleUserDetails } from '@root/domain/performance/enterprise/value-objects/simple-user-details'
import { TeamEngagementDetails } from '@root/domain/performance/enterprise/value-objects/team-engagement-details'
import { monthPeriodByBimonthlyPeriod } from '@root/shared/months-by-bimonthly-period'
import { bimonthlyPeriodBySemiannualPeriod } from '@root/shared/months-by-semiannual-period'

import { PerformanceMappers } from '../../mappers/performance/performance.mappers'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaPerformanceRepository implements PerformanceRepository {
  constructor(private readonly db: PrismaService) {}

  async getAccelerator(data: GetPerformanceProps): Promise<AcceleratorDetails> {
    const { userId, period } = data

    const performances = await this.db.performance.findMany({
      where: {
        userId: userId.toValue(),
        period: period,
        kpiType: kpiType.ACCELERATOR,
      },
    })

    const teamSizeSupervisor = await this.db.performance.count({
      where: {
        period: period,
        kpiType: kpiType.ACCELERATOR,
        supervisorId: userId.toValue(),
      },
    })

    const teamSizeManager = await this.db.performance.count({
      where: {
        period: period,
        kpiType: kpiType.ACCELERATOR,
        managerId: userId.toValue(),
      },
    })

    return AcceleratorDetails.create({
      performances: performances.map((performance) => PerformanceMappers.toDetails(performance)),
      teamSize: teamSizeManager + teamSizeSupervisor,
      userRole: (performances[0]?.userRole as UserRole) || null,
    })
  }
  async getBimonthlySellOutPerformance(
    data: GetPerformanceProps,
  ): Promise<{ real: number; goal: number; period: number }> {
    const { userId, period } = data

    const performances = await this.db.performance.groupBy({
      by: ['kpiType'],
      where: {
        userId: userId.toValue(),
        period: { in: monthPeriodByBimonthlyPeriod(period) },
        kpiType: kpiType.SELL_OUT,
      },
      _sum: { goal: true, real: true },
    })
    const performance = performances[0] || { _sum: { goal: 0, real: 0 } }
    return {
      real: performance._sum.real || 0,
      goal: performance._sum.goal || 0,
      period,
    }
  }

  async getBimonthlyPerformance(data: GetPerformanceProps): Promise<BimonthlyPerformanceDetails> {
    const { userId, period } = data

    const userInformations = await this.db.performance.findFirst({
      where: {
        userId: userId.toValue(),
        period: { in: monthPeriodByBimonthlyPeriod(period) },
      },
      select: { userRole: true, salesChannel: true },
    })

    const performances = await this.db.performance.groupBy({
      by: ['kpiType'],
      where: {
        userId: userId.toValue(),
        period: { in: monthPeriodByBimonthlyPeriod(period) },
        kpiType: { in: [kpiType.SELL_OUT, kpiType.POSITIVATION, kpiType.URSINHOS] },
      },
      _sum: { goal: true, real: true },
    })

    return BimonthlyPerformanceDetails.create({
      performances: performances.map((performance) =>
        PerformanceDetails.create({
          goal: performance._sum.goal,
          real: performance._sum.real,
          kpiType: performance.kpiType as KpiType,
        }),
      ),
      userRole: (userInformations?.userRole as UserRole) || null,
      salesChannel: (userInformations?.salesChannel as SalesChannel) || null,
    })
  }

  async getBimonthlySellOutGoal(data: GetPerformanceProps): Promise<{ goal: number; salesChannel: SalesChannel }> {
    const { userId, period } = data
    const performance = await this.db.performance.aggregate({
      _sum: {
        goal: true,
      },
      where: {
        userId: userId.toValue(),
        period: { in: monthPeriodByBimonthlyPeriod(period) },
        kpiType: kpiType.SELL_OUT,
      },
    })

    const salesChannel = await this.db.performance.findFirst({
      where: {
        userId: userId.toValue(),
        period: { in: monthPeriodByBimonthlyPeriod(period) },
        kpiType: kpiType.SELL_OUT,
      },
      select: {
        salesChannel: true,
      },
    })

    return { goal: performance._sum.goal, salesChannel: (salesChannel.salesChannel as SalesChannel) || null }
  }

  async getManagerSemiannualPerformance(data: GetSemiannuallyPerformanceProps): Promise<SemiannualPerformanceDetails> {
    const { userId, period } = data

    const bimonthlyPeriods = bimonthlyPeriodBySemiannualPeriod(period)
    const bimonthlySellOutPerformances: Array<BimonthlyDetailsProps> = []

    for (const period of bimonthlyPeriods) {
      const bimonthlySellOutPerformance = await this.getBimonthlySellOutPerformance({
        userId,
        period,
      })

      bimonthlySellOutPerformances.push(bimonthlySellOutPerformance)
    }
    //TODO: FALTA IMPLEMENTAR LÓGICA DE ENGAJAMENTO DA EQUIPE, CONSULTAR AS REGRAS E QUAIS KPIS QUE CONTAM PARA ESSA INFORMAÇÃO
    return SemiannualPerformanceDetails.create({
      bimonthlySellOutPerformances: bimonthlySellOutPerformances,
      teamEngagement: [],
    })
  }

  async getTeamEngagement(data: GetTeamPerformanceProps): Promise<Array<TeamEngagementDetails>> {
    const { userId, period } = data

    const users = await this.db.performance.groupBy({
      by: ['userId'],
      where: {
        period: { in: period },
        OR: [{ supervisorId: userId.toValue() }, { managerId: userId.toValue() }],
      },
    })
    const results = await Promise.all(
      users.map(async (user) => {
        const userPerformances = await this.db.performance.findMany({
          where: {
            userId: user.userId,
            period: { in: period },
          },
          include: {
            user: true,
          },
        })

        const teamSizeSupervisor = await this.db.performance.count({
          where: {
            period: { in: period },
            supervisorId: user.userId,
          },
        })

        const teamSizeManager = await this.db.performance.count({
          where: {
            period: { in: period },
            managerId: user.userId,
          },
        })

        const userData = userPerformances[0]?.user

        return TeamEngagementDetails.create({
          performances: userPerformances.map((performance) => PerformanceMappers.toDetails(performance)),
          teamSize: teamSizeManager + teamSizeSupervisor,
          user: SimpleUserDetails.create({
            id: new UniqueEntityID(user.userId),
            role: (userData?.role as UserRole) || null,
            name: userData?.name || 'Unknown',
          }),
        })
      }),
    )

    return results
  }
}

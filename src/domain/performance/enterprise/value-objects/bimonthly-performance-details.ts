import { ValueObject } from '@root/core/domain/value-object'
import { salesChannel, SalesChannel, userRole, UserRole } from '@root/domain/authorization/enterprise/interfaces/user'
import { mapGroup } from '@root/shared/map-group'
import { getKpiCoverage, getTotalGoalByKpi, getTotalRealByKpi } from '@root/shared/performance-utils'

import { KpiStatus, kpiStatus } from '../entities/performance.entity'
import { PerformanceDetails } from './performance-details'

export const sellerScoreValueMap: Record<SalesChannel, Record<Group, Record<KpiType, number>>> = {
  RETAIL: {
    PLATINUM: {
      SELL_OUT: 450,
      POSITIVATION: 100,
      URSINHOS: 25,
    },
    GOLD: {
      SELL_OUT: 350,
      POSITIVATION: 100,
      URSINHOS: 25,
    },
    SILVER: {
      SELL_OUT: 150,
      POSITIVATION: 100,
      URSINHOS: 25,
    },
    BRONZE: {
      SELL_OUT: 75,
      POSITIVATION: 75,
      URSINHOS: 25,
    },
  },
  SM: {
    PLATINUM: {
      SELL_OUT: 650,
      POSITIVATION: 0,
      URSINHOS: 0,
    },
    GOLD: {
      SELL_OUT: 550,
      POSITIVATION: 0,
      URSINHOS: 0,
    },
    SILVER: {
      SELL_OUT: 400,
      POSITIVATION: 0,
      URSINHOS: 0,
    },
    BRONZE: {
      SELL_OUT: 300,
      POSITIVATION: 0,
      URSINHOS: 0,
    },
  },
} as const

export const supervisorOrManagerScoreValueMap: Record<SalesChannel, Record<UserRoleForMap, Record<KpiType, number>>> = {
  RETAIL: {
    MANAGER: {
      SELL_OUT: 800,
      POSITIVATION: 200,
      URSINHOS: 50,
    },
    SUPERVISOR: {
      SELL_OUT: 600,
      POSITIVATION: 200,
      URSINHOS: 50,
    },
  },
  SM: {
    MANAGER: {
      SELL_OUT: 1000,
      POSITIVATION: 0,
      URSINHOS: 0,
    },
    SUPERVISOR: {
      SELL_OUT: 800,
      POSITIVATION: 0,
      URSINHOS: 0,
    },
  },
} as const

export const group = {
  PLATINUM: 'PLATINUM',
  GOLD: 'GOLD',
  SILVER: 'SILVER',
  BRONZE: 'BRONZE',
} as const

export type Group = (typeof group)[keyof typeof group]

export const kpiType = {
  SELL_OUT: 'SELL_OUT',
  POSITIVATION: 'POSITIVATION',
  URSINHOS: 'URSINHOS',
} as const

export type KpiType = (typeof kpiType)[keyof typeof kpiType]

const userRoleForMap = {
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
} as const

type UserRoleForMap = (typeof userRoleForMap)[keyof typeof userRoleForMap]

type BimonthlyPerformanceDetailsProps = {
  performances: PerformanceDetails[]
  userRole: UserRole
  salesChannel?: SalesChannel
}

export class BimonthlyPerformanceDetails extends ValueObject<BimonthlyPerformanceDetailsProps> {
  get performances() {
    return this.props.performances
  }

  get salesChannel() {
    if (this.userRole === userRole.SELLER) return this.props.salesChannel
    else return this.positivationGoal() > 0 ? salesChannel.RETAIL : salesChannel.SM
  }

  get userRole() {
    return this.props.userRole
  }

  get status(): KpiStatus {
    return this.isSellOutHit() ? kpiStatus.HIT : kpiStatus.MISSED
  }

  get totalScore(): number {
    if (this.isSellOutHit()) {
      if (this.userRole === userRole.SELLER) {
        let totalScore =
          sellerScoreValueMap[this.salesChannel][
            mapGroup({ value: this.sellOutReal(), sallesChannel: this.salesChannel })
          ][kpiType.SELL_OUT]

        if (this.isPositivationHit()) {
          totalScore +=
            sellerScoreValueMap[this.salesChannel][
              mapGroup({ value: this.sellOutReal(), sallesChannel: this.salesChannel })
            ][kpiType.POSITIVATION]
        }

        if (this.isUrsinhosHit()) {
          totalScore +=
            sellerScoreValueMap[this.salesChannel][
              mapGroup({ value: this.sellOutReal(), sallesChannel: this.salesChannel })
            ][kpiType.URSINHOS]
        }

        return totalScore
      } else {
        let totalScore =
          supervisorOrManagerScoreValueMap[this.salesChannel][this.userRole as UserRoleForMap][kpiType.SELL_OUT]

        if (this.isPositivationHit()) {
          totalScore +=
            supervisorOrManagerScoreValueMap[this.salesChannel][this.userRole as UserRoleForMap][kpiType.POSITIVATION]
        }

        if (this.isUrsinhosHit()) {
          totalScore +=
            supervisorOrManagerScoreValueMap[this.salesChannel][this.userRole as UserRoleForMap][kpiType.URSINHOS]
        }

        return totalScore
      }
    }
    return 0
  }

  static create(props: BimonthlyPerformanceDetailsProps) {
    return new BimonthlyPerformanceDetails({
      performances: props.performances,
      userRole: props.userRole,
      salesChannel: props.salesChannel,
    })
  }

  private isSellOutHit(): boolean {
    return getKpiCoverage(kpiType.SELL_OUT, this.performances) >= 1 ? true : false
  }

  private isPositivationHit(): boolean {
    return getKpiCoverage(kpiType.POSITIVATION, this.performances) >= 1 ? true : false
  }

  private isUrsinhosHit(): boolean {
    return getKpiCoverage(kpiType.URSINHOS, this.performances) >= 1 ? true : false
  }

  private sellOutReal(): number {
    return getTotalRealByKpi(kpiType.SELL_OUT, this.performances)
  }

  private positivationGoal(): number {
    return getTotalGoalByKpi(kpiType.POSITIVATION, this.performances)
  }
}

import { ValueObject } from '@root/core/domain/value-object'
import { UserRole } from '@root/domain/authorization/enterprise/interfaces/user'

import { PerformanceDetails } from './performance-details'

export const acceleratorValuesForRole: Record<UserRoleForMap, number> = {
  MANAGER: 2,
  SUPERVISOR: 1.5,
  SELLER: 1,
}

const userRoleForMap = {
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  SELLER: 'SELLER',
} as const

type UserRoleForMap = (typeof userRoleForMap)[keyof typeof userRoleForMap]

type AcceleratorDetailsProps = {
  performances: PerformanceDetails[]
  teamSize: number
  userRole: UserRole
}

export class AcceleratorDetails extends ValueObject<AcceleratorDetailsProps> {
  get performances() {
    return this.props.performances
  }

  get totalGoal() {
    return this.performances.reduce((total, performance) => total + performance.goal, 0)
  }

  get userRole() {
    return this.props.userRole
  }

  get teamSize() {
    return this.props.teamSize
  }

  get totalReal(): number {
    const realPerformance = this.performances.reduce((total, performance) => total + performance.real, 0)
    if (this.userRole === userRoleForMap.SELLER) {
      return realPerformance || 0
    } else if (this.teamSize > 0) return realPerformance / this.teamSize || 0
    else return 0
  }

  get totalScore() {
    return this.totalReal * acceleratorValuesForRole[this.userRole as UserRoleForMap] || 0
  }

  static create(props: AcceleratorDetailsProps) {
    return new AcceleratorDetails({
      performances: props.performances,
      userRole: props.userRole,
      teamSize: props.teamSize,
    })
  }
}

import { TeamEngagementDetails } from '@root/domain/performance/enterprise/value-objects/team-engagement-details'

export class TeamEngagementViewModel {
  static toHttp(teamEngagement: TeamEngagementDetails) {
    return {
      user: {
        id: teamEngagement.user.id.toValue(),
        name: teamEngagement.user.name,
        role: teamEngagement.user.role,
      },
      teamSize: teamEngagement.teamSize,
      sellOut: {
        real: teamEngagement.sellOutReal,
        goal: teamEngagement.sellOutGoal,
        coverage: teamEngagement.sellOutoverage,
      },
      positivation: {
        real: teamEngagement.positivationReal,
        goal: teamEngagement.positivationGoal,
        coverage: teamEngagement.positivationCoverage,
      },
      status: teamEngagement.status,
    }
  }
}

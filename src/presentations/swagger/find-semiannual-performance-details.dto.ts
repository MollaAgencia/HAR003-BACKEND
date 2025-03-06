import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class FindSemiannualPerformanceParamsSwaggerDto {
  @ApiProperty({
    description: 'Period of the semiannual performance',
    example: 1,
  })
  @IsNumber()
  period: number
}

export const FindSemiannualPerformanceDetails = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Semiannual performance details retrieved successfully',
      type: FindSemiannualPerformanceDetailsResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({
      status: 400,
      description: 'Bad request',
      type: FindSemiannualPerformanceDetailsBadRequestSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 401, description: 'Unauthorized', type: FindSemiannualPerformanceDetailsUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class BimonthlyPerformanceDetails {
  @ApiProperty({
    description: 'Goal of the bimonthly performance',
    example: 500,
  })
  goal: number

  @ApiProperty({
    description: 'Real performance value',
    example: 450,
  })
  real: number

  @ApiProperty({
    description: 'Period of the bimonthly performance',
    example: 1,
  })
  period: number
}

class TeamEngagementDetails {
  @ApiProperty({
    description: 'Achievement percentage for the team engagement',
    example: 85,
  })
  achievement: number

  @ApiProperty({
    description: 'Period of the team engagement',
    example: 1,
  })
  period: number
}

class FindSemiannualPerformanceDetailsResponseSwaggerDto {
  @ApiProperty({ type: [BimonthlyPerformanceDetails] })
  bimonthlySellOutPerformances: Array<BimonthlyPerformanceDetails>

  @ApiProperty({ type: [TeamEngagementDetails] })
  teamEngagement: Array<TeamEngagementDetails>
}

class FindSemiannualPerformanceDetailsBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({
    default: 'BadRequestError | ResourceNotFoundError',
    enum: ['BadRequestError', 'ResourceNotFoundError'],
  })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class FindSemiannualPerformanceDetailsUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({ default: 401 })
  statusCode: number
}

import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

import { UserDto } from './entities/user.dto'

export class FindTeamEngagementParamsSwaggerDto {
  @ApiProperty({
    description: 'period of the performance',
    example: 1,
  })
  @IsNumber()
  period: number

  @ApiProperty({
    description: 'user of the team engagement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string
}

export const FindTeamEngagement = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'User found',
      type: FindTeamEngagementResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: FindTeamEngagementBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: FindTeamEngagementUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class User extends PickType(UserDto, ['id', 'name', 'role']) {}

export class FindTeamEngagementResponseSwaggerDto {
  @ApiProperty({ type: User })
  user: User

  @ApiProperty({ description: 'team size of the team engagement', example: 3 })
  teamSize: number

  @ApiProperty({ description: 'Total goal of the team engagement' })
  totalGoal: number

  @ApiProperty({
    description: 'Sell-out performance details',
    type: Object,
    properties: {
      real: { type: 'number' },
      goal: { type: 'number' },
      coverage: { type: 'number' },
    },
  })
  sellOut: {
    real: number
    goal: number
    coverage: number
  }

  @ApiProperty({
    description: 'Positivation performance details',
    type: Object,
    properties: {
      real: { type: 'number' },
      goal: { type: 'number' },
      coverage: { type: 'number' },
    },
  })
  positivation: {
    real: number
    goal: number
    coverage: number
  }

  @ApiProperty({ description: 'Status of the team engagement' })
  status: string
}

class FindTeamEngagementBadRequestSwaggerDto {
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

class FindTeamEngagementUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({ default: 401 })
  statusCode: number
}

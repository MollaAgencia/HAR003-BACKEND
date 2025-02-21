import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { PerformanceDto } from '@root/presentations/swagger/entities/performance.dto'
import { IsNumber } from 'class-validator'

export class FindPerformanceParamsSwaggerDto {
  @ApiProperty({
    description: 'period of the performance',
    example: 1,
  })
  @IsNumber()
  period: number
}

export const FindPerformanceDetails = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'User found',
      type: FindPerformanceDetailsResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: FindPerformanceDetailsBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: FindPerformanceDetailsUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class PerformanceDetails extends PickType(PerformanceDto, ['goal', 'real', 'coverage', 'kpiType', 'status']) {}

class FindPerformanceDetailsResponseSwaggerDto {
  @ApiProperty({ type: [PerformanceDetails] })
  performances: Array<PerformanceDetails>

  @ApiProperty({
    description: 'Score of the bimonthly performance',
    example: 450,
  })
  score: number

  @ApiProperty({
    description: 'Status of the performance',
    example: 'HIT',
  })
  status: string
}

class FindPerformanceDetailsBadRequestSwaggerDto {
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

class FindPerformanceDetailsUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({ default: 401 })
  statusCode: number
}

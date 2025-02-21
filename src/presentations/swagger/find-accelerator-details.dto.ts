import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class FindAcceleratorPerformanceParamsSwaggerDto {
  @ApiProperty({
    description: 'period of the performance',
    example: 1,
  })
  @IsNumber()
  period: number
}

export const FindAcceleratorPerformanceDetails = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'User found',
      type: FindAcceleratorResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: FindAcceleratorPerformanceBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: FindAcceleratorPerformanceUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class FindAcceleratorResponseSwaggerDto {
  @ApiProperty({
    description: 'Score of the bimonthly performance',
    example: 450,
  })
  boxesSold: number

  @ApiProperty({
    description: 'Score of the bimonthly performance',
    example: 450,
  })
  score: number
}

class FindAcceleratorPerformanceBadRequestSwaggerDto {
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

class FindAcceleratorPerformanceUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({ default: 401 })
  statusCode: number
}

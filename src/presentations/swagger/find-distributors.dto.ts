import { ApiProperty, ApiResponse } from '@nestjs/swagger'

import { DistributorDto } from './entities/distributor.dto'

export const SwaggerFindDistributorsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'User found',
      type: FindDistributorsResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: FindDistributorsBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: FindDistributorsUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class FindDistributorsResponseSwaggerDto {
  @ApiProperty({ type: [DistributorDto] })
  results: Array<DistributorDto>
}

class FindDistributorsBadRequestSwaggerDto {
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

class FindDistributorsUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({ default: 401 })
  statusCode: number
}

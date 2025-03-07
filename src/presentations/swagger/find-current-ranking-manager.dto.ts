import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { number } from 'zod'

import { SwaggerResourceNotFoundDto, SwaggerUnauthorizedDto } from './swagger.dto'

class GetCurrentRankingManagerResponseDto {
  @ApiProperty({ type: number, description: 'Rankings information' })
  position: number
}

export const SwaggerGetCurrentRankingManagerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Return a list of all the rankings for the specified group and type',
      type: GetCurrentRankingManagerResponseDto,
    })(target, key, descriptor)
    ApiResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    )
    ApiResponse({ status: 401, description: 'Unauthorized', type: SwaggerUnauthorizedDto })(target, key, descriptor)
  }
}

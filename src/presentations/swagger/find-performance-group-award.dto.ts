import { ApiResponse } from '@nestjs/swagger'

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto, SwaggerUnauthorizedDto } from './swagger.dto'

export const SwaggerFindPerformanceGroupDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      example: 'GOLD',
      description: 'Return performance group for the specified user',
      type: String,
    })(target, key, descriptor)
    ApiResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor)
    ApiResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    )
    ApiResponse({ status: 401, description: 'Unauthorized', type: SwaggerUnauthorizedDto })(target, key, descriptor)
  }
}

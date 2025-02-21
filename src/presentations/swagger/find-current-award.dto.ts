import { ApiResponse } from '@nestjs/swagger'

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto, SwaggerUnauthorizedDto } from './swagger.dto'

export const SwaggerFindCurrentAwardDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Return current award information for the specified user',
      type: Number,
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

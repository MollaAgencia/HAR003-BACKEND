import { ApiProperty, ApiResponse } from '@nestjs/swagger'

import {
  SwaggerBadRequestDto,
  SwaggerEmailBadFormattedDto,
  SwaggerInactiveResourceErrorDto,
  SwaggerResourceNotFoundDto,
} from './swagger.dto'

class ToggleUserStatusResponseDto {
  @ApiProperty({
    default: 'User status successfully toggle',
  })
  message: string
}

export const SwaggerToggleUserStatusDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({ status: 200, description: 'User status successfully toggled', type: ToggleUserStatusResponseDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({
      status: 400.1,
      description: `Inactive resource`,
      type: SwaggerInactiveResourceErrorDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400.2, description: 'Email bad formatted', type: SwaggerEmailBadFormattedDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 400.3, description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor)
  }
}

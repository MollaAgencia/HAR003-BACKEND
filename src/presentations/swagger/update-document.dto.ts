import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'

import { UserDto } from './entities/user.dto'
import { SwaggerBadRequestDto, SwaggerInactiveResourceErrorDto, SwaggerResourceNotFoundDto } from './swagger.dto'

export class UpdateDocumentBodyDto extends PickType(UserDto, ['document']) {}

class UpdateDocumentResponseDto {
  @ApiProperty({
    default: 'User successfully registered',
  })
  message: string
}

export const SwaggerUpdateDocumentDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({ status: 200, description: 'User successfully registered', type: UpdateDocumentResponseDto })(
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

    ApiResponse({ status: 400.3, description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor)
  }
}

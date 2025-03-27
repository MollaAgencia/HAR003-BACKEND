import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { UserDto } from '@root/presentations/swagger/entities/user.dto'

class MeResponseDto extends PickType(UserDto, ['name', 'email', 'telephone', 'role', 'document']) {}

export const MeSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'User found',
      type: MeResponseDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: MeRequestSwaggerDto })(target, key, descriptor)

    ApiResponse({ status: 401, description: 'Unauthorized', type: MeUnauthorizedSwaggerDto })(target, key, descriptor)

    ApiResponse({ status: 404, description: 'Resource not found', type: MeResourceNotFoundSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class MeRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({
    default: 'BadRequestError',
    enum: ['BadRequestError'],
  })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

export class MeUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized | InactiveResourceError', enum: ['Unauthorized', 'InactiveResourceError'] })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

export class MeResourceNotFoundSwaggerDto {
  @ApiProperty({ default: 'Resource not found' })
  message: string

  @ApiProperty({ default: 'ResourceNotFoundError', enum: ['ResourceNotFoundError'] })
  error: string

  @ApiProperty({
    default: 404,
  })
  statusCode: number
}

import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { UserDto } from '@root/presentations/swagger/entities/user.dto'

export class CheckUserDetailsQueryDto extends PickType(UserDto, ['email']) {}

export const CheckUserDetailsSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({ status: 200, description: 'User details', type: CheckUserDetailsResponseSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 400, description: 'Bad request', type: CheckUserDetailsBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 404, description: 'Resource not found', type: CheckUserDetailsNotFoundSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: CheckUserDetailsUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class CheckUserDetailsResponseSwaggerDto {
  @ApiProperty({
    description: `Indicates if it is the user's first access`,
    example: true,
  })
  firstAccess: boolean
}

class CheckUserDetailsBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({ default: 'BadRequestError', enum: ['BadRequestError'] })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class CheckUserDetailsUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'InactiveResourceError', enum: ['InactiveResourceError'] })
  error: string

  @ApiProperty({ default: 401 })
  statusCode: number
}

class CheckUserDetailsNotFoundSwaggerDto {
  @ApiProperty({ default: 'Resource not found' })
  message: string

  @ApiProperty({ default: 'ResourceNotFoundError', enum: ['ResourceNotFoundError'] })
  error: string

  @ApiProperty({ default: 404 })
  statusCode: number
}

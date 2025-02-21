import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { UserDto } from '@root/presentations/swagger/entities/user.dto'

export class ForgotPasswordBodySwaggerDto extends PickType(UserDto, ['email']) {}

export const ForgotPasswordSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Password recovery sent to your email',
      type: ForgotPasswordResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: ForgotPasswordBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: ForgotPasswordUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 404, description: `Resource not found`, type: ForgotPasswordNotFoundSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class ForgotPasswordResponseSwaggerDto {
  @ApiProperty({
    default: 'Password recovery sent to your email',
  })
  message: string
}

class ForgotPasswordBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({
    default: 'EmailBadFormattedError | BadRequestError',
    enum: ['EmailBadFormattedError', 'BadRequestError'],
  })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class ForgotPasswordUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized | InactiveResourceError', enum: ['Unauthorized', 'InactiveResourceError'] })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

class ForgotPasswordNotFoundSwaggerDto {
  @ApiProperty({ default: 'ResourceNotFoundError', enum: ['ResourceNotFoundError'] })
  message: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

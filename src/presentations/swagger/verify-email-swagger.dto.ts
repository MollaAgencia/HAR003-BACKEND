import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsCuid2 } from '@root/shared/is-cuid2'

export class VerifyEmailQueryDto {
  @ApiProperty({
    description: `Token`,
    example: 'yqji9uu7lr99x32zsffhem07',
    type: String,
  })
  @IsCuid2()
  token: string
}

class VerifyEmailResponseDto {
  @ApiProperty({
    default: 'This email has been verified',
  })
  message: string
}

export const SwaggerVerifyEmailDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'This email has been verified',
      type: VerifyEmailResponseDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: VerifyEmailBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: VerifyEmailUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class VerifyEmailBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({
    default:
      'InvalidVerificationEmailTokenError | ExpiredVerificationEmailTokenError | UserAlreadyVerificationEmailError |BadRequestError',
    enum: [
      'InvalidVerificationEmailTokenError',
      'ExpiredVerificationEmailTokenError',
      'UserAlreadyVerificationEmailError',
      'BadRequestError',
    ],
  })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class VerifyEmailUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'InactiveResourceError', enum: ['InactiveResourceError'] })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

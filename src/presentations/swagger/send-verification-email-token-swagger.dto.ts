import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

import { SwaggerResourceAlreadyExistsDto } from './swagger.dto'

export class SendVerificationEmailTokenBodySwaggerDto {
  @ApiProperty({
    description: `The user's email address`,
    example: 'user@gmail.com',
    type: String,
  })
  @IsEmail()
  email: string
}

export const SendVerificationEmailTokenSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Verification send to email address',
      type: SendVerificationEmailTokenResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: SendVerificationEmailTokenBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: SendVerificationEmailTokenUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 409, description: 'Resource already exists', type: SwaggerResourceAlreadyExistsDto })(
      target,
      key,
      descriptor,
    )
  }
}

class SendVerificationEmailTokenResponseSwaggerDto {
  @ApiProperty({
    default: 'Verification send to email address',
  })
  accessToken: string
}

class SendVerificationEmailTokenBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({
    default: 'EmailBadFormattedError | BadRequestError | UserAlreadyVerificationEmailError',
    enum: ['EmailBadFormattedError', 'BadRequestError', 'UserAlreadyVerificationEmailError'],
  })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class SendVerificationEmailTokenUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({
    default: 'Unauthorized | WrongCredentialsError | InactiveResourceError',
    enum: ['Unauthorized', 'WrongCredentialsError', 'InactiveResourceError'],
  })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

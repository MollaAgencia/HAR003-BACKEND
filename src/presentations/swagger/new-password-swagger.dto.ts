import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsCuid2 } from '@root/shared/is-cuid2'
import { IsString } from 'class-validator'

export class NewPasswordBodySwaggerDto {
  @ApiProperty({
    description: `The user's new password`,
    example: 'strongPassword123#',
    type: String,
  })
  @IsString()
  newPassword: string
}

export class NewPasswordQueryDto {
  @ApiProperty({
    description: 'Token',
    example: 'trcs7qahx2fsufyahgq2leep',
    type: String,
  })
  @IsCuid2()
  token: string
}

export const NewPasswordSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Password successfully updated',
      type: NewPasswordResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: NewPasswordBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: NewPasswordUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class NewPasswordResponseSwaggerDto {
  @ApiProperty({
    default: 'Password successfully updated',
  })
  message: string
}

class NewPasswordBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({
    default: 'InvalidPasswordResetTokenError | ExpiredPasswordResetTokenError | BadRequestError',
    enum: ['InvalidPasswordResetTokenError', 'ExpiredPasswordResetTokenError', 'BadRequestError'],
  })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

export class NewPasswordUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized ', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

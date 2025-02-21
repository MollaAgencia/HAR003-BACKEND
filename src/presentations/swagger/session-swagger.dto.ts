import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { UserDto } from '@root/presentations/swagger/entities/user.dto'
import { IsString } from 'class-validator'

export class SessionBodySwaggerDto extends PickType(UserDto, ['email']) {
  @ApiProperty({
    description: 'Password for the user account',
    example: 'password123',
  })
  @IsString()
  password: string
}

export const SessionSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({ status: 200, description: 'Access token', type: SessionResponseSwaggerDto })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: SessionBadRequestSwaggerDto })(target, key, descriptor)

    ApiResponse({ status: 401, description: 'Unauthorized', type: SessionUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class SessionResponseSwaggerDto {
  @ApiProperty({
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL2NhbGFuZGFyL3YxLyIsInN1YiI6InVzcl8xMjMiLCJpYXQiOjE0NTg3ODU3OTYsImV4cCI6MTQ1ODg3MjE5Nn0',
  })
  accessToken: string
}

class SessionBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({
    default: 'EmailNotVerifiedError | BadRequestError',
    enum: ['EmailNotVerifiedError', 'BadRequestError'],
  })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class SessionUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({
    default: 'InactiveResourceError | WrongCredentialsError',
    enum: ['InactiveResourceError', 'WrongCredentialsError'],
  })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

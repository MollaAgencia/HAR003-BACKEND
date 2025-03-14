import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { UserDto } from '@root/presentations/swagger/entities/user.dto'
import { IsString } from 'class-validator'

export class RegisterUserBodySwaggerDto extends PickType(UserDto, ['email', 'telephone']) {
  @ApiProperty({
    description: 'User password',
    example: 'password123',
    type: String,
  })
  @IsString()
  password: string
}

export const RegisterUserSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({ status: 200, description: 'User successfully registered', type: RegisterUserResponseSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 400, description: 'Bad request', type: RegisterUserBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: RegisterUserUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 403, description: 'Conclict', type: RegisterUserConflictSwaggerDto })(target, key, descriptor)

    ApiResponse({ status: 404, description: 'Resource not found', type: RegisterUserNotFoundSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class RegisterUserResponseSwaggerDto {
  @ApiProperty({
    default: 'User successfully registered',
  })
  message: string
}

class RegisterUserBadRequestSwaggerDto {
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

class RegisterUserUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'InactiveResourceError', enum: ['InactiveResourceError'] })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

class RegisterUserConflictSwaggerDto {
  @ApiProperty({ default: 'Resource already exists' })
  message: string

  @ApiProperty({ default: 'ResourceAlreadyExistsError', enum: ['ResourceAlreadyExistsError'] })
  error: string

  @ApiProperty({
    default: 404,
  })
  statusCode: number
}

class RegisterUserNotFoundSwaggerDto {
  @ApiProperty({ default: 'Resource not found' })
  message: string

  @ApiProperty({ default: 'ResourceNotFoundError', enum: ['ResourceNotFoundError'] })
  error: string

  @ApiProperty({
    default: 404,
  })
  statusCode: number
}

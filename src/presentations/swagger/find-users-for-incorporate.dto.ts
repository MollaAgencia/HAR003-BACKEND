import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { UserDto } from '@root/presentations/swagger/entities/user.dto'
class UserForIncorporateDto extends PickType(UserDto, ['id', 'name', 'role']) {}

export const FindUsersForIncorporateSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Users for incorporate',
      type: FindUsersForIncorporateResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: FindUsersForIncorporateBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: FindUsersForIncorporateUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class FindUsersForIncorporateResponseSwaggerDto {
  @ApiProperty({
    type: [UserForIncorporateDto],
  })
  results: Array<UserForIncorporateDto>
}

class FindUsersForIncorporateBadRequestSwaggerDto {
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

class FindUsersForIncorporateUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized | NotAllowedError', enum: ['Unauthorized', 'NotAllowedError'] })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

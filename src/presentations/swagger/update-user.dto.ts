import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'

import { UserDto } from './entities/user.dto'
import {
  SwaggerBadRequestDto,
  SwaggerEmailBadFormattedDto,
  SwaggerInactiveResourceErrorDto,
  SwaggerResourceNotFoundDto,
} from './swagger.dto'

enum SalesChannel {
  SM = 'SM',
  RETAIL = 'RETAIL',
}

enum Region {
  N = 'NORTE',
  S = 'SUL',
  L = 'LESTE',
  O = 'OESTE',
  NE = 'NORDESTE',
  SE = 'SUDESTE',
  SO = 'SUDOESTE',
  NO = 'NOROESTE',
  CO = 'CENTRO_OESTE',
}

export class UpdateUserBodyDto extends PickType(UserDto, ['email', 'name', 'telephone', 'role', 'document', 'id']) {
  @ApiProperty({
    description: 'external distributor id of the user',
    example: '1234',
  })
  @IsString()
  distributorId: string

  @ApiProperty({
    description: 'sales channel of the user',
    enum: SalesChannel,
  })
  @IsEnum(SalesChannel)
  salesChannel: SalesChannel

  @ApiProperty({
    description: 'region of the user',
    enum: Region,
  })
  @IsEnum(Region)
  region: Region
}

class UpdateUserResponseDto {
  @ApiProperty({
    default: 'User successfully registered',
  })
  message: string
}

export const SwaggerUpdateUserDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({ status: 200, description: 'User successfully registered', type: UpdateUserResponseDto })(
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

    ApiResponse({ status: 400.2, description: 'Email bad formatted', type: SwaggerEmailBadFormattedDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 400.3, description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor)
  }
}

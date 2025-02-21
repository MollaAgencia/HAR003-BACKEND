import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

import { UserDto } from './entities/user.dto'
import { ApiPaginatedResponse } from './pagination.dto'
import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerUnauthorizedDto } from './swagger.dto'

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class UserForManagementDto extends PickType(UserDto, [
  'id',
  'name',
  'email',
  'document',
  'telephone',
  'role',
  'region',
  'salesChannel',
  'distributorId',
]) {
  @ApiProperty({
    description: 'Status of the user',
    enum: UserStatus,
  })
  @IsEnum(UserStatus)
  status: UserStatus
}

export class QueryUserForManagementDto {
  @ApiProperty({
    description: 'Number page of users list',
    example: '1',
  })
  @IsNumber()
  pageIndex?: number

  @ApiProperty({
    description: 'Status of the user',
    enum: UserStatus,
    required: false,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus

  @ApiProperty({
    description: 'Filter users list by name',
    example: 'Vitor',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'Filter users list by document',
    example: '23333355503',
    required: false,
  })
  @IsString()
  @IsOptional()
  document?: string
}

export const SwaggerFindUsersForManagementDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiPaginatedResponse(UserForManagementDto)(target, key, descriptor)
    ApiResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor)
    ApiResponse({ status: 403, description: 'Not allowed', type: SwaggerNotAllowedDto })(target, key, descriptor)
    ApiResponse({ status: 401, description: 'Unauthorized', type: SwaggerUnauthorizedDto })(target, key, descriptor)
  }
}

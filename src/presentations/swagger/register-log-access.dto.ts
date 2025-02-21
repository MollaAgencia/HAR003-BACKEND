import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateLogAccessBodyDto {
  @ApiProperty({
    description: 'Page number or identifier',
    type: String,
  })
  @IsString()
  page: string
}

class CreateLogAccessResponseDto {
  @ApiProperty({
    default: 'Success in creating access',
  })
  message: boolean
}

export const CreateLogAccessSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Success in creating access',
      type: CreateLogAccessResponseDto,
    })(target, key, descriptor)
    ApiResponse({ status: 400, description: 'Bad request', type: CreateLogAccessBadRequestDto })(
      target,
      key,
      descriptor,
    )
    ApiResponse({ status: 401, description: 'Unauthorized', type: CreateLogAccessUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class CreateLogAccessBadRequestDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({ default: 'BadRequestError', enum: ['BadRequestError'] })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class CreateLogAccessUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

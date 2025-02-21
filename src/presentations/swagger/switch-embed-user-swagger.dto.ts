import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsString } from 'class-validator'

import { ResourceNotFoundSwaggerDto } from './swagger.dto'

export class SwitchEmbedUserBodySwaggerDto {
  @ApiProperty({
    description: 'Embed user id',
    example: 'b5r43wtsjs8v1wcq5x81ykfp',
    type: String,
  })
  @IsString()
  embedId: string
}

export const SwaggerSwitchEmbedUserDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({ status: 200, description: 'Switch embed user', type: SwitchEmbedUserResponseSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 400, description: 'Bad request', type: SwitchEmbedUserBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: SwitchEmbedUserUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 404, description: 'Resource not found', type: SwitchEmbedUserNotFoundSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

class SwitchEmbedUserResponseSwaggerDto {
  @ApiProperty({
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL2NhbGFuZGFyL3YxLyIsInN1YiI6InVzcl8xMjMiLCJpYXQiOjE0NTg3ODU3OTYsImV4cCI6MTQ1ODg3MjE5Nn0',
  })
  accessToken: string
}

class SwitchEmbedUserBadRequestSwaggerDto {
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

class SwitchEmbedUserUnauthorizedSwaggerDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({
    default: 'Unauthorized | NotAllowedError',
    enum: ['Unauthorized', 'NotAllowedError'],
  })
  error: string

  @ApiProperty({
    default: 401,
  })
  statusCode: number
}

class SwitchEmbedUserNotFoundSwaggerDto {
  @ApiProperty({ default: 'Resource not found' })
  message: string

  @ApiProperty({ default: 'ResourceNotFoundError', enum: ['ResourceNotFoundError'] })
  error: string

  @ApiProperty({
    default: 404,
  })
  statusCode: number
}

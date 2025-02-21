import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'

export class UploadBodySwaggerDto {
  @ApiProperty({
    description: 'ImageEntity library name',
    example: 'image.png',
  })
  @IsString()
  @Matches(/\.(png|jpg|jpeg|webp|pdf)$/i, {
    message: 'The library must have one of the following extensions: png, jpg, jpeg, webp e pdf',
  })
  fileName: string

  @ApiProperty({
    description: 'ImageEntity library type',
    example: 'image/png',
  })
  @IsString()
  fileType: string
}

class UploadResponseSwaggerDto {
  @ApiProperty({
    default: 'https://bucket.s3.amazonaws.com/image.png',
  })
  url: string

  @ApiProperty({
    default: 'https://bucket.s3.amazonaws.com/image.png',
  })
  signedUrl: string
}

export const UploadSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Success to upload a library to bucket',
      type: UploadResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: UploadBadRequestDto })(target, key, descriptor)

    ApiResponse({ status: 401, description: 'Unauthorized', type: UploadUnauthorizedSwaggerDto })(
      target,
      key,
      descriptor,
    )
  }
}

export class UploadBadRequestDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({ default: 'BadRequestError | InvalidFileTypeError', enum: ['BadRequestError', 'InvalidFileTypeError'] })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class UploadUnauthorizedSwaggerDto {
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

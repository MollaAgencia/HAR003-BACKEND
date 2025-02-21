import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'
import { SacDto } from '@root/presentations/swagger/entities/sac.dto'

export class SendEmailBodySwaggerDto extends PickType(SacDto, ['email', 'message', 'name', 'telephone', 'subject']) {}

class SendSacResponseDto {
  @ApiProperty({
    default: 'Success in sending the message',
  })
  message: boolean
}

export const SendSacSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Success in sending the message',
      type: SendSacResponseDto,
    })(target, key, descriptor)
    ApiResponse({ status: 400, description: 'Bad request', type: SendSacBadRequestDto })(target, key, descriptor)
  }
}

class SendSacBadRequestDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({ default: 'BadRequestError | EmailNotSendError', enum: ['BadRequestError', 'EmailNotSendError'] })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

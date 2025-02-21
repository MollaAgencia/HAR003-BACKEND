import { ApiProperty, ApiResponse } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindAcceptedCampaignRegulationParamsSwaggerDto {
  @ApiProperty({
    description: 'User id',
    example: 'e4eaaaf2-d142-11e1-b3e4-080027620cdd',
  })
  @IsString()
  campaignId: string
}

export const FindAcceptedCampaignRegulationSwaggerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Campaigns found',
      type: FindAcceptedCampaignRegulationResponseSwaggerDto,
    })(target, key, descriptor)

    ApiResponse({ status: 400, description: 'Bad request', type: FindAcceptedCampaignRegulationBadRequestSwaggerDto })(
      target,
      key,
      descriptor,
    )

    ApiResponse({ status: 401, description: 'Unauthorized', type: FindAcceptedCampaignRegulationUnauthorizedDto })(
      target,
      key,
      descriptor,
    )
  }
}

class FindAcceptedCampaign {
  @ApiProperty({
    type: Boolean,
  })
  isAccepted: boolean
}

class FindAcceptedCampaignRegulationResponseSwaggerDto {
  @ApiProperty({
    type: FindAcceptedCampaign,
  })
  result: FindAcceptedCampaign
}

class FindAcceptedCampaignRegulationBadRequestSwaggerDto {
  @ApiProperty({ default: 'Bad request' })
  message: string

  @ApiProperty({ default: 'BadRequestError', enum: ['BadRequestError'] })
  error: string

  @ApiProperty({ default: 400 })
  statusCode: number
}

class FindAcceptedCampaignRegulationUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string

  @ApiProperty({ default: 'Unauthorized', enum: ['Unauthorized'] })
  error: string

  @ApiProperty({ default: 401 })
  statusCode: number
}

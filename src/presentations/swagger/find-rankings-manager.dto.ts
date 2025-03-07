import { ApiProperty, ApiResponse, PickType } from '@nestjs/swagger'

import { RankingManagerDto } from './entities/ranking-manager.dto'
import { SwaggerResourceNotFoundDto, SwaggerUnauthorizedDto } from './swagger.dto'

export class GetRankingsQueryDto extends PickType(RankingManagerDto, ['period']) {}
export class GetRankingsResponseDto extends PickType(RankingManagerDto, [
  'id',
  'userId',
  'userName',
  'position',
  'status',
  'score',
]) {}

class GetRankingsManagerResponseDto {
  @ApiProperty({ type: [GetRankingsResponseDto], description: 'Rankings information' })
  rankings: GetRankingsResponseDto[]
}

export const SwaggerGetRankingsManagerDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiResponse({
      status: 200,
      description: 'Return a list of all the rankings for the specified group and type',
      type: GetRankingsManagerResponseDto,
    })(target, key, descriptor)
    ApiResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    )
    ApiResponse({ status: 401, description: 'Unauthorized', type: SwaggerUnauthorizedDto })(target, key, descriptor)
  }
}

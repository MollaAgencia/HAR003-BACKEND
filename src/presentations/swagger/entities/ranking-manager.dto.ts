import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export enum RankingStatus {
  LOSER = 'LOSER',
  AWARD_ZONE = 'AWARD_ZONE',
  WINNER = 'WINNER',
}
export class RankingManagerDto {
  @ApiProperty({
    description: 'User name with the ranking',
    example: 'Vitor',
  })
  @IsString()
  userName: string

  @ApiProperty({
    description: 'Period of the ranking',
    example: 1,
  })
  @IsNumber()
  period: number

  @ApiProperty({
    description: 'Position in the ranking',
    example: 1,
  })
  @IsNumber()
  position: number

  @ApiProperty({
    description: 'Score in the ranking',
    example: 95.5,
  })
  @IsNumber()
  score: number

  @ApiProperty({
    description: 'Status of the ranking',
    enum: RankingStatus,
    example: RankingStatus.WINNER,
  })
  @IsEnum(RankingStatus)
  status: RankingStatus

  @ApiProperty({
    description: 'Region of the ranking (optional)',
    example: 'South America',
    required: false,
  })
  @IsOptional()
  @IsString()
  region?: string

  @ApiProperty({
    description: 'Creation date of the ranking in milliseconds since the Unix epoch',
    example: '1719691926222',
  })
  @IsNumber()
  createdAt: number

  @ApiProperty({
    description: 'Update date of the ranking in milliseconds since the Unix epoch or null if not updated',
    example: '1719691926222',
  })
  @IsNumber()
  updatedAt: number
}

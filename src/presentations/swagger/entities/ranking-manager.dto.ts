import { ApiProperty } from '@nestjs/swagger'
import { IsCuid2 } from '@root/shared/is-cuid2'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export enum RankingStatus {
  LOSER = 'LOSER',
  AWARD_ZONE = 'AWARD_ZONE',
  WINNER = 'WINNER',
}
export class RankingManagerDto {
  @ApiProperty({
    description: 'Unique identifier of the ranking',
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsCuid2()
  id: string

  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsCuid2()
  userId: string

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

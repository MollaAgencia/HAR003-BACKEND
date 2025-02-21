import { ApiProperty } from '@nestjs/swagger'
import { Type } from '@root/domain/award/enterprise/entities/award.entity'

import { UniqueEntityID } from '@core/domain/unique-entity-id'

export class AwardDto {
  @ApiProperty({ description: 'Identificador do distribuidor' })
  userId: UniqueEntityID

  @ApiProperty({ description: 'Período do prêmio' })
  period: number

  @ApiProperty({
    enum: ['SELL_OUT', 'URSINHOS', 'ACCELERATOR', 'POSITIVATION'],
    description: 'Tipo de prêmio',
  })
  type: Type

  @ApiProperty({ description: 'Meta do prêmio' })
  goal: number

  @ApiProperty({ description: 'Motivo do prêmio' })
  reason: string

  @ApiProperty({ description: 'Data de criação do prêmio' })
  createdAt: Date

  @ApiProperty({ description: 'Data de atualização do prêmio', nullable: true })
  updatedAt?: Date

  @ApiProperty({ description: 'Descrição do prêmio', nullable: true })
  description?: string
}

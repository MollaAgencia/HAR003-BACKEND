import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class DistributorDto {
  @ApiProperty({
    description: 'ID of the distributor',
    type: String,
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsString()
  id: string

  @ApiProperty({
    description: 'Name of the distributor',
    type: String,
    example: 'Distributor 1',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: 'External distributor ID',
    type: String,
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsString()
  externalId: string
}

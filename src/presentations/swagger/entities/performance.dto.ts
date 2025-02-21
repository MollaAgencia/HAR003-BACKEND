import { ApiProperty } from '@nestjs/swagger'
import { IsCuid2 } from '@root/shared/is-cuid2'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

enum KpiType {
  SELL_OUT = 'SELL_OUT',
  POSITIVATION = 'POSITIVATION',
  URSINHOS = 'URSINHOS',
  ACCELERATOR = 'ACCELERATOR',
}

enum KpiStatus {
  HIT = 'HIT',
  MISSED = 'MISSED',
}

export class PerformanceDto {
  @ApiProperty({
    description: 'ID of the performance',
    type: String,
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsString()
  id: string

  @ApiProperty({
    description: 'Goal of the performance',
    example: 10,
  })
  @IsNumber()
  goal: number

  @ApiProperty({
    description: 'Real of the performance',
    example: 10,
  })
  @IsNumber()
  real: number

  @ApiProperty({
    description: 'Coverage of the performance',
    example: 100,
  })
  @IsNumber()
  coverage: number

  @ApiProperty({
    description: 'Period of the performance',
    example: 202401,
  })
  @IsNumber()
  period: number

  @ApiProperty({
    description: 'KPI Type for the performance',
    enum: KpiType,
    example: KpiType.SELL_OUT,
  })
  @IsEnum(KpiType)
  kpiType: KpiType

  @ApiProperty({
    description: 'Status of the performance',
    enum: KpiStatus,
    example: KpiStatus.HIT,
  })
  @IsEnum(KpiStatus)
  status: KpiStatus

  @ApiProperty({
    description: 'Sales Channel of the performance',
    example: 'Retail',
  })
  @IsString()
  salesChannel: string

  @ApiProperty({
    description: 'Distributor ID for the performance',
    type: String,
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsString()
  distributorId: string

  @ApiProperty({
    description: 'User role for the performance',
    example: 'SUPERVISOR',
  })
  @IsString()
  userRole: string

  @ApiProperty({
    description: 'User ID related to the performance, if applicable',
    type: String,
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsOptional()
  @IsString()
  userId?: string

  @ApiProperty({
    description: 'Supervisor ID related to the performance, if applicable',
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsOptional()
  @IsCuid2()
  supervisorId?: string

  @ApiProperty({
    description: 'Manager ID related to the performance, if applicable',
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsOptional()
  @IsCuid2()
  managerId?: string

  @ApiProperty({
    description: 'External user ID related to the performance, if applicable',
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsOptional()
  @IsCuid2()
  externalUserId?: string

  @ApiProperty({
    description: 'Creation date of the performance in milliseconds since the Unix epoch',
    example: '1719691926222',
  })
  @IsNumber()
  createdAt: number

  @ApiProperty({
    description: 'Update date of the performance in milliseconds since the Unix epoch or null if not updated',
    example: '1719691926222',
  })
  @IsOptional()
  @IsNumber()
  updatedAt?: number
}

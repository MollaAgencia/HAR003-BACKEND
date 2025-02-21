import { ApiProperty } from '@nestjs/swagger'
import { IsCuid2 } from '@root/shared/is-cuid2'
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

enum Role {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  DISTRIBUTOR = 'DISTRIBUTOR',
  MANAGER = 'MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  SELLER = 'SELLER',
}

enum Region {
  N = 'NORTE',
  S = 'SUL',
  L = 'LESTE',
  O = 'OESTE',
  NE = 'NORDESTE',
  SE = 'SUDESTE',
  SO = 'SUDOESTE',
  NO = 'NOROESTE',
}

enum SalesChannel {
  SM = 'SM',
  RETAIL = 'RETAIL',
}

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'tz4a98xxat96iws9zmbrgj3a',
  })
  @IsCuid2()
  id: string

  @ApiProperty({
    description: 'distributor identifier of the user',
    example: '123456789',
  })
  @IsString()
  distributorId: string

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johnDoe@hotmail.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Document of the user',
    example: '12345678900',
  })
  @IsString()
  document: string

  @ApiProperty({
    description: 'Email Verified of the user in milliseconds since the Unix epoch or null if not verified',
    example: '1719691926222',
  })
  @IsNumber()
  @IsOptional()
  emailVerified?: number

  @ApiProperty({
    description: 'Telephone number of the user',
    example: '99999999999',
  })
  @IsString()
  telephone: string

  @ApiProperty({
    description: 'Role of the user',
    enum: Role,
  })
  @IsEnum(Role)
  role: Role

  @ApiProperty({
    description: 'Sales channel of the user',
    enum: SalesChannel,
  })
  @IsEnum(SalesChannel)
  salesChannel: SalesChannel

  @ApiProperty({
    description: 'Region of the user',
    enum: Region,
  })
  @IsEnum(Region)
  region: Region

  @ApiProperty({
    description: 'Indicates if two-factor authentication is enabled for the user',
    example: true,
  })
  @IsBoolean()
  isTwoFactorEnabled: boolean

  @ApiProperty({
    description: 'Indicates if the user is disabled in milliseconds since the Unix epoch or null if not disabled',
    example: '1719691926222',
  })
  @IsNumber()
  @IsOptional()
  disabled?: number

  @ApiProperty({
    description: 'Creation date of the user in milliseconds since the Unix epoch',
    example: '1719691926222',
  })
  @IsNumber()
  createdAt: number

  @ApiProperty({
    description: 'Update date of the user in milliseconds since the Unix epoch or null if not updated',
    example: '1719691926222',
  })
  @IsNumber()
  updatedAt: number
}

import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsString } from 'class-validator'

export class SacDto {
  @ApiProperty({
    description: "The sender's name",
    example: 'John Doe',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: "The sender's email address",
    example: 'example@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: "The sender's phone number",
    example: '5511999999999',
  })
  @IsString()
  telephone: string

  @ApiProperty({
    description: 'The subject of the message',
    example: 'Inquiry about services',
  })
  @IsString()
  subject: string

  @ApiProperty({
    description: 'The content of the message',
    example: 'I would like to know more about your services.',
  })
  @IsString()
  message: string

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

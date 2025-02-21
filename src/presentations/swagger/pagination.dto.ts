import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

class MetaDto {
  @ApiProperty({
    description: 'Page index',
    type: Number,
    example: 1,
  })
  pageIndex: number

  @ApiProperty({
    description: 'Total itens per page',
    type: Number,
    example: 10,
  })
  perPage: number

  @ApiProperty({
    description: 'Total itens found in database',
    type: Number,
    example: 1,
  })
  totalCount: number
}

class PaginatedDto<TData> {
  @ApiProperty({
    description: 'Metadata of the data found',
    type: MetaDto,
  })
  meta: MetaDto

  results: TData[]
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, model),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  )
}

export class PaginationDto {
  @ApiProperty({
    description: 'Page index for pagination',
    type: Number,
    example: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pageIndex?: number = 0

  @ApiProperty({
    description: 'Limit for pagination',
    type: Number,
    default: 20,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit?: number = 20
}

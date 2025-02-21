// import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Query } from '@nestjs/common'
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
// import { GetSemiannualPerformanceUseCase } from '@root/domain/performance/applications/use-cases/bimonthly-performance.use-case'
// import { CurrentUser } from '@root/presentations/auth/current-user-decorator'
// import { UserPayload } from '@root/presentations/auth/jwt.strategy'
// import {
//   FindPerformanceDetails,
//   FindPerformanceParamsSwaggerDto,
// } from '@root/presentations/swagger/find-performance-details.dto'
// import { SemiannualPerformanceViewModel } from '@root/presentations/view-model/bimonthly-performance.view-model'

// import { UniqueEntityID } from '@core/domain/unique-entity-id'
// import { ResourceNotFoundError } from '@core/errors/errors/resource-not-found-error'

// @ApiTags('Performance')
// @ApiBearerAuth()
// @Controller({ path: '/performance', version: '1' })
// export class SemiannualPerformanceController {
//   constructor(private bimonthlyPerformance: GetSemiannualPerformanceUseCase) {}

//   @Get('/bimonthly')
//   @HttpCode(200)
//   @FindPerformanceDetails()
//   async handle(@CurrentUser() user: UserPayload, @Query() query: FindPerformanceParamsSwaggerDto) {
//     const { embed } = user
//     const { period } = query

//     const result = await this.bimonthlyPerformance.execute({
//       userId: new UniqueEntityID(embed),
//       period,
//     })

//     if (result.isLeft()) {
//       const error = result.value
//       switch (error.constructor) {
//         case ResourceNotFoundError:
//           throw new NotFoundException(error.message, {
//             description: error.name,
//           })

//         default:
//           throw new BadRequestException('Bad request', {
//             description: 'BadRequestError',
//           })
//       }
//     }

//     return SemiannualPerformanceViewModel.toHttp(result.value)
//   }
// }

import { Controller, Get } from '@nestjs/common'
import { Public } from '@root/presentations/auth/public'

@Public()
@Controller({ version: '1' })
export class HealthzController {
  constructor() {}

  @Get('/healthz')
  getHello(): string {
    return 'App is running'
  }
}

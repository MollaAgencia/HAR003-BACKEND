import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { EnvService } from '@infra/env/env.service'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly env: EnvService) {
    super({
      datasources: {
        db: {
          url: env.get('DATABASE_URL'),
        },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}

import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvService } from '@root/infra/env/env.service'
import { UserDto } from '@root/presentations/swagger/entities/user.dto'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })
  app.enableCors()

  const config = new DocumentBuilder().addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [UserDto],
  })
  SwaggerModule.setup('swagger', app, document, {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          name: '1. API',
          url: '/swagger/api-json',
        },
      ],
    },
    jsonDocumentUrl: 'swagger/api-json',
  })

  const configService = app.get(EnvService)
  const PORT = configService.get('PORT')
  const SERVICE = configService.get('SERVICE')
  const VERSION = configService.get('VERSION')

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.listen(PORT, () => {
    console.log(`${SERVICE} - ${VERSION} - Listening on port ${PORT}`)
  })
}

bootstrap()

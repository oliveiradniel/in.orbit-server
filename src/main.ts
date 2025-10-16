import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';

import { getConfig } from './shared/config/config.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configService = getConfig(app.get(ConfigService));

  const ORIGIN = configService.FRONTEND_ORIGIN;
  const PORT = configService.PORT;
  const HOST = configService.HOST;

  app.enableCors({
    ORIGIN,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('InOrbit API')
        .setDescription('API for goals control.')
        .setVersion('1.0')
        .addBearerAuth({
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        })
        .build(),
    ),
    {
      jsonDocumentUrl: 'swagger/json',
    },
  );

  await app.listen(PORT, HOST);
}

void bootstrap();

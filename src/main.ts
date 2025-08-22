import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { getConfig } from './shared/config/config.helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = getConfig(app.get(ConfigService));

  const origin = configService.FRONTEND_ORIGIN;

  app.enableCors({
    origin,
  });

  app.useGlobalPipes(new ValidationPipe());

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('InOrbit API')
        .setDescription('API for goals control.')
        .setVersion('1.0')
        .build(),
    ),
    {
      jsonDocumentUrl: 'swagger/json',
    },
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { collectDefaultMetrics } from 'prom-client'
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  collectDefaultMetrics();

    // bind pino as Nest logger
  app.useLogger(app.get(Logger))

  // Swagger only outside production (ya always—your call)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Hybrid API')
      .setDescription('NestJS + Prisma + MinIO demo')
      .setVersion('1.0')
      .addBearerAuth() // Authorization: Bearer <token>
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    console.log('Swagger UI: http://localhost:' + (process.env.API_PORT || 4000) + '/docs');
  }

  if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
}

  await app.listen(process.env.API_PORT || 4000);
  console.log(`API running on http://localhost:${process.env.API_PORT || 4000}`);
}
bootstrap();

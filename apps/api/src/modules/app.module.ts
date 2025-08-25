
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { HealthController } from './health.controller';
import { LoggerModule } from 'nestjs-pino';
import { MatricsModule } from './metrics/metrics.module';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty', options: { singleLine: true } },
        
      },
        // optional: request id
     
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env', '../../.env'],
      // Try specific env first, then fall back:
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    StorageModule,
    MatricsModule
  ],
  controllers: [HealthController],
})
export class AppModule {}

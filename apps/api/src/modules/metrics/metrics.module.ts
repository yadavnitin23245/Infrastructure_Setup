
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
//import { AuthService } from './auth.service';
import { MetricsController } from './metrics.controller';

@Module({
  //providers: [AuthService],
  controllers: [MetricsController],
})
export class MatricsModule {}

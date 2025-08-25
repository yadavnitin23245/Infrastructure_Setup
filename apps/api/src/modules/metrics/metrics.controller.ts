import { Controller, Get } from '@nestjs/common';
import { register } from 'prom-client';
@Controller()
export class MetricsController {
  @Get('metrics') async metrics() { return register.metrics(); }
}

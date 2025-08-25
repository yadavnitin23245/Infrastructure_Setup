
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
@Controller()
export class HealthController {
  @Get('health') health() { return { ok: true, ts: new Date().toISOString() }; }

  
  @UseGuards(JwtAuthGuard)
  @Get('me') me(@Req() req: any) { return req.user; }

  
  @Get('debug-sentry') debugSentry() {
    throw new Error('Sentry test error'); // open /debug-sentry once → event should appear in Sentry
  }
}

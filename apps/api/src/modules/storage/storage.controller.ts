import { Controller, Get, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiTags, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private svc: StorageService) {}

  @ApiQuery({ name: 'key', example: 'demo.txt' })
  @ApiQuery({ name: 'contentType', required: false, example: 'text/plain' })
  @ApiOkResponse({ description: 'Pre-signed PUT URL (string)' })
  @Get('signed-put-url')
  getPutUrl(@Query('key') key: string, @Query('contentType') contentType?: string) {
    return this.svc.getPutUrl(key, contentType);
  }
}

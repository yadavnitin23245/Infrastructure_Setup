
import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  providers: [
    {
      provide: 'Prisma',
      useFactory: () => new PrismaClient(),
    },
  ],
  exports: ['Prisma'],
})
export class PrismaModule {}

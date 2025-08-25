import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/modules/app.module';

describe('Health e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      // override Prisma so no real DB connection is made
      .overrideProvider('Prisma')
      .useValue({}) // minimal stub; health route doesn't touch DB
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health should respond ok', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body.ok).toBe(true);
  });
});

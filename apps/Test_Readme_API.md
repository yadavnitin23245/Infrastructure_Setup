awesome—chalo Tests (API = Jest, Web = Playwright) implement karte hain + CI me run bhi kara dete hain. I’ll give you minimum, guided steps with ready-to-paste files.

0) Install dev deps
# API (NestJS + Jest + Supertest)
npm i -D -w apps/api jest ts-jest @types/jest supertest @types/supertest @nestjs/testing

# Web (Next.js + Playwright)
npm i -D -w apps/web @playwright/test
# (CI/Ubuntu pe browser binaries install honge workflow me; locally: npx playwright install)

1) API: Jest setup
a) apps/api/jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/main.ts'],
};
export default config;

b) Add test folder + specs
apps/api/test/health.e2e.spec.ts
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

apps/api/test/auth.service.spec.ts
import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService', () => {
  let svc: AuthService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: 'Prisma', useValue: prismaMock },
      ],
    }).compile();

    svc = moduleRef.get(AuthService);
    jest.resetAllMocks();
  });

  it('register should create user and return token', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hash' });
    const res = await svc.register('a@b.com', 'secret12');
    expect(res.access_token).toBeDefined();
  });

  it('login should fail for wrong user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(svc.login('x@y.com', 'secret')).rejects.toThrow();
  });
});

c) API package scripts (apps/api/package.json)
{
  "scripts": {
    "test": "jest --config=jest.config.ts",
    "test:watch": "jest --config=jest.config.ts --watch"
  }
}


Run locally: npm -w apps/api run test

2) Web: Playwright setup
a) apps/web/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // we run a built Next app for stability (fast & no dev HMR noise)
  webServer: {
    command: 'npm -w apps/web run start -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
  },
});


Important: Playwright config only starts the server. Build pehle karao (CI me step add, locally once: npm -w apps/web run build).

b) Sample test: apps/web/tests/home.spec.ts
import { test, expect } from '@playwright/test';

test('home renders heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Hybrid Dev: DB+MinIO in Docker, API/Web on Host' })).toBeVisible();
});

c) Web package scripts (apps/web/package.json)
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}


Local run (one-time build):
npm -w apps/web run build && npm -w apps/web run test:e2e
First run will auto-download browsers (or run npx playwright install).

3) CI: run tests before Docker build

Open .github/workflows/docker-ci.yml and insert these steps after npm ci + Prisma generate, and before docker build/push:

      - name: API tests (Jest)
        run: npm -w apps/api run test -- --runInBand

      - name: Web build (for Playwright)
        run: npm -w apps/web run build

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Web E2E (Playwright)
        run: npm -w apps/web run test:e2e


Tip: If CI time matters, add Nx cache around builds (you already enabled Nx).
If you want to use Nx explicitly:
npx nx run web:build (after you define targets). For now plain scripts are fine.

4) (Optional) Speed & stability tips

API tests using Prisma: keep unit tests with mocked Prisma (as above). Add e2e hitting only routes that don’t need DB, or start a test DB in CI with docker service if you want full e2e later.

Playwright parallel: Increase speed via --workers=2 or more in CI:

- run: npm -w apps/web run test:e2e -- --workers=2


Artifacts: save Playwright traces on failure (GitHub Actions artifact step) if you want.

Done ✅

API: Jest unit + e2e (health) tests wired.

Web: Playwright e2e (home page) wired.

CI: runs both test suites before building/pushing images.

If you want, I can drop ready patches for the exact files in your repo (so you can just copy-paste).




Jest ko TypeScript config (jest.config.ts) parse karne ke liye ts-node chahiye. Abhi root pe ts-node nahi mil raha, isliye error aa रहा है.

Option A (quick fix — keep jest.config.ts)

Root par install karo:

# repo root
npm i -D -W ts-node


Phir:

npm -w apps/api run test

Option B (ts-node ki need hatao — JS config use karo)

apps/api/jest.config.ts delete karke JS file banao:

apps/api/jest.config.js

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/main.ts'],
};


Run:

npm -w apps/api run test


Tip: Agar next error aayen like “Cannot find module ts-jest/typescript”, ensure dev deps:

npm i -D -w apps/api ts-jest @types/jest jest



Ye error config-path se aa raha hai. Chalo sure-shot fix karte hain: TS config hatao, JS config use karo, aur script simple rakho.

1) TS config hattāo, JS config banao

apps/api/jest.config.ts ko delete karke ye file banao:

apps/api/jest.config.js

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/main.ts'],
};


JS config use karne se ts-node dependency nahi lagegi aur Windows path issues se bachega.

2) Scripts simple rakho

apps/api/package.json me:

{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}


(Yani --config=jest.config.ts hata do. Jest khud jest.config.js pick kar lega.)

3) Dev deps confirm (API workspace)
npm i -D -w apps/api jest ts-jest @types/jest supertest @types/supertest


(Typescript already hai; ts-node ki zaroorat nahi padhegi ab.)

4) Run
npm -w apps/api run test


Agar phir bhi error aaye:

Ensure file path sahi: apps/api/jest.config.js

Try explicit path:

npx --yes jest --config ./apps/api/jest.config.js -w 1


Jest version check: npx jest --version

Chale to next step me web (Playwright) tests run kara lete hain.






Thought for 28s

yeh fail isliye aa रहा है kyunki AuthService ke unit test me JwtService ko secret nahi मिला—jwt.sign() ko secret चाहिए. Do easy fixes; main recommended de रहा हूँ:

✅ Fix (recommended): JwtModule.register in the test

apps/api/test/auth.service.spec.ts ko replace/update karo:

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService', () => {
  let svc: AuthService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',           // <— provide a real string here
          signOptions: { expiresIn: '1h' }
        }),
      ],
      providers: [
        AuthService,
        { provide: 'Prisma', useValue: prismaMock },
      ],
    }).compile();

    svc = moduleRef.get(AuthService);
    jest.resetAllMocks();
  });

  it('register should create user and return token', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hash' });
    const res = await svc.register('a@b.com', 'secret12');
    expect(res.access_token).toBeDefined();
  });

  it('login should fail for wrong user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(svc.login('x@y.com', 'secret')).rejects.toThrow();
  });
});


Ab JwtService ko secret mil रहा है, isliye secretOrPrivateKey must have a value error गायब हो जाएगा.

🔁 Run tests again
npm -w apps/api run test
# ya
npx jest --config ./apps/api/jest.config.js -w 1


“Ran all test suites.” + exit code 0 aana chahiye (npm error nahi).

Agar koi aur failure aaye, exact output yahin paste kar dena.

👉 Alternate (if you prefer env-based)

apps/api/test/setup-env.ts बनाओ:

process.env.JWT_SECRET = 'test-secret';


और apps/api/jest.config.js में जोड़ो:

setupFiles: ['<rootDir>/test/setup-env.ts'],
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
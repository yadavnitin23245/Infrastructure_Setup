import { test, expect } from '@playwright/test';

test('home renders heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Hybrid Dev: DB+MinIO in Docker, API/Web on Host' })).toBeVisible();
});

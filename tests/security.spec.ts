import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test_sec_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

test.describe('Security Audit', () => {
    test('Scenario A: Unauthenticated Access', async ({ page }) => {
        await page.goto('http://localhost:3000/dashboard');
        await expect(page).toHaveURL(/login/);
    });

    test('Scenario B: Pending Access Bypass', async ({ page }) => {
        // 1. Signup first
        await page.goto('http://localhost:3000/signup');
        await page.click('text=I am a Recruiter (TAS)');
        await page.fill('input[name="email"]', TEST_EMAIL);
        await page.fill('input[name="password"]', TEST_PASSWORD);
        await page.fill('input[name="confirmPassword"]', TEST_PASSWORD);
        await page.fill('input[name="panNumber"]', 'ABCDE1234F');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('http://localhost:3000/verification-pending');

        // 2. Try to visit dashboard directly
        await page.goto('http://localhost:3000/dashboard');

        // Expect kickback to verification-pending
        await expect(page).toHaveURL('http://localhost:3000/verification-pending');
    });

    test('Scenario C: Role Guard (TAS accessing Company)', async ({ page }) => {
        // Login as the TAS user created above
        await page.goto('http://localhost:3000/login');
        await page.fill('input[name="email"]', TEST_EMAIL);
        await page.fill('input[name="password"]', TEST_PASSWORD);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('http://localhost:3000/verification-pending');

        // Try to access Company Dashboard
        const response = await page.goto('http://localhost:3000/dashboard/company');

        // Expect 403 or Redirect (depending on middleware implementation)
        // Our middleware returns 403 Forbidden
        expect(response?.status()).toBe(403);
    });
});

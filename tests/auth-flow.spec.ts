import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test_auth_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';

test.describe('Auth Flow', () => {
    test('Scenario A: Signup as TAS', async ({ page }) => {
        await page.goto('http://localhost:3000/signup');

        // Select Role
        await page.click('text=I am a Recruiter (TAS)');

        // Fill Form
        await page.fill('input[name="email"]', TEST_EMAIL);
        await page.fill('input[name="password"]', TEST_PASSWORD);
        await page.fill('input[name="confirmPassword"]', TEST_PASSWORD);
        await page.fill('input[name="panNumber"]', 'ABCDE1234F');

        // Submit
        await page.click('button[type="submit"]');

        // Expect Redirect
        await expect(page).toHaveURL('http://localhost:3000/verification-pending');
    });

    test('Scenario B: Login as Pending User', async ({ page }) => {
        await page.goto('http://localhost:3000/login');

        // Fill Form
        await page.fill('input[name="email"]', TEST_EMAIL);
        await page.fill('input[name="password"]', TEST_PASSWORD);

        // Submit
        await page.click('button[type="submit"]');

        // Expect Redirect to Verification Pending (Trust Gate)
        await expect(page).toHaveURL('http://localhost:3000/verification-pending');
    });
});

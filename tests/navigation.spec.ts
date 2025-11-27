import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Homepage & Navigation', () => {
    test('Homepage loads correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/Recruitkart/);
        await expect(page.locator('h1')).toContainText('The Operating System for Hiring');
    });

    test('Navbar Links', async ({ page }) => {
        await page.goto(BASE_URL);

        // For Companies
        await page.click('text=For Companies');
        await expect(page).toHaveURL(`${BASE_URL}/for-companies`);
        await expect(page.locator('h1')).toContainText('Hire without the noise');

        // For TAS
        await page.goto(BASE_URL);
        await page.click('text=For TAS');
        await expect(page).toHaveURL(`${BASE_URL}/for-recruiters`);
        await expect(page.locator('h1')).toContainText('Monetize your network');

        // Pricing
        await page.goto(BASE_URL);
        await page.click('text=Pricing');
        await expect(page).toHaveURL(`${BASE_URL}/pricing`);
        await expect(page.locator('h1')).toContainText('Transparent Pricing');

        // About
        await page.goto(BASE_URL);
        await page.click('text=About');
        await expect(page).toHaveURL(`${BASE_URL}/about`);
        await expect(page.locator('h1')).toContainText('UPI of Recruitment');
    });

    test('Hero Section CTA', async ({ page }) => {
        await page.goto(BASE_URL);
        // "Start Hiring" button should likely go to signup or for-companies. 
        // Currently it might not have an href, let's check if it exists.
        await expect(page.getByRole('button', { name: 'Start Hiring' })).toBeVisible();
    });

    test('Subpage Links', async ({ page }) => {
        // Check links inside For Companies page
        await page.goto(`${BASE_URL}/for-companies`);
        await expect(page.getByRole('button', { name: 'Post a Job Now' })).toBeVisible();

        // Check links inside For Recruiters page
        await page.goto(`${BASE_URL}/for-recruiters`);
        await expect(page.getByRole('button', { name: 'Join as Partner' })).toBeVisible();
    });
});

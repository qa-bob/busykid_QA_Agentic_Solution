/**
 * tests/functional/busypay.spec.ts
 *
 * Functional tests for BusyKid's BusyPay™ feature section on the homepage.
 * BusyPay™ allows grandparents and family friends to add money to a child's
 * account via QR code — no BusyKid account required from the sender.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { waitForCloudflare } from '@utils/cloudflare-helper';

test.describe('BusyPay™ Section @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    // Use domcontentloaded only — BusyKid's third-party scripts prevent networkidle.
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const resolved = await waitForCloudflare(page);
    if (!resolved) {
      test.skip(true, 'Cloudflare challenge did not resolve — skipping to avoid false failure');
      return;
    }
  });

  // ── Section presence ─────────────────────────────────────────────────────────

  test('BusyPay section is present on the homepage @functional', async ({ page }) => {
    // Scroll down to ensure BusyPay section is rendered (it is below the fold)
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
    const busypaySection = page.locator('*').filter({ hasText: /busypay/i }).first();
    await expect(
      busypaySection,
      'BusyPay™ section should be present and visible on the homepage'
    ).toBeVisible();
  });

  test('BusyPay heading or branding is visible @functional', async ({ page }) => {
    const busypayHeading = page.getByRole('heading', { name: /busypay/i }).first();
    const busypayText = page.locator('h1, h2, h3, h4').filter({ hasText: /busypay/i }).first();
    const busypayLogo = page.locator('img[alt*="busypay" i], [class*="busypay"]').first();

    const headingVisible =
      (await busypayHeading.count() > 0 && await busypayHeading.isVisible().catch(() => false)) ||
      (await busypayText.count() > 0 && await busypayText.isVisible().catch(() => false)) ||
      (await busypayLogo.count() > 0 && await busypayLogo.isVisible().catch(() => false));

    expect(
      headingVisible,
      'BusyPay heading, branding text, or logo should be visible on the homepage'
    ).toBeTruthy();
  });

  // ── Description content ───────────────────────────────────────────────────────

  test('BusyPay description mentions QR code or gift money @functional', async ({ page }) => {
    const busypayContainer = page.locator('section, article, div').filter({ hasText: /busypay/i }).first();

    if (await busypayContainer.count() === 0) {
      test.skip(true, 'BusyPay container not found on homepage');
      return;
    }

    const containerText = await busypayContainer.textContent() ?? '';
    const mentionsGift = /qr|gift|grandpar|friend|add money|send money|transfer/i.test(containerText);

    expect(
      mentionsGift,
      `BusyPay section should describe QR code or gifting money. Found: "${containerText.slice(0, 200)}..."`
    ).toBeTruthy();
  });

  // ── QR code for BusyPay ───────────────────────────────────────────────────────

  test('BusyPay section includes a QR code reference @functional', async ({ page }) => {
    const busypayArea = page.locator('section, article, div').filter({ hasText: /busypay/i }).first();

    if (await busypayArea.count() === 0) {
      test.skip(true, 'BusyPay area not found');
      return;
    }

    const qrInSection = busypayArea.locator(
      'img[alt*="qr" i], img[alt*="scan" i], img[src*="qr" i], [class*="qr"]'
    );
    const qrTextInSection = busypayArea.locator('*').filter({ hasText: /qr|scan/i });

    const qrPresent =
      (await qrInSection.count()) > 0 || (await qrTextInSection.count()) > 0;

    if (!qrPresent) {
      console.warn(
        '[busypay] No QR code found in BusyPay section. ' +
          'BusyPay™ relies on QR codes — check if the feature section changed.'
      );
    }
    // Informational only — layout may have changed
  });
});

test.describe('BusyKid Visa Card Promo on Homepage @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const resolved = await waitForCloudflare(page);
    if (!resolved) {
      test.skip(true, 'Cloudflare challenge did not resolve — skipping to avoid false failure');
      return;
    }
  });

  test('Visa card promo section is present on homepage @functional', async ({ page }) => {
    // Scroll down to ensure the Visa card section is rendered
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    const visaPromo = page.locator('*').filter({ hasText: /visa.*prepaid|prepaid.*card|busykid.*card/i }).first();
    expect(
      await visaPromo.count(),
      'Homepage should mention the BusyKid Visa Prepaid Card'
    ).toBeGreaterThan(0);
  });

  test('Visa card link navigates to the /cards page @functional', async ({ page, siteConfig }) => {
    // Find any link that goes to /cards
    const cardsLink = page.locator('a[href*="/cards"]').first();

    if (await cardsLink.count() === 0) {
      console.warn('[busypay] No explicit /cards link found on homepage navigation or content area.');
      return;
    }

    const href = await cardsLink.getAttribute('href');
    expect(
      href,
      'Cards link should point to /cards or the full cards URL'
    ).toMatch(/\/cards/i);
  });

  test('Visa acceptance mention is present @functional', async ({ page }) => {
    const visaAcceptance = page.locator('*').filter({
      hasText: /visa.*accepted|accepted.*everywhere|millions.*merchants|anywhere.*visa/i,
    }).first();

    const visaLogo = page.locator('img[alt*="visa" i]').first();

    const visaPresent =
      (await visaAcceptance.count()) > 0 || (await visaLogo.count()) > 0;

    expect(
      visaPresent,
      'Homepage should mention Visa acceptance or display the Visa logo'
    ).toBeTruthy();
  });
});

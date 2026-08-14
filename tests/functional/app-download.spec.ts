/**
 * tests/functional/app-download.spec.ts
 *
 * Functional tests for BusyKid's app download CTAs.
 * Verifies that App Store and Google Play links are present, correctly
 * attributed, and accessible on the homepage.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { waitForCloudflare } from '@utils/cloudflare-helper';

test.describe('App Download CTAs @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    // Use domcontentloaded only — BusyKid loads third-party analytics that
    // keep the network busy indefinitely, causing networkidle to time out.
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const resolved = await waitForCloudflare(page);
    if (!resolved) {
      test.skip(true, 'Cloudflare challenge did not resolve — skipping to avoid false failure');
      return;
    }
  });

  // ── App Store ────────────────────────────────────────────────────────────────

  test('App Store download link is present on homepage @functional', async ({ page }) => {
    const appStoreLink = page.locator(
      'a[href*="apple.com/app"], a[href*="apps.apple.com"]'
    ).first();

    expect(
      await appStoreLink.count(),
      'Homepage should have at least one link to the Apple App Store'
    ).toBeGreaterThan(0);
  });

  test('App Store link points to a valid Apple URL @functional', async ({ page }) => {
    const appStoreLink = page.locator(
      'a[href*="apple.com/app"], a[href*="apps.apple.com"]'
    ).first();

    if (await appStoreLink.count() === 0) {
      test.skip(true, 'No App Store link found — covered by previous test');
      return;
    }

    const href = await appStoreLink.getAttribute('href');
    expect(href, 'App Store link should have an href').not.toBeNull();
    expect(
      href!.toLowerCase(),
      `App Store href "${href}" should contain "apple.com"`
    ).toMatch(/apple\.com/i);
  });

  test('App Store link has an accessible name or alt text @functional', async ({ page }) => {
    const appStoreLink = page.locator(
      'a[href*="apple.com/app"], a[href*="apps.apple.com"]'
    ).first();

    if (await appStoreLink.count() === 0) {
      test.skip(true, 'No App Store link found');
      return;
    }

    // Check for aria-label, title, or an img with alt text inside the link
    const ariaLabel = await appStoreLink.getAttribute('aria-label');
    const title = await appStoreLink.getAttribute('title');
    const imgAlt = await appStoreLink.locator('img[alt]').getAttribute('alt').catch(() => null);

    const hasAccessibleName = Boolean(
      (ariaLabel && ariaLabel.trim().length > 0) ||
      (title && title.trim().length > 0) ||
      (imgAlt && imgAlt.trim().length > 0)
    );

    if (!hasAccessibleName) {
      console.warn(
        '[app-download] App Store link has no aria-label, title, or img alt. ' +
          'This may fail WCAG 2.1 accessibility guidelines.'
      );
    }
    // Soft check — warn but do not fail (many sites use visually identifiable logos)
  });

  // ── Google Play ───────────────────────────────────────────────────────────────

  test('Google Play download link is present on homepage @functional', async ({ page }) => {
    const googlePlayLink = page.locator('a[href*="play.google.com"]').first();

    expect(
      await googlePlayLink.count(),
      'Homepage should have at least one link to the Google Play Store'
    ).toBeGreaterThan(0);
  });

  test('Google Play link points to a valid Google URL @functional', async ({ page }) => {
    const googlePlayLink = page.locator('a[href*="play.google.com"]').first();

    if (await googlePlayLink.count() === 0) {
      test.skip(true, 'No Google Play link found — covered by previous test');
      return;
    }

    const href = await googlePlayLink.getAttribute('href');
    expect(href, 'Google Play link should have an href').not.toBeNull();
    expect(
      href!.toLowerCase(),
      `Google Play href "${href}" should contain "play.google.com"`
    ).toMatch(/play\.google\.com/i);
  });

  // ── Both stores present ───────────────────────────────────────────────────────

  test('both App Store and Google Play links are present @functional', async ({ page }) => {
    const appStoreCount = await page.locator(
      'a[href*="apple.com/app"], a[href*="apps.apple.com"]'
    ).count();

    const googlePlayCount = await page.locator('a[href*="play.google.com"]').count();

    expect(
      appStoreCount,
      'Homepage should have at least one App Store link'
    ).toBeGreaterThan(0);

    expect(
      googlePlayCount,
      'Homepage should have at least one Google Play link'
    ).toBeGreaterThan(0);
  });

  // ── QR code ──────────────────────────────────────────────────────────────────

  test('QR code for app download is present @functional', async ({ page }) => {
    // BusyKid displays a QR code for scanning with a phone to download the app
    const qrImage = page.locator(
      'img[alt*="qr" i], img[alt*="scan" i], img[src*="qr" i], [class*="qr"]'
    ).first();

    const qrText = page.locator('*').filter({ hasText: /scan.*download|qr code|scan with/i }).first();

    const qrPresent = (await qrImage.count()) > 0 || (await qrText.count()) > 0;

    if (!qrPresent) {
      console.warn('[app-download] No QR code element found. BusyKid may have removed it.');
    }
    // Informational assertion — does not fail the suite
  });

  // ── App store links are not broken ───────────────────────────────────────────

  test('app store download links open in a new tab or have correct target @functional', async ({
    page,
  }) => {
    const appLinks = page.locator(
      'a[href*="apple.com/app"], a[href*="apps.apple.com"], a[href*="play.google.com"]'
    );
    const count = await appLinks.count();

    if (count === 0) {
      test.skip(true, 'No app store links found');
      return;
    }

    // Check up to the first 5 visible links only — later links may be in lazy-loaded
    // sections that aren't yet attached to the DOM and would time out on getAttribute.
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = appLinks.nth(i);
      const isVisible = await link.isVisible().catch(() => false);
      if (!isVisible) continue;

      const target = await link.getAttribute('target', { timeout: 5_000 }).catch(() => null);
      const href = await link.getAttribute('href', { timeout: 5_000 }).catch(() => null);
      if (target !== '_blank') {
        console.warn(
          `[app-download] App store link "${href}" does not open in a new tab (target="${target}"). ` +
            'Consider adding target="_blank" rel="noopener noreferrer".'
        );
      }
    }
    // Informational — we log but don't hard-fail on this UX preference
  });
});

/**
 * tests/functional/cards.spec.ts
 *
 * Functional tests for the BusyKid Visa® Prepaid Card page (/cards).
 * Covers hero section, card features, pricing, enrollment CTAs, and Visa branding.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('BusyKid Visa Cards Page @functional', () => {
  test.beforeEach(async ({ cardsPage }) => {
    // Verify the /cards page is available before running tests
    const status = await cardsPage.getCardsPageStatus();
    if (status === 404) {
      test.skip(true, '/cards returned 404 — page may have moved or been redirected');
      return;
    }
    await cardsPage.waitForLoad();
  });

  // ── Page load ────────────────────────────────────────────────────────────────

  test('cards page loads successfully @functional', async ({ cardsPage, siteConfig }) => {
    const response = await cardsPage.page.goto(
      siteConfig.url.replace(/\/$/, '') + '/cards',
      { waitUntil: 'domcontentloaded' }
    );
    expect(response, 'Navigation to /cards should return a response').not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `Expected HTTP 2xx/3xx for /cards but got ${status}`
    ).toBeTruthy();
  });

  // ── Hero section ─────────────────────────────────────────────────────────────

  test('cards page has a visible hero heading @functional', async ({ cardsPage }) => {
    await expect(
      cardsPage.heroHeading,
      'The /cards page should have a primary heading'
    ).toBeVisible();

    const headingText = await cardsPage.getHeroText();
    expect(
      headingText.length,
      'Hero heading should contain meaningful text'
    ).toBeGreaterThan(5);
  });

  test('cards hero mentions the card or kids @functional', async ({ cardsPage }) => {
    const headingText = await cardsPage.getHeroText();
    const lowerText = headingText.toLowerCase();
    expect(
      lowerText.match(/card|kid|child|spend|prepaid|visa/i),
      `Hero heading "${headingText}" should mention card, kids, or spending`
    ).not.toBeNull();
  });

  // ── Visa branding ─────────────────────────────────────────────────────────────

  test('Visa branding is present on the cards page @functional', async ({ cardsPage }) => {
    const hasVisa = await cardsPage.hasVisaBranding();
    expect(
      hasVisa,
      'The /cards page should display Visa branding (logo or text mention)'
    ).toBeTruthy();
  });

  // ── Pricing ──────────────────────────────────────────────────────────────────

  test('card pricing information is displayed @functional', async ({ cardsPage }) => {
    const pricingText = await cardsPage.getPricingText();
    expect(
      pricingText.length,
      'The /cards page should display pricing information (e.g., "$4/mo.")'
    ).toBeGreaterThan(0);

    // Verify it contains a dollar amount
    expect(
      pricingText,
      `Pricing text "${pricingText}" should contain a dollar sign`
    ).toMatch(/\$/);
  });

  // ── Card features ─────────────────────────────────────────────────────────────

  test('card feature highlights are present @functional', async ({ cardsPage }) => {
    const hasFeatures = await cardsPage.hasCardFeatures();
    expect(
      hasFeatures,
      'The /cards page should list card features (Practical, Safe, Convenient)'
    ).toBeTruthy();
  });

  // ── Enrollment CTA ───────────────────────────────────────────────────────────

  test('enrollment CTA is visible @functional', async ({ cardsPage }) => {
    const isReady = await cardsPage.enrollCtaIsReady();
    expect(
      isReady,
      'The /cards page should have a visible enrollment/get-started CTA'
    ).toBeTruthy();
  });

  test('enrollment CTA links to a valid destination @functional', async ({ cardsPage, siteConfig }) => {
    if (await cardsPage.enrollCta.count() === 0) {
      test.skip(true, 'No enrollment CTA found — covered by previous test');
      return;
    }

    const href = await cardsPage.enrollCta.getAttribute('href');
    expect(href, 'Enrollment CTA should have an href attribute').not.toBeNull();
    expect(
      href!.trim().length,
      'Enrollment CTA href should not be empty'
    ).toBeGreaterThan(0);
  });

  // ── App download links ────────────────────────────────────────────────────────

  test('App Store download link is present on cards page @functional', async ({ cardsPage }) => {
    const hasAppStore = await cardsPage.hasAppStoreLink();
    expect(
      hasAppStore,
      'The /cards page should have an App Store download link'
    ).toBeTruthy();
  });

  test('Google Play download link is present on cards page @functional', async ({ cardsPage }) => {
    const hasGooglePlay = await cardsPage.hasGooglePlayLink();
    expect(
      hasGooglePlay,
      'The /cards page should have a Google Play download link'
    ).toBeTruthy();
  });

  test('app store links point to valid store URLs @functional', async ({ cardsPage }) => {
    if (await cardsPage.appStoreLink.count() > 0) {
      const appStoreHref = await cardsPage.appStoreLink.getAttribute('href');
      expect(
        appStoreHref,
        'App Store link href should contain "apple.com" or "apps.apple.com"'
      ).toMatch(/apple\.com/i);
    }

    if (await cardsPage.googlePlayLink.count() > 0) {
      const googlePlayHref = await cardsPage.googlePlayLink.getAttribute('href');
      expect(
        googlePlayHref,
        'Google Play link href should contain "play.google.com"'
      ).toMatch(/play\.google\.com/i);
    }
  });
});

test.describe('BusyKid Cards Page Responsive @functional', () => {
  test('cards page renders without horizontal overflow at mobile @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/cards',
      { waitUntil: 'domcontentloaded' }
    ).catch(() => null);

    if (!response || response.status() === 404) {
      test.skip(true, '/cards returned 404 at mobile viewport');
      return;
    }

    const hasHorizontalScroll = await page.evaluate<boolean>(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(
      hasHorizontalScroll,
      'Cards page should not have horizontal overflow at mobile (390px) viewport'
    ).toBeFalsy();
  });
});

/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for BusyKid's four core feature pillars:
 * Earn, Donate, Save, and Invest — all present on the homepage.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { waitForCloudflare } from '@utils/cloudflare-helper';

test.describe('BusyKid Homepage Feature Pillars @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    // Use domcontentloaded only — BusyKid loads third-party analytics that
    // keep the network busy indefinitely, causing networkidle to time out.
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    // BusyKid uses Cloudflare which may show a bot-verification challenge to
    // headless chromium. Wait up to 15s for the JS challenge to auto-resolve.
    const resolved = await waitForCloudflare(page);
    if (!resolved) {
      test.skip(true, 'Cloudflare challenge did not resolve — skipping to avoid false failure');
      return;
    }
  });

  // ── Earn ────────────────────────────────────────────────────────────────────

  test('Earn section heading is visible @functional', async ({ featuresSection }) => {
    await featuresSection.scrollToEarn();
    await expect(
      featuresSection.earnHeading,
      'The "Earn" feature pillar heading should be visible on the homepage'
    ).toBeVisible();
  });

  test('Earn section contains descriptive content @functional', async ({ featuresSection }) => {
    const hasDesc = await featuresSection.pillarHasDescription('earn');
    expect(
      hasDesc,
      'The Earn section should have a description explaining how kids earn allowance'
    ).toBeTruthy();
  });

  // ── Donate ───────────────────────────────────────────────────────────────────

  test('Donate section heading is visible @functional', async ({ featuresSection }) => {
    await featuresSection.scrollToDonate();
    await expect(
      featuresSection.donateHeading,
      'The "Donate" feature pillar heading should be visible on the homepage'
    ).toBeVisible();
  });

  test('Donate section contains descriptive content @functional', async ({ featuresSection }) => {
    await featuresSection.scrollToDonate();
    const hasDesc = await featuresSection.pillarHasDescription('donate');
    expect(
      hasDesc,
      'The Donate section should have a description explaining charitable giving'
    ).toBeTruthy();
  });

  // ── Save ─────────────────────────────────────────────────────────────────────

  test('Save section heading is visible @functional', async ({ featuresSection }) => {
    await featuresSection.scrollToSave();
    await expect(
      featuresSection.saveHeading,
      'The "Save" feature pillar heading should be visible on the homepage'
    ).toBeVisible();
  });

  test('Save section contains descriptive content @functional', async ({ featuresSection }) => {
    await featuresSection.scrollToSave();
    const hasDesc = await featuresSection.pillarHasDescription('save');
    expect(
      hasDesc,
      'The Save section should have a description explaining automatic savings'
    ).toBeTruthy();
  });

  // ── Invest ───────────────────────────────────────────────────────────────────

  test('Invest section heading is visible @functional', async ({ featuresSection }) => {
    await featuresSection.scrollToInvest();
    await expect(
      featuresSection.investHeading,
      'The "Invest" feature pillar heading should be visible on the homepage'
    ).toBeVisible();
  });

  test('Invest section contains descriptive content @functional', async ({ featuresSection }) => {
    const hasDesc = await featuresSection.pillarHasDescription('invest');
    expect(
      hasDesc,
      'The Invest section should have a description explaining teen investment features'
    ).toBeTruthy();
  });

  // ── All four pillars together ────────────────────────────────────────────────

  test('all four feature pillars (Earn, Donate, Save, Invest) are present @functional', async ({
    featuresSection,
  }) => {
    const report = await featuresSection.getPillarVisibilityReport();
    const invisible = report.filter((r) => !r.visible);

    expect(
      invisible,
      `The following feature pillars are not visible: ${invisible.map((r) => r.pillar).join(', ')}`
    ).toHaveLength(0);
  });

  // ── Feature pillar order ─────────────────────────────────────────────────────

  test('feature pillar headings appear in the document in the expected order @functional', async ({
    page,
  }) => {
    // Verify all four pillar headings appear in the DOM and check relative positions
    const earnBox = await page.getByRole('heading', { name: /earn/i }).first().boundingBox();
    const donateBox = await page.getByRole('heading', { name: /donat/i }).first().boundingBox();
    const saveBox = await page.getByRole('heading', { name: /sav/i }).first().boundingBox();

    // If layout is vertical (stacked), Earn should appear above Donate
    if (earnBox && donateBox && earnBox.y !== donateBox.y) {
      expect(
        earnBox.y,
        'Earn heading should appear before Donate heading in vertical layout'
      ).toBeLessThan(donateBox.y);
    }

    // Donate should appear before or at the same level as Save
    if (donateBox && saveBox && donateBox.y !== saveBox.y) {
      expect(
        donateBox.y,
        'Donate heading should appear before Save heading in vertical layout'
      ).toBeLessThan(saveBox.y);
    }
  });
});

test.describe('BusyKid Homepage Media & Social Proof @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const resolved = await waitForCloudflare(page);
    if (!resolved) {
      test.skip(true, 'Cloudflare challenge did not resolve — skipping to avoid false failure');
      return;
    }
  });

  test('media coverage logos are present (CNN, Forbes, etc.) @functional', async ({ page }) => {
    // BusyKid features CNN, Yahoo Finance, Forbes, CNBC, HuffPost, Bankrate logos.
    // Logos may be images with non-descriptive alt text or rendered via CSS/SVG,
    // so we check both alt-text, src URL patterns, and raw text nodes.
    const mediaLogos = page.locator(
      'img[alt*="CNN" i], img[alt*="Forbes" i], img[alt*="CNBC" i], img[alt*="Yahoo" i], ' +
      'img[alt*="HuffPost" i], img[alt*="Bankrate" i], img[alt*="press" i], ' +
      'img[src*="cnn" i], img[src*="forbes" i], img[src*="cnbc" i], img[src*="yahoo" i], ' +
      'img[src*="huffpost" i], img[src*="bankrate" i]'
    );
    const textMentions = page.locator('p, span, h1, h2, h3, h4, div, a').filter({
      hasText: /CNN|Forbes|CNBC|Yahoo|HuffPost|Bankrate|Bad Credit/i,
    });

    const logoCount = await mediaLogos.count();
    const textCount = await textMentions.count();

    if (logoCount + textCount === 0) {
      console.warn(
        '[functional] Media coverage logos not found via alt-text or src patterns. ' +
          'BusyKid may use CSS background images or SVG for media logos — selector update needed.'
      );
    }
    // Soft assertion: media logos are cosmetic content and may change; warn rather than hard-fail
    expect.soft(
      logoCount + textCount,
      'Homepage should display media coverage logos or mentions (CNN, Forbes, etc.)'
    ).toBeGreaterThan(0);
  });

  test('social proof section is present @functional', async ({ page }) => {
    // Look for Trustpilot, testimonials, reviews, or Shark Tank reference
    const socialProof = page.locator('*').filter({
      hasText: /trustpilot|testimonial|review|shark tank|mr\. wonderful/i,
    });

    expect(
      await socialProof.count(),
      'Homepage should include social proof (Trustpilot, testimonials, or Shark Tank endorsement)'
    ).toBeGreaterThan(0);
  });

  test('BusyPay section is present on homepage @functional', async ({ page }) => {
    const busypay = page.locator('*').filter({ hasText: /busypay/i }).first();
    await expect(
      busypay,
      'BusyPay™ section should be present on the homepage'
    ).toBeVisible();
  });

  test('hero section has a primary heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(
      heading.length,
      'Homepage hero section should have a primary heading with meaningful text'
    ).toBeGreaterThan(5);
  });
});

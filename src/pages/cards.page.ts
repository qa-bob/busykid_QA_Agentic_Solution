/**
 * src/pages/cards.page.ts
 *
 * CardsPage models the BusyKid Visa® Prepaid Card page at /cards.
 * Covers the hero, card features, pricing, and enrollment CTAs.
 */

import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@app-types/site-config.types';

export class CardsPage extends BasePage {
  // ── Page URL ─────────────────────────────────────────────────────────────────

  readonly cardsPath = '/cards';

  // ── Hero section ─────────────────────────────────────────────────────────────

  readonly heroHeading: Locator;
  readonly heroSubheading: Locator;

  // ── Card features ────────────────────────────────────────────────────────────

  /** "Practical", "Safe", "Convenient" feature items */
  readonly cardFeatureItems: Locator;

  /** The "$4/mo." or similar pricing callout */
  readonly pricingCallout: Locator;

  // ── CTAs ─────────────────────────────────────────────────────────────────────

  /** Primary enrollment / get-started CTA */
  readonly enrollCta: Locator;

  /** App Store download link */
  readonly appStoreLink: Locator;

  /** Google Play download link */
  readonly googlePlayLink: Locator;

  // ── Visa branding ─────────────────────────────────────────────────────────────

  /** Visa logo or Visa acceptance mention */
  readonly visaMention: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.heroHeading = page.locator('h1, [class*="hero"] h2, [class*="banner"] h2').first();
    this.heroSubheading = page.locator('h1 + p, h2 + p, [class*="hero"] p, [class*="subhead"]').first();

    this.cardFeatureItems = page.locator(
      '[class*="feature"], [class*="card-feature"], [class*="benefit"], li'
    ).filter({ hasText: /practical|safe|convenient|security|spending|simple/i });

    this.pricingCallout = page.locator('*').filter({ hasText: /\$\d+\s*\/\s*(mo|month|yr|year)/i }).first();

    this.enrollCta = page.getByRole('link', { name: /enroll|get started|sign up|get.*card/i }).first();

    this.appStoreLink = page.locator('a[href*="apple.com/app"], a[href*="apps.apple.com"]').first();
    this.googlePlayLink = page.locator('a[href*="play.google.com"]').first();

    this.visaMention = page.locator('img[alt*="visa" i], [class*="visa"], *').filter({ hasText: /visa/i }).first();
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  /** Navigate directly to the /cards page. */
  async navigateToCards(): Promise<void> {
    const cardsUrl = this.url.replace(/\/$/, '') + this.cardsPath;
    await this.page.goto(cardsUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Returns the HTTP status code when navigating to /cards.
   * Use this to verify the page exists before running card-specific assertions.
   */
  async getCardsPageStatus(): Promise<number> {
    const response = await this.page.goto(
      this.url.replace(/\/$/, '') + this.cardsPath,
      { waitUntil: 'domcontentloaded' }
    ).catch(() => null);
    return response?.status() ?? 0;
  }

  // ── Content inspection ───────────────────────────────────────────────────────

  /** Returns the hero heading text. */
  async getHeroText(): Promise<string> {
    return (await this.heroHeading.textContent())?.trim() ?? '';
  }

  /** Returns true if at least one card feature item is visible. */
  async hasCardFeatures(): Promise<boolean> {
    return (await this.cardFeatureItems.count()) > 0;
  }

  /** Returns the pricing text (e.g., "$4/mo."). */
  async getPricingText(): Promise<string> {
    if (await this.pricingCallout.count() === 0) return '';
    return (await this.pricingCallout.textContent())?.trim() ?? '';
  }

  /** Returns true if the enrollment CTA is visible and enabled. */
  async enrollCtaIsReady(): Promise<boolean> {
    if (await this.enrollCta.count() === 0) return false;
    return this.enrollCta.isVisible();
  }

  /** Returns true if the App Store download link is present. */
  async hasAppStoreLink(): Promise<boolean> {
    return (await this.appStoreLink.count()) > 0;
  }

  /** Returns true if the Google Play download link is present. */
  async hasGooglePlayLink(): Promise<boolean> {
    return (await this.googlePlayLink.count()) > 0;
  }

  /** Returns true if a Visa mention or logo is present on the page. */
  async hasVisaBranding(): Promise<boolean> {
    return (await this.visaMention.count()) > 0;
  }
}

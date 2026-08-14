/**
 * src/pages/features.page.ts
 *
 * FeaturesSection models the four core BusyKid feature pillars on the homepage:
 * Earn, Donate, Save, and Invest. These sections do not live on a separate URL
 * but are scroll-sections of the homepage.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@app-types/site-config.types';

export class FeaturesSection extends BasePage {
  // ── Individual pillar heading locators ──────────────────────────────────────

  readonly earnHeading: Locator;
  readonly donateHeading: Locator;
  readonly saveHeading: Locator;
  readonly investHeading: Locator;

  // ── Section containers (wrap heading + description + image) ─────────────────

  readonly earnSection: Locator;
  readonly donateSection: Locator;
  readonly saveSection: Locator;
  readonly investSection: Locator;

  // ── CTA buttons in features area ────────────────────────────────────────────

  readonly getStartedCta: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.earnHeading = page.getByRole('heading', { name: /earn/i }).first();
    this.donateHeading = page.getByRole('heading', { name: /donat/i }).first();
    this.saveHeading = page.getByRole('heading', { name: /sav/i }).first();
    this.investHeading = page.getByRole('heading', { name: /invest/i }).first();

    // Sections are identified by proximity to their heading — try semantic
    // containers first, then fall back to section/article elements containing the text
    this.earnSection = page.locator('section, article, div').filter({ hasText: /earn/i }).first();
    this.donateSection = page.locator('section, article, div').filter({ hasText: /donat/i }).first();
    this.saveSection = page.locator('section, article, div').filter({ hasText: /sav/i }).first();
    this.investSection = page.locator('section, article, div').filter({ hasText: /invest/i }).first();

    this.getStartedCta = page.getByRole('link', { name: /get started/i }).first();
  }

  // ── Pillar presence checks ───────────────────────────────────────────────────

  /** Returns true if all four feature pillars have a visible heading. */
  async allPillarsVisible(): Promise<boolean> {
    const checks = await Promise.all([
      this.earnHeading.isVisible().catch(() => false),
      this.donateHeading.isVisible().catch(() => false),
      this.saveHeading.isVisible().catch(() => false),
      this.investHeading.isVisible().catch(() => false),
    ]);
    return checks.every(Boolean);
  }

  /**
   * Returns the text content of a named pillar heading.
   * Accepts: 'earn' | 'donate' | 'save' | 'invest'
   */
  async getPillarHeadingText(pillar: 'earn' | 'donate' | 'save' | 'invest'): Promise<string> {
    const map: Record<string, Locator> = {
      earn: this.earnHeading,
      donate: this.donateHeading,
      save: this.saveHeading,
      invest: this.investHeading,
    };
    const locator = map[pillar];
    return (await locator.textContent())?.trim() ?? '';
  }

  /**
   * Returns true if the specified pillar section has a non-empty description.
   */
  async pillarHasDescription(pillar: 'earn' | 'donate' | 'save' | 'invest'): Promise<boolean> {
    const sectionMap: Record<string, Locator> = {
      earn: this.earnSection,
      donate: this.donateSection,
      save: this.saveSection,
      invest: this.investSection,
    };

    const section = sectionMap[pillar];
    const descLocator = section.locator('p, [class*="desc"], [class*="text"], [class*="copy"]').first();

    if (await descLocator.count() === 0) return false;
    const text = await descLocator.textContent();
    return (text?.trim().length ?? 0) > 10;
  }

  // ── Content getters ──────────────────────────────────────────────────────────

  /** Returns visibility report for all four pillars. */
  async getPillarVisibilityReport(): Promise<Array<{ pillar: string; visible: boolean }>> {
    const pillars: Array<{ pillar: string; locator: Locator }> = [
      { pillar: 'Earn', locator: this.earnHeading },
      { pillar: 'Donate', locator: this.donateHeading },
      { pillar: 'Save', locator: this.saveHeading },
      { pillar: 'Invest', locator: this.investHeading },
    ];

    return Promise.all(
      pillars.map(async ({ pillar, locator }) => ({
        pillar,
        visible: await locator.isVisible().catch(() => false),
      }))
    );
  }

  // ── Scroll helpers ───────────────────────────────────────────────────────────

  async scrollToEarn(): Promise<void> {
    await this.earnHeading.scrollIntoViewIfNeeded();
  }

  async scrollToDonate(): Promise<void> {
    // Scroll down one viewport height to bring Donate section into view
    await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await this.donateHeading.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
  }

  async scrollToSave(): Promise<void> {
    // Scroll further to trigger lazy rendering of the Save section
    await this.page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await this.saveHeading.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
  }

  async scrollToInvest(): Promise<void> {
    await this.investHeading.scrollIntoViewIfNeeded();
  }
}

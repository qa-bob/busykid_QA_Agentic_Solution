/**
 * src/utils/cloudflare-helper.ts
 *
 * Detects Cloudflare bot-protection challenges and waits for them to
 * auto-resolve. BusyKid uses Cloudflare, which can show a JS challenge
 * to headless browsers — this helper prevents intermittent test failures
 * caused by the challenge page appearing instead of the real site.
 */

import { type Page } from '@playwright/test';

const CF_TITLE_RE = /just a moment|cloudflare|security check|checking your browser/i;
const CF_HEADING_RE = /performing security verification|checking your browser/i;

/**
 * After navigating, call this to detect a Cloudflare challenge and wait
 * up to `timeoutMs` for it to auto-resolve. If the challenge doesn't
 * resolve in time the function returns false — callers should skip.
 */
export async function waitForCloudflare(page: Page, timeoutMs = 15_000): Promise<boolean> {
  const title = await page.title().catch(() => '');
  const isChallenge = CF_TITLE_RE.test(title);

  if (!isChallenge) return true;

  try {
    // The JS challenge rewrites the title once it resolves
    await page.waitForFunction(
      (re: string) => !new RegExp(re, 'i').test(document.title),
      CF_TITLE_RE.source,
      { timeout: timeoutMs },
    );
    await page.waitForLoadState('domcontentloaded');
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns true if the current page is a Cloudflare challenge page.
 */
export async function isCloudflareChallenge(page: Page): Promise<boolean> {
  const title = await page.title().catch(() => '');
  if (CF_TITLE_RE.test(title)) return true;
  const h2Count = await page.locator('h2').filter({ hasText: CF_HEADING_RE }).count().catch(() => 0);
  return h2Count > 0;
}

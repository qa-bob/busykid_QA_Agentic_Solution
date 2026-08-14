---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply whenever Claude works with files in `src/pages/`.

## Class Structure
- All page object classes extend `BasePage` from `./base.page`
- Constructor signature: `constructor(page: Page, config: SiteConfig)`
- Always call `super(page, config)` first in the constructor
- Export exactly one class per file

## Locators
- Declare all key element locators as `readonly Locator` properties on the class
- Initialize locators in the constructor: `this.heroHeading = page.locator('h1').first()`
- Use semantic/role selectors over CSS classes where possible:
  - Prefer: `page.getByRole('button', { name: /enroll/i })`
  - Prefer: `page.getByRole('link', { name: /cards/i })`
  - Avoid: `page.locator('.btn-primary-cta-blue')` (fragile, couples to CSS)
- For text matching, use regex with `i` flag: `/earn your allowance/i`

## Methods
- Methods represent **user actions**: `clickEnrollCta()`, `openMobileMenu()`, `navigateToCards()`
- Return types: `Promise<void>` for actions, `Promise<string>` for getters, `Promise<boolean>` for presence checks
- No `expect()` calls inside page objects — assertions belong exclusively in test files
- Navigation methods should `await page.waitForLoadState('domcontentloaded')` after clicking

## Naming Conventions
- File: `<name>.page.ts` (e.g., `cards.page.ts`, `features.page.ts`)
- Class: `<Name>Page` or `<Name>Section` (e.g., `CardsPage`, `FeaturesSection`)
- Locator properties: camelCase noun phrases (`heroHeading`, `enrollCtaButton`, `appStoreLink`)
- Method names: verb phrases starting with action (`click`, `navigate`, `fill`, `open`, `get`, `has`, `is`)

## Selectors for BusyKid
- BusyKid uses class-based styling — prefer text/role selectors over class names
- For feature pillars (Earn/Donate/Save/Invest), use heading text: `page.getByRole('heading', { name: /earn/i })`
- For app store links: `page.locator('a[href*="apple.com/app"], a[href*="apps.apple.com"]')`
- For Google Play: `page.locator('a[href*="play.google.com"]')`
- For Visa card page CTAs: `page.getByRole('link', { name: /enroll|get started|sign up/i })`

## After Writing a New Page Object
- Register it in `src/fixtures/site.fixture.ts` as a new fixture property
- Update `CLAUDE.md` key files table if it's a significant new addition
- Run `npm run typecheck` to verify no type errors

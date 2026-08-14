@AGENTS.md

# QA Agentic Solution — BusyKid

Playwright + TypeScript regression suite for **https://busykid.com**.
POM architecture — see @README.md for full context.

See @site.config.json for the target URL and feature flags.

---

## Build Commands

```bash
npm install                 # Install dependencies
npx playwright install      # Install browser binaries
npm test                    # Run all tests
npm run test:smoke          # @smoke tests only
npm run test:navigation     # @navigation tests only
npm run test:forms          # @forms tests only
npm run test:functional     # @functional tests only
npm run test:visual         # @visual tests only
npm run test:responsive     # @responsive tests only
npm run baseline            # Update visual snapshots
npm run typecheck           # TypeScript strict check — run before every PR
npm run lint                # ESLint
npm run report              # Open HTML test report
```

---

## Architecture Rules

### Page Object Model
- Every page/section → one class in `src/pages/`, extending `BasePage`
- Locators are `readonly Locator` class properties
- Methods = user actions only (`clickEnrollCta()`, `openMobileMenu()`)
- No `expect()` inside page objects — assertions belong in tests
- Export one class per file, named after the page

### Tests
- Import `{ test, expect }` from `@fixtures/site.fixture` (never `@playwright/test` directly)
- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never hardcode `https://busykid.com` — always use `siteConfig.url` or Playwright `baseURL`
- Never submit forms or create accounts
- No `page.waitForTimeout()` except in visual tests for animation settling (max 500ms)

### TypeScript
- Strict mode — zero errors required from `npm run typecheck`
- No `any` type without an explicit justification comment
- Path aliases: `@pages/*`, `@fixtures/*`, `@utils/*`, `@app-types/*`

---

## Key Files

| File | Purpose |
|------|---------|
| `site.config.json` | Site URL, flags, expected nav items |
| `playwright.config.ts` | baseURL, projects, timeouts, reporters |
| `src/pages/base.page.ts` | BasePage — do not change without team review |
| `src/fixtures/site.fixture.ts` | Register new page objects here |
| `src/types/site-config.types.ts` | Extend SiteConfig interface here |
| `AGENTS.md` | Multi-agent system docs (imported above) |
| `SKILLS.md` | Slash command reference |

---

## When Asked to Write or Update Tests

1. Read `site.config.json` to get URL and flags
2. Use `WebFetch` to inspect the live site before writing any selectors
3. Verify target page URL is not 404 before writing tests for it
4. Add/update the page object class in `src/pages/` first
5. Write tests using the page object, not raw `page.locator()` in the test body
6. Register new page objects in `src/fixtures/site.fixture.ts`
7. Run `npm run typecheck` — fix all errors before finishing

---

## Test Tagging Reference

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title present, no console errors |
| `@navigation` | Nav links, routing, menus, breadcrumbs |
| `@forms` | Form fields, validation, accessibility |
| `@functional` | BusyKid features: Earn/Donate/Save/Invest, Cards, BusyPay |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport-specific layout checks |

---

## Do Not

- Submit any form
- Create accounts or log in (`auth.required` is false for BusyKid)
- Hardcode `https://busykid.com` in test files
- Put `expect()` inside page object methods
- Use `page.waitForTimeout()` for anything other than animation settling
- Use `any` type without justification
- Write tests for pages that return 404 without a conditional skip guard

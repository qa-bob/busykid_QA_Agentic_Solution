# AGENTS.md — BusyKid QA Agentic Solution

Multi-agent system documentation for the BusyKid Playwright test suite.
This file is read by Claude Code (via `@AGENTS.md` import in `CLAUDE.md`) and by other AI coding tools.

---

## Repository Purpose

This repository tests **https://busykid.com** — a family fintech app for chores, allowance, and kids' financial literacy. Tests are written in Playwright + TypeScript using a Page Object Model (POM) architecture. No authentication is required; all tested pages are publicly accessible.

---

## Available Agents

### 1. `site-analyzer`

**Location:** `.claude/agents/site-analyzer.md`

**Role:** Crawls the live BusyKid website and produces or verifies `site.config.json`.

**Invoke when:**
- Onboarding a new page to the test suite
- Verifying selectors after a BusyKid site redesign
- Running `/analyze-site` slash command
- The site structure has changed and tests are failing with element-not-found errors

**Outputs:** Updated `site.config.json` with accurate `expectedNavItems`, `hasContactForm`, and other flags.

---

### 2. `test-generator`

**Location:** `.claude/agents/test-generator.md`

**Role:** Reads `site.config.json` and generates site-specific Playwright test files for BusyKid features not covered by generic suites.

**Invoke when:**
- A new BusyKid feature needs test coverage (e.g., new investing dashboard, new partner integration)
- Generic tests fail due to BusyKid-specific markup
- The `/generate-full-suite` skill is invoked

**Outputs:** TypeScript spec files in `tests/functional/` and updated page objects in `src/pages/`.

---

## Agent Collaboration Patterns

### Pattern 1: Discovery → Generation

```
1. /analyze-site          → site-analyzer crawls busykid.com, updates site.config.json
2. /generate-full-suite   → test-generator reads config, generates/updates POM + specs
3. npx tsc --noEmit       → TypeScript validation
4. npm run test:smoke     → Quick verification
```

### Pattern 2: Selector Refresh

When BusyKid redesigns a page and tests start failing:

```
1. /analyze-site                     → Re-crawl to find new selectors
2. Update affected page objects      → test-generator updates src/pages/
3. npm run test:smoke                → Verify fix
4. npm run test:functional           → Full functional pass
```

### Pattern 3: New Feature Coverage

```
1. Describe new feature to Claude Code
2. test-generator creates page object + spec file
3. Review generated selectors against live site
4. npm run typecheck && npm run test:smoke
```

---

## Rules All Agents Must Follow

- **No form submission** — never click Submit or trigger a POST to BusyKid servers
- **No account creation** — never fill credentials or sign-up flows
- **No hardcoded URLs** — always use `siteConfig.url` or `baseURL` from Playwright config
- **Real selectors only** — always use `WebFetch` to inspect the live site before writing locators
- **TypeScript strict** — generated code must pass `npx tsc --noEmit` with zero errors
- **POM compliance** — no `page.locator()` calls in test bodies; all selectors live in page objects
- **Tag every test** — at minimum one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`

---

## Key Files for Agent Context

| File | Why Agents Need It |
|------|-------------------|
| `site.config.json` | Source of truth for URL, nav items, feature flags |
| `playwright.config.ts` | baseURL, project names, timeouts |
| `src/pages/base.page.ts` | All POMs extend this — agents must not change it without review |
| `src/fixtures/site.fixture.ts` | Any new page object must be registered here |
| `src/types/site-config.types.ts` | TypeScript interface for site config — extend here for new fields |
| `tsconfig.json` | Path aliases: `@pages/*`, `@fixtures/*`, `@utils/*`, `@types/*` |

---

## BusyKid Site Map (as of 2026-06-10)

| Page | URL | Notes |
|------|-----|-------|
| Homepage | `/` | Main content hub: Earn/Donate/Save/Invest pillars, Visa card promo, BusyPay, social proof |
| Cards | `/cards` | BusyKid Visa® Prepaid Card details, pricing, features |
| Features | `/features` | May redirect or 404 — verify before writing tests |
| Investing | `/investing` | Teen investing info — verify availability |
| Education | `/education` | Financial literacy resources — verify availability |
| Press | `/press` | Media coverage — verify availability |
| Support | `/support` | Help center — verify availability |
| Partners | `/partners` | Credit Unions, Banks, BusyKid x Zogo |

**Agents must verify each URL is reachable (not 404) before writing tests for it.**

---

## Output Conventions for Generated Tests

- File location: `tests/functional/<kebab-case>.spec.ts` for feature-specific tests
- Import: always from `@fixtures/site.fixture`, never from `@playwright/test` directly
- Naming: `test.describe('Feature Name @functional', () => { ... })`
- One `describe` block per page or feature area
- Add `@custom` tag to generated tests in addition to primary tag

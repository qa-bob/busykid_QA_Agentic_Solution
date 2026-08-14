# BusyKid QA Agentic Solution

Automated regression test suite for **[BusyKid](https://busykid.com)** — the award-winning family finance app that teaches kids money management through chores, allowance, spending, saving, donating, and investing.

Built with **Playwright + TypeScript** using a **Page Object Model (POM)** architecture and designed for agentic execution with Claude Code.

---

## Website Under Test

| Field        | Value                                               |
|--------------|-----------------------------------------------------|
| URL          | https://busykid.com                                 |
| Industry     | FinTech / Family Finance                            |
| Company      | BusyKid (Scottsdale, AZ — founded 2011)             |
| Key Features | Earn, Donate, Save, Invest, BusyKid Visa Card, BusyPay™ |
| Auth         | Not required for public pages                       |

---

## Tech Stack

| Tool                  | Purpose                              |
|-----------------------|--------------------------------------|
| [Playwright](https://playwright.dev/) | Browser automation & assertions |
| TypeScript (strict)   | Type-safe test authoring             |
| Page Object Model     | Maintainable selector abstraction    |
| Claude Code           | Agentic test generation & analysis   |
| GitHub Actions        | CI/CD pipeline                       |

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- A Claude Code subscription (for agentic features)

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/busykid_QA_Agentic_Solution.git
cd busykid_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install

# 4. (Optional) Copy environment file
cp .env.example .env
```

---

## Running Tests

```bash
npm test                    # Run all tests
npm run test:smoke          # @smoke — site availability & load
npm run test:navigation     # @navigation — nav links & routing
npm run test:forms          # @forms — form fields & validation
npm run test:functional     # @functional — BusyKid feature tests
npm run test:visual         # @visual — screenshot regression
npm run test:responsive     # @responsive — layout at all viewports
npm run test:headed         # Run with visible browser
npm run baseline            # Update visual regression snapshots
npm run report              # Open HTML test report
npm run lint                # ESLint
npm run typecheck           # TypeScript strict check
```

### Run a single test file

```bash
npx playwright test tests/functional/homepage-features.spec.ts
```

### Run on a specific browser

```bash
npx playwright test --project=chromium-desktop
npx playwright test --project=mobile-chrome
npx playwright test --project=tablet
```

---

## Project Structure

```
busykid_QA_Agentic_Solution/
├── site.config.json            # Site URL, flags, expected nav items
├── playwright.config.ts        # Projects: desktop, mobile, tablet
├── global-setup.ts             # Pre-test reachability check
├── CLAUDE.md                   # Claude Code project instructions
├── AGENTS.md                   # Multi-agent system documentation
├── SKILLS.md                   # Available slash commands & skills
│
├── src/
│   ├── pages/                  # Page Object Model classes
│   │   ├── base.page.ts        # BasePage — shared helpers
│   │   ├── home.page.ts        # HomePage — hero, CTAs, headings
│   │   ├── navigation.page.ts  # NavigationPage — nav links, mobile menu
│   │   ├── contact.page.ts     # ContactFormPage — form inspection
│   │   ├── features.page.ts    # FeaturesSection — Earn/Donate/Save/Invest
│   │   └── cards.page.ts       # CardsPage — BusyKid Visa card page
│   ├── fixtures/
│   │   └── site.fixture.ts     # Custom fixtures (imports all page objects)
│   ├── utils/
│   │   ├── link-checker.ts     # HTTP reachability helpers
│   │   └── visual-helper.ts    # Cookie banner dismissal, scroll helpers
│   └── types/
│       └── site-config.types.ts # SiteConfig interface + loader
│
├── tests/
│   ├── smoke/
│   │   └── site-availability.spec.ts   # @smoke
│   ├── navigation/
│   │   └── nav-links.spec.ts           # @navigation
│   ├── forms/
│   │   └── contact-form.spec.ts        # @forms
│   ├── functional/
│   │   ├── homepage-features.spec.ts   # @functional — Earn/Donate/Save/Invest
│   │   ├── cards.spec.ts               # @functional — Visa card page
│   │   ├── app-download.spec.ts        # @functional — App Store / Google Play CTAs
│   │   └── busypay.spec.ts             # @functional — BusyPay™ section
│   ├── visual/
│   │   └── visual-regression.spec.ts   # @visual
│   └── responsive/
│       └── layout.spec.ts              # @responsive
│
├── .claude/
│   ├── agents/
│   │   ├── site-analyzer.md    # Site crawl & config generation agent
│   │   └── test-generator.md   # Custom test generation agent
│   ├── commands/               # Slash command definitions
│   │   ├── generate-full-suite.md
│   │   ├── analyze-site.md
│   │   ├── run-smoke.md
│   │   ├── update-baseline.md
│   │   └── generate-report.md
│   └── rules/
│       ├── testing.md          # Path-scoped rules for tests/
│       └── page-objects.md     # Path-scoped rules for src/pages/
│
└── .github/
    ├── CONTRIBUTING.md
    ├── pull_request_template.md
    └── workflows/
        └── playwright.yml      # CI/CD pipeline
```

---

## Page Object Model

Each page/section has a dedicated class in `src/pages/` that extends `BasePage`.

**Rules:**
- Locators are `readonly Locator` class properties
- Methods represent user actions (`clickCTA()`, `openMobileMenu()`)
- No `expect()` assertions inside page objects — those belong in tests
- Import via `@pages/` alias, not relative paths

```typescript
// src/pages/cards.page.ts
export class CardsPage extends BasePage {
  readonly heroHeading: Locator;
  readonly enrollCta: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1, [class*="hero"] h2').first();
    this.enrollCta = page.getByRole('link', { name: /enroll|get started|sign up/i }).first();
  }

  async navigateToCards(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + '/cards', {
      waitUntil: 'domcontentloaded',
    });
  }
}
```

---

## Agents, Skills, Rules & Instructions

### CLAUDE.md (project root)
The primary Claude Code instruction file. Loaded at the start of every session.
- Imports `AGENTS.md` for multi-agent context
- References `.claude/rules/` for path-scoped rules
- Documents build commands, architecture rules, and Do-Nots

### AGENTS.md (project root)
Documents the multi-agent system used in this repo. Describes:
- Available agents and their roles (`site-analyzer`, `test-generator`)
- When to invoke each agent
- Input/output contracts
- Also read by other AI coding tools (OpenAI Agents, Devin, etc.)

### SKILLS.md (project root)
Human-readable documentation of all available slash commands/skills:
- What each skill does
- How to invoke it in Claude Code
- Example prompts

### .claude/rules/ (path-scoped rules)
Loaded automatically when Claude works with matching files:
- `testing.md` — applies to `tests/**/*.ts`
- `page-objects.md` — applies to `src/pages/**/*.ts`

### .github/ Folder
| File | Purpose |
|------|---------|
| `CONTRIBUTING.md` | Contribution guide: branching, commit style, PR checklist |
| `pull_request_template.md` | Required PR description template |
| `workflows/playwright.yml` | GitHub Actions CI: runs all tests on push/PR |

---

## Contribution Guidelines

See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide. Quick summary:

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Write tests before or alongside page object changes
3. Run `npm run typecheck` — zero TypeScript errors required
4. Run `npm run lint` — zero ESLint errors required
5. Run `npm run test:smoke` to verify basic test health
6. Open a PR using the template in `.github/pull_request_template.md`
7. CI must be green before merging

**Never:**
- Submit a form in tests
- Hardcode `https://busykid.com` in test bodies (use `siteConfig.url`)
- Push directly to `main`
- Merge with failing TypeScript or lint errors

---

## CI/CD

Tests run automatically via GitHub Actions on every push and pull request.
See `.github/workflows/playwright.yml` for the full pipeline.

The pipeline:
1. Installs Node and Playwright browsers
2. Runs `npm run typecheck` (fails fast on TypeScript errors)
3. Runs `npm run test:smoke` (fast gate)
4. Runs `npm test` (full suite)
5. Uploads HTML report as artifact

---

## Claude Code Integration

This repo is optimized for Claude Code agentic execution:

```bash
# Analyze the live BusyKid site and update page objects
/analyze-site

# Generate or regenerate the full test suite
/generate-full-suite

# Run smoke tests and see results inline
/run-smoke

# Update visual regression baselines
/update-baseline

# Generate a test summary report
/generate-report
```

---

*Part of the Phoenix Startup QA Agentic Solutions project.*

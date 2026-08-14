# Contributing to BusyKid QA Agentic Solution

Thank you for contributing to this test suite. This guide covers branching, commit style, PR checklist, and the rules every contributor must follow.

---

## Prerequisites

Before contributing, ensure you have:
- Node.js 18+ and npm 9+
- Playwright browsers installed: `npx playwright install`
- A working test run: `npm run test:smoke`

---

## Branching Strategy

| Branch type | Pattern | Example |
|-------------|---------|---------|
| Feature / new test | `feat/<description>` | `feat/cards-page-tests` |
| Bug fix | `fix/<description>` | `fix/mobile-menu-selector` |
| Refactor | `refactor/<description>` | `refactor/homepage-pom` |
| Visual baseline update | `baseline/<description>` | `baseline/after-nav-redesign` |

- Branch from `main`
- Keep branches focused — one feature or fix per branch
- Delete branches after merging

---

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
```

| Type | When to use |
|------|-------------|
| `feat` | New test, page object, or skill |
| `fix` | Fixing a broken test or selector |
| `refactor` | Code change without behavioral change |
| `test` | Adding/updating tests |
| `docs` | README, AGENTS.md, SKILLS.md, CONTRIBUTING.md |
| `ci` | GitHub Actions workflow changes |
| `chore` | Dependency updates, config changes |

**Examples:**
```
feat(functional): add Earn/Donate/Save/Invest feature tests
fix(navigation): update mobile menu selector after BusyKid redesign
docs: update AGENTS.md with new test-generator patterns
ci: add Playwright test step to GitHub Actions workflow
```

---

## Pull Request Process

1. **Create your branch** from `main`
2. **Write your tests** — follow the architecture rules in `CLAUDE.md`
3. **Run the checklist below** before opening a PR
4. **Fill out the PR template** fully (`.github/pull_request_template.md`)
5. **Request a review** from at least one other contributor
6. **CI must be green** — all checks must pass before merging

### Pre-PR Checklist

```bash
# 1. TypeScript — zero errors required
npm run typecheck

# 2. Lint — zero errors required
npm run lint

# 3. Smoke tests — must all pass
npm run test:smoke

# 4. Run tests you changed
npx playwright test tests/functional/your-spec.spec.ts

# 5. If you updated visual baselines, confirm diffs are intentional
npm run baseline
```

---

## Test Writing Rules

Follow all rules in `CLAUDE.md`. Critical ones:

- **Never submit a form** — interaction testing only
- **Never hardcode `https://busykid.com`** — always use `siteConfig.url`
- **No `page.locator()` in test bodies** — all selectors live in page objects
- **No `page.waitForTimeout()` outside visual tests** — use Playwright auto-waiting
- **Tag every test** with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- **Run `npx tsc --noEmit`** before committing

---

## Page Object Guidelines

When adding a new page object:

1. Create `src/pages/<name>.page.ts` extending `BasePage`
2. Add it to `src/fixtures/site.fixture.ts`
3. Document the new fixture in `README.md`
4. Follow the rules in `.claude/rules/page-objects.md`

---

## Updating Visual Baselines

Visual regression baselines must only be updated when:
- BusyKid has shipped an intentional UI change
- The change has been reviewed and confirmed as correct
- The PR description clearly states "Visual baseline update" and lists what changed

**Never update baselines to hide a genuine UI regression.**

---

## Reporting Issues

Open a GitHub Issue with:
- The failing test name and file path
- The error message and stack trace
- The Playwright HTML report (attach if available)
- Steps to reproduce

---

## Questions

Open a Discussion or ask in the team Slack channel.

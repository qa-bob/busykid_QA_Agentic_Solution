# SKILLS.md — Available Slash Commands & Skills

This file documents all Claude Code slash commands (skills) available in this repository.
Skills live in `.claude/commands/` and are invoked by typing `/skill-name` in a Claude Code session.

---

## Available Skills

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

**What it does:** Analyzes the BusyKid website from scratch and generates or regenerates the complete Playwright test suite — page objects, fixtures, and all spec files.

**When to use:**
- First-time setup of this repository
- After a major BusyKid site redesign
- When test coverage has drifted significantly from the live site

**Steps it follows:**
1. Reads `site.config.json` for URL and flags
2. Uses `WebFetch` to crawl `https://busykid.com` and all nav-linked pages
3. Plans page object classes based on discovered structure
4. Writes/updates POM files in `src/pages/`
5. Updates `src/fixtures/site.fixture.ts`
6. Generates spec files in `tests/`
7. Runs `npx tsc --noEmit` to validate TypeScript

**Example:**
```
/generate-full-suite
```

---

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

**What it does:** Crawls the live BusyKid site and reports its structure — pages, nav items, forms, interactive elements, and any issues found. Does NOT write any test files.

**When to use:**
- Before writing new tests to understand current selectors
- After a site update to check what changed
- To verify `site.config.json` is still accurate

**Output:**
- List of discoverable pages and their URLs
- Nav items found
- Forms and their fields
- Interactive elements (accordions, carousels, modals, CTAs)
- Issues flagged (broken links, missing meta tags, console errors)
- Updated `site.config.json` block

**Example:**
```
/analyze-site
```

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

**What it does:** Executes `npm run test:smoke` and reports the results inline, summarizing pass/fail counts and any errors found.

**When to use:**
- Quick health check before committing
- After updating page objects, to verify nothing is broken
- As a first step in any debugging session

**Example:**
```
/run-smoke
```

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

**What it does:** Runs `npm run baseline` to refresh all visual regression snapshots in `__snapshots__/`. Use after intentional UI changes that have been reviewed and approved.

**When to use:**
- After BusyKid ships a UI update that changes visual appearance
- After updating viewport sizes in `playwright.config.ts`
- When visual tests are failing due to approved design changes (not bugs)

**Warning:** This overwrites baseline screenshots. Run it only when visual diffs have been reviewed and confirmed as intentional.

**Example:**
```
/update-baseline
```

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

**What it does:** Parses `test-results/results.json` and generates a human-readable markdown summary of the last test run — totals, failures, duration, and a table by suite.

**When to use:**
- After a CI run to summarize results for stakeholders
- When filing a bug report that needs test evidence
- End-of-sprint QA summary

**Output format:**
```markdown
## Test Results — BusyKid (2026-06-10)

| Suite       | Total | Passed | Failed | Skipped |
|-------------|-------|--------|--------|---------|
| smoke       |   6   |   6    |   0    |    0    |
| navigation  |   4   |   4    |   0    |    0    |
| functional  |  12   |  11    |   1    |    0    |
...
```

**Example:**
```
/generate-report
```

---

## How Claude Code Uses Skills

Claude Code loads skill files from `.claude/commands/` automatically. When you type `/skill-name`:
1. Claude reads the corresponding `.md` file
2. Follows the step-by-step instructions inside it
3. Uses available tools (WebFetch, Read, Write, Bash) to complete the task

Skills only load when invoked — they do not consume context tokens on every session.

---

## Creating a New Skill

To add a new slash command:

1. Create `.claude/commands/<skill-name>.md`
2. Write clear step-by-step instructions inside
3. Reference this file in `SKILLS.md` (this file)
4. Test by typing `/<skill-name>` in a Claude Code session

Follow the patterns in existing command files. Keep instructions concise and action-oriented.

---

## Bundled Claude Code Skills (not in this repo)

These are built into Claude Code and are always available:

| Skill | Purpose |
|-------|---------|
| `/help` | Show Claude Code help |
| `/compact` | Compress conversation context |
| `/memory` | View/edit CLAUDE.md and auto-memory files |
| `/init` | Initialize or improve CLAUDE.md |
| `/code-review` | Review current diff for bugs and improvements |
| `/debug` | Debug a failing test or error |
| `/schedule` | Schedule a recurring task |

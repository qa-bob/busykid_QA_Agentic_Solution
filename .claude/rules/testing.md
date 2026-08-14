---
paths:
  - "tests/**/*.ts"
  - "tests/**/*.spec.ts"
---

# Testing Rules

These rules apply whenever Claude works with files in `tests/`.

## Imports
- Always import `{ test, expect }` from `@fixtures/site.fixture`, not from `@playwright/test`
- Never import page objects directly in test files — use the fixtures

## Test Structure
- Use `test.describe('Description @tag', () => { ... })` for grouping
- Use `test.beforeEach` for shared navigation setup (avoids code duplication)
- Each `test()` must have exactly one primary responsibility
- Test descriptions must be readable as sentences: "homepage hero is visible"

## Tags (required on every test)
- `@smoke` — site loads, title present, basic availability
- `@navigation` — nav links, menus, routing
- `@forms` — form fields, validation (never submit)
- `@functional` — BusyKid business features
- `@visual` — screenshot regression
- `@responsive` — viewport-specific layout

## Assertions
- Prefer `await expect(locator).toBeVisible()` over checking `.count() > 0`
- Use `toHaveText()` with regex for flexible text matching: `toHaveText(/earn/i)`
- Use soft assertions (`expect.soft()`) for non-critical warnings
- Always include a message in assertions: `expect(val, 'description of what failed').toBe(...)`

## Selectors in tests
- No raw `page.locator()` calls in test bodies — use page object methods/properties
- Exception: when querying for generic infrastructure (console errors, viewport meta)

## Form tests
- Never call `form.submit()` or click any submit button that would send data
- It is acceptable to click a submit button to trigger client-side validation
- Intercept any accidental navigation triggered by form interaction

## Timeouts
- Do not use `page.waitForTimeout()` in non-visual tests
- Use Playwright auto-waiting: `await expect(locator).toBeVisible()`
- Use `page.waitForLoadState('networkidle')` sparingly — prefer `domcontentloaded`

## Skipping
- Use `test.skip(condition, 'reason')` for tests that depend on optional features
- Always check that a page URL returns non-404 before testing it:
  ```typescript
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => null);
  if (!response || response.status() === 404) {
    test.skip(true, `Page ${url} returned 404`);
    return;
  }
  ```

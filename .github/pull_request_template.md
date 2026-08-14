## Summary

<!-- Describe what this PR adds, fixes, or changes. 2-3 sentences max. -->

## Type of Change

- [ ] New test(s)
- [ ] Bug fix (broken selector or flaky test)
- [ ] New page object
- [ ] Visual baseline update
- [ ] Documentation
- [ ] CI/CD change
- [ ] Refactor

## BusyKid Pages/Features Affected

<!-- List the pages or features this PR covers. e.g., "Cards page (/cards), enrollment CTA" -->

## Test Coverage Added or Changed

<!-- List the test files and test names added/changed. -->

| File | Test Name | Tag |
|------|-----------|-----|
| `tests/functional/...` | | `@functional` |

## Pre-Merge Checklist

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run test:smoke` passes
- [ ] New/changed tests pass locally: `npx playwright test <file>`
- [ ] No hardcoded `https://busykid.com` URLs in test bodies
- [ ] No `page.locator()` calls in test bodies (all selectors are in page objects)
- [ ] No `page.waitForTimeout()` outside visual tests
- [ ] All new tests tagged with at least one test tag
- [ ] New page objects registered in `src/fixtures/site.fixture.ts`
- [ ] Visual baselines updated only for intentional design changes (if applicable)

## Screenshots / Test Output

<!-- Paste playwright output or attach screenshots of passing test results if relevant. -->

## Notes for Reviewers

<!-- Anything the reviewer should pay special attention to. -->

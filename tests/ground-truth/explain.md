# Baseline Automation Project Explanation

## 1) Project Purpose

This repository is a Playwright + TypeScript baseline automation project for the AssistLab student web app.

It serves two goals:

1. Baseline E2E regression testing for core student features (profile, KHS document, assistant vacancy flow).
2. Self-healing automation research, where controlled DOM/UI changes are injected in SUT and then automation repair quality is evaluated.

In short: this is not only a test project, but also an experiment environment to measure how well AI can diagnose and fix brittle UI tests.

---

## 2) High-Level Architecture

The project follows Page Object Model (POM) with these layers:

1. Test Specs (`tests/baseline/*.spec.ts`)
2. Page Classes (`pages/*.ts`)
3. Locator Definitions (`utils/locators/*.ts`)
4. Interaction Utilities + Logger (`utils/helper/*.ts`)
5. Authentication Fixture (`tests/setup/auth.setup.ts`, `fixture/authenticated.fixture.ts`)
6. Environment + Data (`utils/env`, `data`)

Execution chain:

1. Playwright runs `setup` project first.
2. Setup logs in and writes storage state to `data/user.json`.
3. Main test project (`chromium`) depends on setup and reuses storage state.
4. Baseline specs run in parallel at file level and call page objects.
5. Page objects call locator functions + `LocatorUtils` wrappers for actions/assertions/logging.

---

## 3) Repository Structure (What Each Area Does)

### Root

- `package.json`
	- Dependencies: `@playwright/test`, `@types/node`, `dotenv`.
	- No npm scripts are defined, so tests are expected to run via direct Playwright CLI commands.

- `playwright.config.ts`
	- Global test settings:
		- `testDir: ./tests`
		- test timeout: 60s
		- expect timeout: 10s
		- retries: 2
		- workers: 1
		- reporters: list, html, junit (`results.xml`)
	- `use` settings:
		- `baseURL` from `utils/helper/config.ts`
		- `headless: false`
		- screenshot on failure
		- `storageState: data/user.json`
		- trace on first retry
	- Projects:
		- `setup` runs `tests/setup/auth.setup.ts`
		- `chromium` depends on `setup`

- `tsconfig.json`
	- Minimal TS config for Node + Playwright types.

- `README.md`
	- Currently minimal title only.

### `data/`

- `dev.json`: student test account input (email/password for one part of auth flow).
- `index.ts`: data loader by `ENV` variable; expects `<env>.json` and parses to `TestData`.
- `profile.data.ts`: type for profile form payload.
- `user.json`: Playwright storage state file (cookies/origins) produced by auth setup.

### `fixture/`

- `authenticated.fixture.ts`
	- Extends Playwright `test` with:
		- `logger` fixture instance.
		- custom `context` that always loads `storageState: data/user.json`.
	- At test end, logs test status (`PASSED`, `FAILED`, etc).

### `pages/`

Page object layer for business flows:

- `basePage.ts`: generic base with `navigateTo`, `typeText`, `click`.
- `loginPage.ts`: login and authentication verification flow.
- `dashboardPage.ts`: navigation from dashboard and offering actions.
- `profilePage.ts`: profile page, edit flow, upload photo, fill and verify profile data.
- `khsPage.ts`: KHS navigation, upload, and filter verification.
- `assistantVacancyPage.ts`: vacancy list, detail, apply, status validations.
- `registrationHistoryPage.ts`: history traversal and status verification.
- `assistantOfferingPage.ts`: offering page verification and no-offer assertion.
- `index.ts`: minimal wrapper class (`Pages`) not heavily used by specs.

### `utils/helper/`

- `locatorUtils.ts`
	- Core wrapper for UI actions:
		- `click`, `fill`, `uploadFile`, visibility checks.
		- retry loops.
		- detailed logging.
		- screenshot attachment on failure (`test.info().attach`).
	- This is central to resilience and diagnosis.

- `logger.ts`
	- Writes logs to `utils/logs/Logger.log`.
	- Also prints to console.
	- Tracks in-memory logs for optional attachment.

- `config.ts`
	- Environment switch logic (`ENV`), currently defaults to `devConfig`.

- `enum.ts`, `interface.ts`
	- Shared enums and interfaces for statuses and test data typing.

- `getText.ts`
	- Normalizes heading text from locators (reduces whitespace noise).

### `utils/locators/`

Locator maps grouped by feature:

- `loginLocators.ts`
- `profileLocators.ts`
- `khsLocators.ts`
- `assistantLocator.ts`
- `index.ts` aggregate export as `locators`

This separation allows you to adjust selectors without rewriting test scenarios.

### `tests/`

- `setup/auth.setup.ts`
	- Performs auth/session bootstrap before real tests.
	- Detects valid auth file and may reuse it.
	- If auth is invalid, resets state and forces re-auth path.
	- Runs multi-step login chain (AssistLab -> Google -> UGM SSO) and saves storage state.

- `baseline/*.spec.ts`
	- Five core feature flows (F1..F5), each mapped to test cases (TCxx).

- `ground-truth/DOM-changes/*.diff`
	- Injected DOM disturbance definitions for self-healing evaluation.

- `prompt/prompt-with-MCP.md` and `prompt-without-MCP.md`
	- Standardized repair prompts for AI-agent comparison.

---

## 4) Functional Baseline Scenarios (F1 to F5)

### F1 - Profile Completion (`F1-profile.spec.ts`)

Objective:

1. Open profile from dashboard.
2. Open edit profile.
3. Upload profile photo.
4. Fill complete profile form.
5. Verify key saved fields shown in profile view.

Notable implementation details:

- Uses `ProfileDataField` enum for stable identity fields.
- Upload success validated by displayed file name and confirmation element.
- Profile submit confirmation button is explicitly clicked.

### F2 - KHS Upload (`F2-khs.spec.ts`)

Objective:

1. Open KHS page.
2. Open add document flow.
3. Upload KHS PDF and submit.
4. Verify processing success + owner name.
5. Verify sort and search filter behavior.

Notable implementation details:

- File path from `tests/assets/khs-genap-2026.pdf`.
- Sort check validates that extracted column values are alphabetically ordered.

### F3 - Vacancy Discovery and Apply (`F3-assistant.spec.ts`)

Objective:

1. Open vacancy list.
2. Verify vacancy availability.
3. Open detail for class code `PPPLA1`.
4. Verify course detail fields and status.
5. Submit assistant application.

Notable implementation details:

- Course assertion uses abbreviation, code, class fields.
- Apply action includes modal confirmation click.

### F4 - Application Verification and Duplicate Apply (`F4-verify-apply.spec.ts`)

Objective:

1. Validate registration status from dashboard card.
2. Open registration detail and verify fields/status.
3. Validate same status path via registration history period/list navigation.
4. Attempt duplicate apply for same vacancy and verify error.

Notable implementation details:

- Uses period label `GENAP 2026`.
- Duplicate apply should produce explicit already-applied message.

### F5 - Reject Assistance Offering (`F5-decline-offering.spec.ts`)

Objective:

1. Verify an offering card exists for class `PGTIA1`.
2. Reject the offering from dashboard.
3. Verify rejected status appears.
4. Navigate to offering page and verify offer is no longer available.

Notable implementation details:

- Uses specific card filtering by course class code.
- End-state validated in both dashboard and offering page.

---

## 5) Authentication and Session Management Flow

Core files:

- `tests/setup/auth.setup.ts`
- `fixture/authenticated.fixture.ts`
- `data/user.json`

Behavior:

1. Setup test runs first due Playwright project dependency.
2. It checks if auth file looks valid (non-empty + has cookies/origins).
3. It attempts `/student/` and detects whether user is already authenticated.
4. If redirected to login while auth file exists, setup resets storage and throws, forcing a clean next run.
5. On success, context storage state is saved into `data/user.json`.
6. All baseline tests consume this storage state via custom context fixture.

Implication for analysis:

- If many tests fail at first step, always inspect auth setup result first before debugging locators.

---

## 6) Locator Strategy and Why It Matters

Locators use mixed strategies:

1. `getByTestId` (preferred stable strategy where available)
2. `getByRole` + accessible name (good when semantics stable)
3. CSS selectors + id/class (`#submitBtn`, `.card-course`) which are more brittle
4. Structural selectors (`xpath=following-sibling`) for label-value pair verification

Self-healing relevance:

- Many injected DOM changes intentionally target weak locator assumptions (attribute moved, text changed, role/name shift).
- Because locators are centralized, single-fix in locator file can restore multiple failing steps.

---

## 7) Ground-Truth DOM Change Set (Self-Healing Benchmark)

The repository includes 15 injected change definitions:

1. DC01 - profile menu
2. DC02 - profile header
3. DC03 - profile photo upload trigger
4. DC04 - profile data input behavior
5. DC05 - KHS header
6. DC06 - KHS file-name preview
7. DC07 - KHS search result behavior
8. DC08 - vacancy page header
9. DC09 - vacancy detail mapping
10. DC10 - additional verification modal before final apply
11. DC11 - dashboard registration status
12. DC12 - registration history status
13. DC13 - vacancy apply button behavior
14. DC14 - duplicate/related apply button behavior
15. DC15 - offering page header text/test-id change

Each diff file contains:

1. Baseline locator/page logic
2. Ground-truth corrected locator/page logic
3. SUT code mutation description causing breakage

This makes the folder a labeled dataset for test-repair experiments.

---

## 8) Prompting Experiment Design

Two agent prompt modes are provided:

1. `prompt-with-MCP.md`
	- Requires live browser investigation through Playwright MCP tools.
	- Emphasizes runtime DOM evidence before fixing.

2. `prompt-without-MCP.md`
	- Restricts diagnosis to static code analysis + test error output.
	- Emphasizes stack-trace and code-path reasoning.

Both prompts enforce strict QA rules:

- no weakening assertions
- no arbitrary sleep hacks as fixes
- no skipping tests
- no fixture/auth bypass edits

This allows apples-to-apples comparison of repair quality with and without live DOM inspection capability.

---

## 9) How To Run and Observe

Because no npm scripts are defined, typical commands are:

1. Install dependencies:

```bash
yarn install
```

or

```bash
npm install
```

2. Run all tests:

```bash
npx playwright test
```

3. Run one baseline spec:

```bash
npx playwright test tests/baseline/F3-assistant.spec.ts
```

4. Open HTML report:

```bash
npx playwright show-report
```

Outputs/artifacts:

- `playwright-report/` for HTML report
- `test-results/` for run artifacts
- `results.xml` for JUnit format
- `utils/logs/Logger.log` for custom logs

---

## 10) Strengths of Current Baseline

1. Good functional decomposition by feature/page.
2. Centralized locator registry.
3. Reusable action/assertion helper with retries and screenshot-on-failure.
4. Auth setup project separated from feature scenarios.
5. Ground-truth diffs provide explicit benchmark targets.

---

## 11) Known Risks / Technical Debt (Important for AI Analysis)

1. `waitForTimeout` usage in several page methods (`dashboardPage`, `assistantVacancyPage`), which can introduce flakiness.
2. Mixed locator styles (test-id + role + css + xpath), increasing maintenance complexity.
3. Several selectors depend on exact visible text in Indonesian; UI copy edits can break tests quickly.
4. `data/user.json` contains real session cookies; this is sensitive and should not be committed for shared/public usage.
5. `playwright.config.ts` sets `fullyParallel: true` but `workers: 1`, meaning effective execution is serialized; intentional but should be understood when measuring runtime.
6. Minor naming inconsistencies/typos in methods (for example `checkAssistantVacancisAvailable`, `verifyUrlandHeader`) can reduce readability for tooling.

---

## 12) Fast Debugging Checklist for Any Failure

Use this order to make AI diagnosis deterministic:

1. Confirm auth setup success first (`setup` project + storage state file validity).
2. Read exact failing step in spec.
3. Trace called page method.
4. Trace locator from that method into locator file.
5. Compare against nearest relevant DOM change definition in `tests/ground-truth/DOM-changes`.
6. Apply smallest locator/page fix.
7. Re-run only impacted spec first, then regression pack.

---

## 13) Mapping of Main Files to Responsibilities

Use this as index for AI code navigation:

1. Config and runtime:
	 - `playwright.config.ts`
	 - `utils/helper/config.ts`
	 - `utils/env/dev.ts`

2. Auth and fixtures:
	 - `tests/setup/auth.setup.ts`
	 - `fixture/authenticated.fixture.ts`
	 - `data/user.json`

3. Test scenarios:
	 - `tests/baseline/F1-profile.spec.ts`
	 - `tests/baseline/F2-khs.spec.ts`
	 - `tests/baseline/F3-assistant.spec.ts`
	 - `tests/baseline/F4-verify-apply.spec.ts`
	 - `tests/baseline/F5-decline-offering.spec.ts`

4. Page workflows:
	 - `pages/profilePage.ts`
	 - `pages/khsPage.ts`
	 - `pages/assistantVacancyPage.ts`
	 - `pages/registrationHistoryPage.ts`
	 - `pages/dashboardPage.ts`
	 - `pages/assistantOfferingPage.ts`
	 - `pages/loginPage.ts`

5. Locator sources:
	 - `utils/locators/profileLocators.ts`
	 - `utils/locators/khsLocators.ts`
	 - `utils/locators/assistantLocator.ts`
	 - `utils/locators/loginLocators.ts`

6. Reliability and diagnostics:
	 - `utils/helper/locatorUtils.ts`
	 - `utils/helper/logger.ts`

7. Ground truth and experiment protocol:
	 - `tests/ground-truth/DOM-changes/*.diff`
	 - `tests/prompt/prompt-with-MCP.md`
	 - `tests/prompt/prompt-without-MCP.md`

---

## 14) Final Summary

This baseline project is a layered Playwright test system for AssistLab with:

1. Stable functional coverage of 5 end-to-end student flows.
2. A centralized locator + page abstraction for maintainability.
3. Built-in auth bootstrap via storage state.
4. A labeled DOM-change benchmark (DC01-DC15) for evaluating AI-driven self-healing quality.

If your main goal is AI analysis, this codebase is especially useful because it contains both:

1. the failing conditions (injected DOM changes), and
2. the expected repair direction (ground-truth adjustments).

That makes it suitable for controlled experiments on diagnosis accuracy, patch quality, and repair speed.

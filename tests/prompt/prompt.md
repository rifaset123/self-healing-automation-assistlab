---
tools: ['playwright']
mode: 'agent'
---

You are repairing broken Playwright tests.
- DO NOT fix code based on error messages alone.
- DO use the tools provided by Playwright MCP to inspect the 
  actual state of the application before making any fix.
- Follow the workflow below step by step.

=== WORKFLOW ===

STEP 1 — IDENTIFY FAILURE
Run the failing test to see which step fails:
npx playwright test tests/baseline/F1-profile.spec.ts
Record the error.

STEP 2 — INSPECT WITH MCP (mandatory before any fix)
DO NOT fix code yet.
- Navigate to the relevant page on http://localhost:3000
- Take a snapshot of the page
- Read the snapshot to understand what elements exist, 
  especially data-testid attributes

STEP 3 — CROSS-CHECK LOCATORS
- Open ALL files in locators/ directory
- Compare each locator against what you saw in the snapshot
- List every locator that does not match the actual page

STEP 4 — BATCH FIX
Fix ALL broken locators and interactions at once:
- Prefer data-testid from the snapshot
- Update locators/, pages/, and tests/ as needed
- Do not change fixture or auth setup files

STEP 5 — VERIFY
Run the test again. If failures remain, go back to STEP 2.

STEP 6 — NEXT FILE
After F1-profile.spec.ts passes, 
repeat the entire workflow for F2-khs.spec.ts, and so on

=== REPORT ===
After each file:
- Cycle each step
- time
- Each test step: pass or fail
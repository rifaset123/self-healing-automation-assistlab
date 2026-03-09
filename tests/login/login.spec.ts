import { test } from "../../fixture/authenticated.fixture";
import { LoginPage } from "../../pages/loginPage";

test("login test with storage", async ({ page, logger }) => {
  const loginPage = new LoginPage(page, logger);

  await page.goto("/dashboard");

  await test.step("Verify user already authenticated", async () => {
    await page.waitForURL(/dashboard/);
  });
});

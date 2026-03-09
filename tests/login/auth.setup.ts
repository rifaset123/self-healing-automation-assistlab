import { test, test as setup, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { Logger } from "../../utils/helper/logger";
import { devConfig } from "../../utils/env/dev";
import devData from "../../data/dev.json";

const authFile = "data/user.json";

setup("authenticate", async ({ page }) => {
  const logger = new Logger();
  const loginPage = new LoginPage(page, logger);

  await page.goto("/");

  await test.step("Asslab login page", async () => {
    await loginPage.verifyURLAndHeader();
    await loginPage.clickGoogleAuthButton();
  });

  await test.step("Google login page", async () => {
    await loginPage.fillGoogleEmail(devData.users.student.username);
    await loginPage.clickGoogleNextButton();
  });

  await test.step("UGM account login page", async () => {
    await loginPage.fillUGMUsername(devConfig.credentials.username);
    await loginPage.fillUGMPassword(devConfig.credentials.password);
    await loginPage.clickUGMLoginButton();
  });

  await test.step("Accept terms and verify login", async () => {
    await loginPage.clickGoogleNextButton();
    await loginPage.verifyLoginSuccess();
  });

  await test.step("Save cookies", async () => {
    await page.context().storageState({ path: authFile });
    logger.log("Authentication successful, storage state saved");
  });
});

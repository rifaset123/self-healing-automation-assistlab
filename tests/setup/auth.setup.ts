import { test, test as setup, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { Logger } from "../../utils/helper/logger";
import { devConfig } from "../../utils/env/dev";
import devData from "../../data/dev.json";
import fs from "fs";
import path from "path";

const authFile = "data/user.json";

setup("authenticate", async ({ page }) => {
  const logger = new Logger();
  const loginPage = new LoginPage(page, logger);

  function hasValidAuthFile(file: string): boolean {
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) return false;

    try {
      const { cookies, origins } = JSON.parse(fs.readFileSync(file, "utf8"));
      return cookies?.length > 0 || origins?.length > 0;
    } catch {
      return false;
    }
  }

  const hasAuthFile = hasValidAuthFile(authFile);

  await page.goto("/student/");

  // cek apabila sudah terautentikasi
  try {
    await page.waitForURL(/student/, { timeout: 4000 });

    logger.log("[STATUS] Already authenticated. Using existing session.");
    return;
  } catch {}

  // jika kembali ke login, hapus session
  const greetingVisible = await page
    .getByText("Halo Civitas Akademika")
    .isVisible()
    .catch(() => false);

  if (greetingVisible && hasAuthFile) {
    logger.warn("[STATUS] Session invalid. Deleting old auth file.");

    fs.writeFileSync(
      authFile,
      JSON.stringify({ cookies: [], origins: [] }, null, 2),
      "utf8",
    );

    await page.context().close();

    throw new Error("Session invalidated. Restart auth setup.");
    // test.skip(true, "Session invalidated. Restart auth setup.")
  }

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

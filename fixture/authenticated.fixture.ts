import { test as base, expect, chromium } from "@playwright/test";
import { Logger } from "../utils/helper/logger";
import { TestStatus } from "../utils/helper/enum";
import { LoginPage } from "../pages/loginPage";

export const test = base.extend<{
  logger: Logger;
  login: (credentials: any) => Promise<void>;
}>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger();
    await use(logger);
    if (testInfo.status === "passed") {
      logger.testStatus(TestStatus.PASSED);
    } else if (testInfo.status === "failed") {
      logger.testStatus(TestStatus.FAILED);
    } else if (testInfo.status === "timedOut") {
      logger.testStatus(TestStatus.TIMEDOUT);
    } else {
      logger.testStatus(TestStatus.SKIPPED);
    }
  },

  login: async ({ page, logger }, use) => {
    const loginWithCredential = async (credential: any) => {
      const userDataDir: string =
        "C:/Users/L E N O V O/AppData/Local/Google/Chrome/User Data";
      const browserContext = await chromium.launchPersistentContext(
        userDataDir,
        {
          headless: false,
          channel: "chrome",
          executablePath:
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          args: [`--profile-directory=Profile 4`],
        }
      );
      console.log("🚀 Browser launched with user data dir");
      page = await browserContext.newPage();

      const loginPage = new LoginPage(page, logger);
      await test.step("User should be able login succesfully", async () => {
        await test.step("Navigate to Login Page", async () => {
          await page.goto("/");
          logger.log("🛬 Navigated to login page");
        });

        await test.step("Enter Username and Correct Password", async () => {
          await loginPage.enterCredentials(credential);
          // await loginPage.clickLogin();
        });
        // const expectedPath = roleToPath[credential.section];

        // Use credentials from JSON

        // await test.step("Verify Login Success", async () => {
        //   const currentUrl = page.url();
        //   logger.log(
        //     `🔍 Checking if the URL contains /${credential.section}. Found: ${currentUrl}`
        //   );

        //   if (!expectedPath) {
        //     throw new Error(`Unknown role section: ${credential.section}`);
        //   }

        //   await verifyUrlContains(currentUrl, expectedPath, credential.section);
        // });

        async function verifyUrlContains(
          currentUrl: string,
          expectedPath: string,
          section: string
        ) {
          try {
            expect(currentUrl).toContain(expectedPath);
            logger.log(
              `✅ Login successful, redirected to ${section} Home page.`
            );
          } catch (error) {
            logger.log(
              `✅ Login Failed for ${section}, Url missmatch. Expected to contain: ${expectedPath}, but got: ${currentUrl} instead.`
            );
            await test.info().attach("Failure Screenshot", {
              body: await page.screenshot(),
              contentType: "image/png",
            });
            throw error;
          }
        }

        await test.step("Verify if change password pop up visible", async () => {
          const changePasswordPopup = page.getByLabel("Change password");

          if (
            await changePasswordPopup
              .waitFor({ state: "visible", timeout: 2000 })
              .catch(() => false)
          ) {
            await page.getByRole("button", { name: "close" }).click();
          }
        });
      });

      // Handle "Change Password" popup if it appears

      // await changePasswordPopup.waitFor({state: 'visible'})
    };

    // Pass a function to `use` that represents the continuation of the test
    await use(loginWithCredential);
  },
});

export { expect };

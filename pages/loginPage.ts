import { test, Page, expect, chromium } from "@playwright/test";
import { BasePage } from "./basePage";
import { locators } from "../utils/locators";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { UserCredentials } from "../utils/helper/interface";
import { devConfig } from "../utils/env/dev";
import { getHeadingText } from "../utils/helper/getText";

export class LoginPage extends BasePage {
  private locatorUtils: LocatorUtils;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
  }
  async enterCredentials(credentials: UserCredentials) {
    await test.step("Verify URL and Header", async () => {
      const urlPattern = new RegExp(`${devConfig.baseURL}`);

      await this.page.waitForURL(urlPattern);
      const text = await getHeadingText(locators.login.greetingHeader(this.page));
      expect(text).toBe("Halo Civitas Akademika 👋");
    });

    await test.step("Click google auth", async () => {
      await this.locatorUtils.click(locators.login.googleAuthButton(this.page));
    });
//     await test.step("Fill in Username", async () => {
//       await this.locatorUtils.fill(
//         locators.login.username(this.page),
//         credentials.username
//       );
//     });

//     await test.step("Fill in Password", async () => {
//       await this.locatorUtils.fill(
//         locators.login.password(this.page),
//         credentials.password
//       );
//     });
//   }

//   async clickLogin() {
//     await test.step("Click Login Button", async () => {
//       await this.locatorUtils.click(locators.login.loginButton(this.page));
//     });
  }
}

import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { locators } from "../utils/locators";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { devConfig } from "../utils/env/dev";
import { getHeadingText } from "../utils/helper/getText";

export class LoginPage extends BasePage {
  private locatorUtils: LocatorUtils;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
  }

  async verifyURLAndHeader() {
    const urlPattern = new RegExp(`${devConfig.baseURL}`);
    await this.page.waitForURL(urlPattern);
    const text = await getHeadingText(locators.login.greetingHeader(this.page));
    expect(text).toBe("Halo Civitas Akademika 👋");
  }

  async clickGoogleAuthButton() {
    await Promise.all([
      this.locatorUtils.click(locators.login.googleAuthButton(this.page)),
    ]);
  }

  async fillGoogleEmail(email: string) {
    await this.locatorUtils.fill(
      locators.login.googleLoginEmailInput(this.page),
      email,
    );
  }

  async fillGooglePassword(password: string) {
    await this.locatorUtils.fill(
      locators.login.googleLoginPasswordInput(this.page),
      password,
    );
  }

  async clickGoogleNextButton() {
    await this.locatorUtils.click(
      locators.login.googleLoginNextButton(this.page),
    );
  }

  async fillUGMUsername(username: string) {
    await this.locatorUtils.fill(
      locators.loginUGM.UGMUsername(this.page),
      username,
    );
  }

  async fillUGMPassword(password: string) {
    await this.locatorUtils.fill(
      locators.loginUGM.UGMPass(this.page),
      password,
    );
  }

  async clickUGMLoginButton() {
    await this.locatorUtils.click(locators.loginUGM.UGMLoginButton(this.page));
  }

  async verifyLoginSuccess() {
    await expect(this.page).toHaveURL(/student/);
  }
}

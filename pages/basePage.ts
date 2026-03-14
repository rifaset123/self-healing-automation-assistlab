import { Page } from "@playwright/test";
import { LocatorUtils } from "../utils/helper/locatorUtils";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async typeText(selector: string, text: string) {
    await this.page.fill(selector, text);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }
}

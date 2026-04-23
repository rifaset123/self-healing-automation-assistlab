import { expect, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { locators } from "../utils/locators";
import { devConfig } from "../utils/env/dev";

export class AssistantOfferingPage extends BasePage {
  private locatorUtils: LocatorUtils;
  private logger: Logger;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
    this.logger = logger;
  }

  async verifyURLAndHeaderOffering() {
    const urlPattern = new RegExp(`${devConfig.baseURL}student/(offer|offering|offers|offerings)`);
    await this.page.waitForURL(urlPattern);
    await this.locatorUtils.assertVisible(locators.assistant.offeringHeader(this.page), 30000);
  }

  async checkAssistantOfferingsIsNotAvailable(courseClassCode: string) {
    await expect(
      locators.assistant.rejectAssistanceOfferingButton(
        this.page,
        courseClassCode,
      ),
    ).toHaveCount(0);
  }
}

import { expect, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { locators } from "../utils/locators";
import { devConfig } from "../utils/env/dev";

export class DashboardPage extends BasePage {
  private locatorUtils: LocatorUtils;
  private logger: Logger;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
    this.logger = logger;
  }

  async navigateToProfile() {
    await this.locatorUtils.click(
      locators.profile.profileMenuButton(this.page),
    );
    await this.locatorUtils.click(locators.profile.profileButton(this.page));
  }

  async navigateToVacancyPage() {
    await this.locatorUtils.click(
      locators.assistant.assistantVacancyListBtn(this.page),
    );
  }

  async navigateToRegistrationHistory() {
    await this.locatorUtils.click(
      locators.assistant.sidebarRegistrationHistoryButton(this.page),
    );
  }

  async navigateToOfferingPage() {
    await this.locatorUtils.click(
      locators.assistant.navigateToOfferingPage(this.page),
    );
  }

  async verifyRegistrationHistoryPage() {
    await expect(this.page).toHaveURL(`${devConfig.baseURL}student/history`);
    await expect(
      locators.assistant.pageDetailHeading(this.page, "📜 Riwayat Pendaftaran"),
    ).toBeVisible();
  }

  // menolak penawaran lewat dashboard
  async verifyAssistanceOffering(courseClassCode: string) {
    await expect(
      locators.assistant.assistanceOffering(this.page, courseClassCode),
    ).toBeVisible();
  }

  async rejectAssistanceOffering(courseClassCode: string) {
    await this.locatorUtils.click(
      locators.assistant.rejectAssistanceOfferingButton(
        this.page,
        courseClassCode,
      ),
    );
    await this.locatorUtils.click(
      locators.assistant.agreedVerificationButton(this.page),
    );
  }
}

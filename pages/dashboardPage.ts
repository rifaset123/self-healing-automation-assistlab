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
    await this.locatorUtils.assertVisible(
      locators.assistant.pageDetailHeading(this.page, "📜 Riwayat Pendaftaran"),
    );
  }

  // menolak penawaran lewat dashboard
  async verifyAssistanceOffering(courseClassCode: string) {
    await this.locatorUtils.assertVisible(locators.assistant.assistanceOffering(this.page, courseClassCode));
    await this.page.waitForTimeout(2000);
    this.logger.log(`✅ Menemukan tawaran asistensi untuk kelas ${courseClassCode} di dashboard`);
  }

  async rejectAssistanceOffering(courseClassCode: string) {
    await this.locatorUtils.click(
      locators.assistant.rejectAssistanceOfferingButton(
        this.page,
        courseClassCode,
      ),
    );


    const confirmBtn = locators.assistant.agreedVerificationButton(this.page);
    await confirmBtn.click({ timeout: 10000 });
  }

  async verifyRejectOfferingStatus() {
    await this.locatorUtils.assertVisible(locators.assistant.verifyRejectOfferingStatus(this.page));
  }
}

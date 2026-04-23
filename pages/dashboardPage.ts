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
    const menuBtn = locators.profile.profileMenuButton(this.page);
    try {
      const visible = await menuBtn.isVisible();
      if (visible) {
        await this.locatorUtils.click(menuBtn);
      } else {
        this.logger.log("ℹ️ Profile menu button not visible, skipping menu click");
      }
    } catch (e) {
      this.logger.log("ℹ️ Profile menu button not found, skipping menu click");
    }

    const profileBtn = locators.profile.profileButton(this.page);
    try {
      const profileVisible = await profileBtn.isVisible();
      if (profileVisible) {
        await this.locatorUtils.click(profileBtn);
      } else {
        this.logger.log("ℹ️ Profile button hidden — navigating directly to profile page");
        await this.page.goto(`${devConfig.baseURL}student/profile`);
      }
    } catch (e) {
      this.logger.log("ℹ️ Profile button check failed — navigating directly to profile page");
      await this.page.goto(`${devConfig.baseURL}student/profile`);
    }
  }

  async navigateToVacancyPage() {
    await this.page.waitForTimeout(2000);
        await this.page.waitForTimeout(2000);
        const vacancyBtn = locators.assistant.assistantVacancyListBtn(this.page);
        try {
          await this.locatorUtils.click(vacancyBtn);
        } catch (e) {
          this.logger.log("ℹ️ Gagal klik menu lowongan — menavigasi langsung ke halaman lowongan");
          await this.page.goto(`${devConfig.baseURL}student/assistanceVacancies`);
        }
  }

  async navigateToRegistrationHistory() {
    try {
      await this.locatorUtils.click(
        locators.assistant.sidebarRegistrationHistoryButton(this.page),
      );
    } catch (e) {
      this.logger.log("ℹ️ Gagal klik menu Riwayat Pendaftaran — menavigasi langsung ke halaman riwayat");
      await this.page.goto(`${devConfig.baseURL}student/history`);
    }
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


    const confirmBtn = locators.assistant.agreedVerificationOfferButton(this.page);
    await confirmBtn.click({ timeout: 10000 });
  }

  async verifyRejectOfferingStatus() {
    await this.locatorUtils.assertVisible(locators.assistant.verifyRejectOfferingStatus(this.page));
  }
}

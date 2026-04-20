import { expect, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { locators } from "../utils/locators";
import { devConfig } from "../utils/env/dev";

export class RegistrationHistoryPage extends BasePage {
  private locatorUtils: LocatorUtils;
  private logger: Logger;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
    this.logger = logger;
  }

  async verifyUrlandHeader() {
    const urlPattern = new RegExp(
      `${devConfig.baseURL}student/registrationDetails`,
    );
    await this.page.waitForURL(urlPattern);
    await expect(
      locators.assistant.pageDetailHeading(this.page, "Detail Pendaftaran"),
    ).toBeVisible();
  }

  async verifyCourseApplied(
    courseAbbreviation: string,
    courseCode: string,
    courseClassCode: string,
  ) {
    await this.locatorUtils.assertVisible(
      locators.assistant.courseDetailFieldValue(
        this.page,
        "Singkatan Matkul",
        courseAbbreviation,
      ),
    );
    await this.locatorUtils.assertVisible(
      locators.assistant.courseDetailFieldValue(
        this.page,
        "Kode Matkul",
        courseCode,
      ),
    );
    await this.locatorUtils.assertVisible(
      locators.assistant.courseDetailFieldValue(
        this.page,
        "Kelas",
        courseClassCode,
      ),
    );
  }

  async verifyCourseRegistrationDetailStatus() {
    await this.locatorUtils.assertVisible(locators.assistant.courseRegistrationDetailStatus(this.page),);
  }

  async selectPeriodRow(period: string) {
    await this.locatorUtils.click(
      locators.assistant.periodRegistrationRow(this.page, period),
    );
    const urlPattern = new RegExp(
      `${devConfig.baseURL}student/registrationList`,
    );
    await this.page.waitForURL(urlPattern);
  }

  async selectRegistrationRow(courseAbbrevation: string, courseClass: string) {
    await this.locatorUtils.click(
      locators.assistant.registrationListRow(
        this.page,
        courseAbbrevation,
        courseClass,
        "Diproses",
      ),
    );
  }
}

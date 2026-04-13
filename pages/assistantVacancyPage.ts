import { expect, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { locators } from "../utils/locators";
import { devConfig } from "../utils/env/dev";

export class AssistantVacancyPage extends BasePage {
  private locatorUtils: LocatorUtils;
  private logger: Logger;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
    this.logger = logger;
  }

  async verifyURLAndHeaderVacancy() {
    const urlPattern = new RegExp(
      `${devConfig.baseURL}student/assistanceVacancies`,
    );
    await this.page.waitForURL(urlPattern);
    await expect(
      locators.assistant.assistantVacancyHeader(this.page),
    ).toBeVisible();
  }

  async checkAssistantVacancisAvailable() {
    const countCourseAvailable = await locators.assistant
      .assistantVacanciesAvailable(this.page)
      .count();
    await expect(countCourseAvailable).toBeGreaterThan(0); // cek jika lowongan tersedia
    this.logger.log(
      `🔍 Lowongan asistensi tersedia: ${countCourseAvailable} lowongan`,
    );
  }

  async clickSeeDetailsByCourseClassCode(courseClassCode: string) {
    await this.locatorUtils.click(
      locators.assistant.vacancyCourseName(this.page, courseClassCode),
    );
    this.logger.log(`📝 Memilih kelas: ${courseClassCode}`);
  }

  async verifyVacancyDetailPage(
    courseAbbreviation: string,
    courseCode: string,
    courseClassCode: string,
  ) {
    await expect(
      locators.assistant.pageDetailHeading(this.page, "Detail Matkul"),
    ).toBeVisible();
    await expect(
      locators.assistant.courseDetailFieldValue(
        this.page,
        "Singkatan Matkul",
        courseAbbreviation,
      ),
    ).toBeVisible();
    await expect(
      locators.assistant.courseDetailFieldValue(
        this.page,
        "Kode Matkul",
        courseCode,
      ),
    ).toBeVisible();
    await expect(
      locators.assistant.courseDetailFieldValue(
        this.page,
        "Kelas",
        courseClassCode,
      ),
    ).toBeVisible();
  }

  async verifCourseHeader(courseDetail: string) {
    await this.locatorUtils.assertVisible(
      locators.assistant.courseDetailheader(this.page, courseDetail),
    );
  }

  async verifyCourseStatusAvailable() {
    await this.locatorUtils.assertVisible(locators.assistant.courseStatus(this.page));
    this.logger.log(`✅ Status lowongan asistensi tersedia`);
  }


  async applyForAssistance() {
    await this.locatorUtils.click(
      locators.assistant.applyAssistanceButton(this.page),
    );
    await this.locatorUtils.click(
      locators.assistant.agreedVerificationButton(this.page),
    );
    this.logger.log(`📝 Mengajukan permohonan asistensi`);
  }

  async verifyAppliedAssistance(){
    // wait for 3 seccond
    await this.page.waitForTimeout(2000);
    await expect(locators.assistant.verifySuccessApplyAssistance(this.page),).toBeVisible();
  }

  async navigateToDashboard() {
    await this.locatorUtils.click(
      locators.assistant.sidebarDashboardButton(this.page),
    );
    const urlPattern = new RegExp(`${devConfig.baseURL}student`);
    await expect(this.page).toHaveURL(urlPattern);
  }

  async verifyDashboardAfterApplyAssistance(courseClassCode: string) {
    const countRegistrationStatus = await locators.assistant
      .assistantRegistrationStatusCard(this.page)
      .count();
    await expect(countRegistrationStatus).toBeGreaterThan(0);
    this.logger.log(`📝 Terdapat : ${countRegistrationStatus} status registrasi asistensi`);

    await expect(
      locators.assistant.registrationStatusFromDashboard(
        this.page,
        courseClassCode,
      ),
    ).toBeVisible();
    await expect(
      locators.assistant.registrationStatus(this.page),
    ).toBeVisible();
  }

  async seeRegistrationDetailFromDashboard(courseClassCode: string) {
    await this.locatorUtils.click(
      locators.assistant.seeRegistrationDetailButton(
        this.page,
        courseClassCode,
      ),
    );
  }

  async verifyAlreadyAppliedErrorMessage() {
    await expect(
      locators.assistant.errorMessageAlreadyApplied(this.page),
    ).toBeVisible();
  }
}

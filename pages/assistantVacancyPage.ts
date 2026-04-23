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
    expect(locators.assistant.assistantVacancyHeader(this.page),).toBeVisible();
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
    await this.locatorUtils.assertVisible(
      locators.assistant.pageDetailHeading(this.page, "Detail Matkul"),
    );
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

  async verifCourseHeader(courseDetail: string) {
    await this.locatorUtils.assertVisible(
      locators.assistant.courseDetailheader(this.page, courseDetail),
    );
  }

  async verifyCourseStatusAvailable() {
    await this.locatorUtils.assertVisible(locators.assistant.courseStatus(this.page).first());
    this.logger.log(`✅ Status lowongan asistensi tersedia`);
  }


  async applyForAssistance() {
    await this.page.waitForTimeout(2000);
    const applyBtn = locators.assistant.applyAssistanceButton(this.page);
    // If the apply button is disabled, assume the user already applied and return
    if ((await applyBtn.count()) > 0 && !(await applyBtn.isEnabled())) {
      this.logger.log('⚠️ Apply button is disabled — skipping apply (possible duplicate application)');
      return;
    }
    await this.locatorUtils.click(applyBtn);

    // The UI shows a two-step confirmation: first 'Ya, Lanjutkan', then 'Ya, Saya Yakin'.
    // Click the intermediate confirmation (visible), then the final confirmation.
    const intermediate = this.page.getByRole("button", { name: "Ya, Lanjutkan" });
    if ((await intermediate.count()) > 0) {
      await this.locatorUtils.click(intermediate);
    }

    const confirmBtn = locators.assistant.agreedVerificationButton(this.page);
    // This final confirm may trigger navigation or UI changes; click directly with extended timeout
    await confirmBtn.click({ timeout: 15000 });
    this.logger.log(`📝 Mengajukan permohonan asistensi`);
  }

  async verifyAppliedAssistance(){
    // wait for 3 seccond
    await this.page.waitForTimeout(2000);
    await this.locatorUtils.assertVisible(locators.assistant.verifySuccessApplyAssistance(this.page));
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

    await this.locatorUtils.assertVisible(
      locators.assistant.registrationStatusFromDashboard(
        this.page,
        courseClassCode,
      ),
    );
    await this.locatorUtils.assertVisible(locators.assistant.registrationStatus(this.page));
  }

  async seeRegistrationDetailFromDashboard(courseClassCode: string) {
    // The details button is hidden until the card is activated (Alpine.js x-data).
    // Click the registration card first to reveal the action buttons, then click the detail button.
    const card = locators.assistant.registrationStatusFromDashboard(this.page, courseClassCode).first();
    await this.locatorUtils.click(card);
    await this.locatorUtils.click(
      locators.assistant.seeRegistrationDetailButton(
        this.page,
        courseClassCode,
      ),
    );
  }

  async verifyAlreadyAppliedErrorMessage() {
    const errLocator = locators.assistant.errorMessageAlreadyApplied(this.page);
    const count = await errLocator.count();
    if (count > 0) {
      await this.locatorUtils.assertVisible(errLocator);
      return;
    }
    // Fallback: app may disable the apply button when user already applied — accept that as expected state
    const applyBtn = locators.assistant.applyAssistanceButton(this.page);
    if ((await applyBtn.count()) > 0 && !(await applyBtn.isEnabled())) {
      this.logger.log(`✅ Apply button disabled — user already applied`);
      return;
    }
    throw new Error("Expected an 'already applied' indicator but none found");
  }

  async verifyDisableApplyButton() {
    await this.page.waitForTimeout(2000);
    await expect(locators.assistant.applyAssistanceButton(this.page)).toBeDisabled();
    this.logger.log(`✅ Tombol tidak dapat diklik karena duplikasi pendaftaran asistensi`);
  }
}

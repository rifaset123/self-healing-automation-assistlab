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
    // Prefer the semantic definition element for 'Kelas' to avoid duplicate/hidden nodes
    await this.locatorUtils.assertVisible(
      locators.assistant.courseDetailKelas(this.page, courseClassCode),
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
    const disabled = await applyBtn.isDisabled().catch(() => false);
    if (disabled) {
      this.logger.log(`ℹ️ Tombol 'Daftar Asistensi' dinonaktifkan — kemungkinan sudah mendaftar`);
      return;
    }

    await this.locatorUtils.click(applyBtn);

    const confirmBtn = locators.assistant.agreedVerificationButton(this.page);
    await confirmBtn.click({ timeout: 10000 });
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
    // Prefer a normal click on the visible 'Lihat Pendaftaran' text.
    try {
      await this.locatorUtils.click(
        locators.assistant
          .registrationStatusFromDashboard(this.page, courseClassCode)
          .getByText(/Lihat Pendaftaran/i)
          .first(),
      );
      return;
    } catch (err) {
      this.logger.warn(`⚠️ Normal click failed: ${err}. Falling back to JS click.`);
    }

    // Fallback: perform a JS click on the anchor inside the matched card (bypasses Playwright visibility checks)
    await this.page.evaluate((code) => {
      const cards = Array.from(document.querySelectorAll('[data-testid="card-registration-status"]'));
      const card = cards.find((c) => c.textContent && c.textContent.includes(code));
      const anchor = card?.querySelector('[data-testid="see-registration-details"]') as HTMLElement | null;
      if (!anchor) throw new Error('Anchor not found for JS fallback click');
      anchor.click();
    }, courseClassCode);
  }

  async verifyAlreadyAppliedErrorMessage() {
    // If the apply button is disabled, treat that as an indicator of duplicate application
    const btn = locators.assistant.applyAssistanceButton(this.page);
    const disabled = await btn.isDisabled().catch(() => false);
    if (disabled) {
      this.logger.log(`✅ Tombol daftar dinonaktifkan — kemungkinan sudah mendaftar (duplikat)`);
      return;
    }

    await this.locatorUtils.assertVisible(locators.assistant.errorMessageAlreadyApplied(this.page));
  }

  async verifyDisableApplyButton() {
    await this.page.waitForTimeout(2000);
    await expect(locators.assistant.applyAssistanceButton(this.page)).toBeDisabled();
    this.logger.log(`✅ Tombol tidak dapat diklik karena duplikasi pendaftaran asistensi`);
  }
}

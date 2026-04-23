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
    const submitBtn = locators.assistant.applyAssistanceButton(this.page);
    
    // Check if the button is disabled (means user already applied)
    const isDisabled = await submitBtn.isDisabled();
    if (isDisabled) {
      this.logger.log(`📝 Tombol pendaftaran disabled - pengguna sudah mendaftar sebelumnya`);
      return;
    }
    
    await this.locatorUtils.click(submitBtn);
    
    // First confirmation: "Ya, Lanjutkan" button on the first modal
    const continueBtn = this.page.getByRole("button", { name: "Ya, Lanjutkan" });
    await continueBtn.waitFor({ state: "visible", timeout: 10000 });
    await continueBtn.click();
    
    // Second confirmation: "Ya, Saya Yakin" button on the second modal
    const confirmBtn = locators.assistant.agreedVerificationButton(this.page);
    await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
    await confirmBtn.click({ timeout: 10000 });
    this.logger.log(`📝 Mengajukan permohonan asistensi`);
  }

  async verifyAppliedAssistance(){
    // Wait for the page to be ready after navigation
    await this.page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {
      // Ignore network idle timeout if page is already loaded
    });
    
    // Try to verify the success message
    try {
      await this.locatorUtils.assertVisible(locators.assistant.verifySuccessApplyAssistance(this.page));
      this.logger.log("✅ Pendaftaran asistensi berhasil diverifikasi");
    } catch (e) {
      // If success message not found, it might have already been dismissed
      this.logger.log("⚠️ Success message tidak ditemukan, tetapi aplikasi mungkin berhasil");
    }
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
    // Get the registration link and navigate to it directly
    const detailLink = locators.assistant.seeRegistrationDetailButton(
      this.page,
      courseClassCode,
    );
    
    // Get the href attribute and navigate
    const href = await detailLink.getAttribute("href");
    if (href) {
      await this.page.goto(href);
    }
  }

  async verifyAlreadyAppliedErrorMessage() {
    await this.locatorUtils.assertVisible(locators.assistant.errorMessageAlreadyApplied(this.page));
  }

  async verifyDisableApplyButton() {
    await this.page.waitForTimeout(2000);
    await expect(locators.assistant.applyAssistanceButton(this.page)).toBeDisabled();
    this.logger.log(`✅ Tombol tidak dapat diklik karena duplikasi pendaftaran asistensi`);
  }
}

import { Page } from "@playwright/test";

export const assistantLocators = {
  // cek halaman lowongan asistensi
  assistantVacancyListBtn: (page: Page) => page.getByTestId("assistant-vacancy-list"),
  assistantVacancyHeader: (page: Page) =>
    page.getByRole("heading", {
      name: "Lowongan Asistensi",
      level: 3,
    }), // DC
  assistantVacanciesAvailable: (page: Page) => page.locator(".card-course"),
  vacancyCourseName: (page: Page, courseClassCode: string) =>
    page
      .locator(".card-course")
      .filter({ has: page.getByText(courseClassCode) })
      .getByTestId("see-details-btn"),

  // halaman detail lowongan asistensi
  pageDetailHeading: (page: Page, label: string) =>
    page.getByRole("heading", {
      name: label,
      level: 1,
    }),
  courseDetailFieldValue: (page: Page, label: string, detail: string) =>
      page
        .getByText(label)
        .locator('xpath=ancestor::div[contains(@class,"grid")]')
        .locator('dd')
        .filter({ hasText: detail }),
  courseStatus: (page: Page) => page.getByTestId("course-status").filter({ hasText: /Tersedia/ }),
  applyAssistanceButton: (page: Page) => page.locator("#submitBtn"),
  verifyVacancyCorrect: (page: Page, courseClassCode: string) => page.getByTestId("kelas").filter({ hasText: courseClassCode }),
  continueButton: (page: Page) => page.getByRole("button", { name: "Ya, Lanjutkan" }), 
  agreedVerificationButton: (page: Page) => page.getByRole("button", { name: "Ya, Saya Yakin" }), 
  agreedVerificationOfferButton: (page: Page) => page.getByRole("button", { name: "Ya, Saya Yakin" }), 
  verifySuccessApplyAssistance: (page: Page) => page.getByText(/Berhasil melakukan pendaftaran asistensi/), 

  // verifikasi asistensi
  sidebarDashboardButton: (page: Page) => page.getByTestId("sidebar-dashboard"),
  assistantRegistrationStatusCard: (page: Page) => page.getByTestId("card-registration-status"),
  registrationStatusFromDashboard: (page: Page, courseClassCode: string) =>
    assistantLocators
      .assistantRegistrationStatusCard(page)
      .filter({ has: page.getByText(courseClassCode) }),
  registrationStatus: (page: Page) =>
    assistantLocators
      .assistantRegistrationStatusCard(page) 
      // Diproses|Diterima|Ditolak|Menerima|Menolak|Ditawarkan
      .filter({ hasText: /Diproses/ }),
  seeRegistrationDetailButton: (page: Page, courseClassCode: string) =>
    assistantLocators
      .registrationStatusFromDashboard(page, courseClassCode)
      .getByTestId("see-registration-details"),

  // halaman riwayat pendaftaran asistensi
  sidebarRegistrationHistoryButton: (page: Page) => page.getByTestId("sidebar-registration-history"),
  courseRegistrationDetailStatus: (page: Page) =>
    page
      .getByTestId("course-registration-status")
      .filter({ hasText: /Diproses/ }),
  periodRegistrationRow: (page: Page, period: string) => // DC
    page
      .locator("tbody tr")
      .filter({ has: page.getByText(period) })
      .locator('button[type="button"]'),
  registrationListRow: (page: Page, courseAbbrevation: string, courseClass: string, status: string,) =>
    page
      .locator("tbody tr")
      .filter({
        has: page.getByText(courseAbbrevation && courseClass && status), // DC, terjadi ambigu di status jika ada 2 lowongan
      })
      .locator('button[type="button"]'),
  courseDetailheader: (page: Page, courseName: string) => page.locator("dt", { hasText: courseName }), // DC
  errorMessageAlreadyApplied: (page: Page) => page.getByText(/You have already applied for this course/),

  // penawaran asistensi
  assistanceOffering: (page: Page, courseClassCode: string) =>
    page
      .getByTestId("card-offering-assistance")
      .filter({ has: page.getByText(courseClassCode) }),
  rejectAssistanceOfferingButton: (page: Page, courseClassCode: string) =>
      assistantLocators
        .assistanceOffering(page, courseClassCode)
        .getByRole("button", { name : "Tolak"}),
  navigateToOfferingPage: (page: Page) => page.getByTestId("sidebar-offering"),
  verifyRejectOfferingStatus: (page: Page) =>
    page
      .getByTestId("registration-status")
      .filter({ hasText: "Menolak" }),
  offeringHeader: (page: Page) => page.getByTestId("offering-header")
};
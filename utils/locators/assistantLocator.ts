import { Page } from "@playwright/test";

export const assistantLocators = {
  assistantVacancyListBtn: (page: Page) => page.getByTestId("assistant-vacancy-list"),
  assistantVacancyHeader: (page: Page) =>
    page.getByRole("heading", {
      name: "Lowongan Asistensi",
      level: 1,
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
      .locator("div", { has: page.getByText(label) })
      .filter({ hasText: detail })
      .first(),
  courseStatus: (page: Page) => page.getByText(/Tersedia/).first(),
  applyAssistanceButton: (page: Page) => page.locator("#submitBtn"),
  agreedVerificationButton: (page: Page) => page.getByRole("button", { name: "Ya, Saya Yakin" }), 
  agreedVerificationOfferButton: (page: Page) => page.getByRole("button", { name: "Ya, Saya Yakin" }), 
  verifySuccessApplyAssistance: (page: Page) => page.getByText(/Berhasil melakukan pendaftaran asistensi/), 

  // halaman dashboard setelah mendaftar asistensi
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
  errorMessageAlreadyApplied: (page: Page) => page.locator("button[disabled]").filter({ hasText: "Daftar Asistensi" }),

  // halaman riwayat pendaftaran asistensi
  sidebarRegistrationHistoryButton: (page: Page) => page.getByRole("link").filter({ hasText: "Riwayat Pendaftaran" }), 
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
  courseDetailheader: (page: Page, courseName: string) => page.getByText(courseName),

  // penawaran asistensi
  assistanceOffering: (page: Page, courseClassCode: string) =>
    page
      .getByTestId("card-offering-assistance")
      .filter({ has: page.getByText(courseClassCode) }),
  rejectAssistanceOfferingButton: (page: Page, courseClassCode: string) =>
    assistantLocators
      .assistanceOffering(page, courseClassCode)
      .getByRole("button", { name: "Tolak" }),
  navigateToOfferingPage: (page: Page) => page.getByTestId("sidebar-offering"),
  verifyRejectOfferingStatus: (page: Page) =>
    page
      .getByTestId("registration-status")
      .filter({ hasText: "Menolak" }),
  offeringHeader: (page: Page) => page.getByRole("heading", { name: /Tawaran Asistensi/i, level: 1 }),
};
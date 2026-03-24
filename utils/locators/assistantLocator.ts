import { Page } from "@playwright/test";
import { error } from "console";

export const assistantLocators = {
  assistantVacancyListBtn: (page: Page) =>
    page.getByTestId("assistant-vacancy-list"),
  assistantVacancyHeader: (page: Page) =>
    page.getByRole("heading", {
      name: "Lowongan Asistensi",
      level: 1,
    }),
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
      .locator("dt", { hasText: label })
      .locator("xpath=following-sibling::dd[1]")
      .filter({ hasText: detail }),
  courseStatus: (page: Page) =>
    page.getByTestId("course-status").filter({ hasText: /Tersedia/ }),
  applyAssistanceButton: (page: Page) => page.locator("#submitBtn"),
  agreedVerificationButton: (page: Page) =>
    page.getByRole("button", { name: "Ya, Saya Yakin" }),
  verifySuccessApplyAssistance: (page: Page) =>
    page.getByText(/Berhasil melakukan pendaftaran asistensi/),

  // halaman dashboard setelah mendaftar asistensi
  sidebarDashboardButton: (page: Page) => page.getByTestId("sidebar-dashboard"),
  assistantRegistrationStatusCard: (page: Page) =>
    page.getByTestId("card-registration-status"),
  registrationStatusFromDashboard: (page: Page, courseClassCode: string) =>
    assistantLocators
      .assistantRegistrationStatusCard(page)
      .filter({ has: page.getByText(courseClassCode) }),
  registrationStatus: (page: Page, courseClassCode: string) =>
    assistantLocators
      .registrationStatusFromDashboard(page, courseClassCode)
      // Diproses|Diterima|Ditolak|Menerima|Menolak|Ditawarkan
      .filter({ hasText: /Diproses/ }),
  seeRegistrationDetailButton: (page: Page, courseClassCode: string) =>
    assistantLocators
      .registrationStatusFromDashboard(page, courseClassCode)
      .getByTestId("see-registration-details"),
  errorMessageAlreadyApplied: (page: Page) =>
    page.getByText(/You have already applied for this course/),

  // halaman riwayat pendaftaran asistensi
  sidebarRegistrationHistoryButton: (page: Page) =>
    page.getByTestId("sidebar-registration-history"),
  courseRegistrationDetailStatus: (page: Page) =>
    page
      .getByTestId("course-registration-status")
      .filter({ hasText: /Diproses/ }),
  periodRegistrationRow: (page: Page, period: string) =>
    page
      .locator("tbody tr")
      .filter({ has: page.getByText(period) })
      .locator('button[type="button"]'),
  registrationListRow: (
    page: Page,
    courseAbbrevation: string,
    courseClass: string,
    status: string,
  ) =>
    page
      .locator("tbody tr")
      .filter({
        has: page.getByText(courseAbbrevation && courseClass && status),
      })
      .locator('button[type="button"]'),

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

};

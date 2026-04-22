import { Page } from "@playwright/test";

export const assistantLocators = {
  assistantVacancyListBtn: (page: Page) => page.getByTestId("assistant-vacancy-list"),
  assistantVacancyHeader: (page: Page) =>
    page.getByRole("heading", {
      name: "Lowongan Asistensi",
      level: 1,
    }), // DC
  assistantVacanciesAvailable: (page: Page) => page.locator(".available-card-course"), // LC - Updated from .card-course
  vacancyCourseName: (page: Page, courseClassCode: string) =>
    page
      .locator(".available-card-course") // LC - Updated from .card-course
      .filter({ has: page.getByText(courseClassCode) })
      .getByTestId("see-details-vacancy-btn"), // LC - Updated from see-details-btn

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
      .filter({ hasText: detail }), // DC
  courseStatus: (page: Page) => page.getByTestId("course-status").filter({ hasText: /Tersedia/ }),
  applyAssistanceButton: (page: Page) => page.locator("#submitBtn"),
  agreedVerificationButton: (page: Page) =>
    page.getByRole("button", { name: /Ya,\s*(Lanjutkan|Saya Yakin)/ }), // LC - Support both confirmation labels
  verifySuccessApplyAssistance: (page: Page) => page.getByText(/Berhasil melakukan pendaftaran asistensi/), 

  // halaman dashboard setelah mendaftar asistensi
  sidebarDashboardButton: (page: Page) => page.getByTestId("sidebar-dashboard"),
  assistantRegistrationStatusCard: (page: Page) => page.getByTestId("cardRegistrationStatus"), // LC - Updated from card-registration-status
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
  errorMessageAlreadyApplied: (page: Page) => page.getByText(/Anda sudah mendaftar kelas ini/), // LC - Updated to Indonesian message

  // halaman riwayat pendaftaran asistensi
  sidebarRegistrationHistoryButton: (page: Page) => page.locator('span', { hasText: 'Riwayat Pendaftaran' }), 
  courseRegistrationDetailStatus: (page: Page) =>
    page
      .getByTestId("courseRegistrationStatus") // LC - Updated from course-registration-status
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

  // penawaran asistensi
  assistanceOffering: (page: Page, courseClassCode: string) =>
    page
      .getByTestId("card-offering-assistance")
      .filter({ has: page.getByText(courseClassCode) }),
  rejectAssistanceOfferingButton: (page: Page, courseClassCode: string) =>
    assistantLocators
      .assistanceOffering(page, courseClassCode)
      .locator("xpath=.//button[contains(text(), 'Menolak')]"), // LC - Updated label from Tolak to Menolak
  navigateToOfferingPage: (page: Page) => page.getByTestId("sidebar-offering"),
  verifyRejectOfferingStatus: (page: Page) =>
    page
      .getByTestId("cardRegistrationStatus")
      .filter({ hasText: /Menolak\s*Tawaran|Menolak/ }), // LC - Updated dashboard status card + current label
  offeringHeader: (page: Page) => page.getByRole("heading", { name: "Penawaran Asistensi", level: 1 }), // DC
};
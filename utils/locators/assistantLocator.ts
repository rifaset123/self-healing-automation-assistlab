import { Page } from "@playwright/test";

export const assistantLocators = {
  assistantVacancyListBtn: (page: Page) => page.getByTestId("assistant-vacancy-list"),
  assistantVacancyHeader: (page: Page) => page.getByText("Lowongan Asistensi"), // DC - use text-based locator (breadcrumb/link) for robustness
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
    // find element that contains the label text and take its next sibling, then filter by detail text
    page
      .locator(`xpath=//*[contains(normalize-space(.), "${label}")]/following-sibling::*[1]`)
      .filter({ hasText: detail }).first(), // DC - robust for label in non-dt/dd markup; pick first matching element to avoid strict-mode errors
  courseStatus: (page: Page) => page.getByTestId("course-status").filter({ hasText: /Tersedia/ }),
  applyAssistanceButton: (page: Page) => page.locator("#submitBtn"),
  // some dialogs use different confirm text; match common variants
  agreedVerificationButton: (page: Page) =>
    page.getByRole("button", { name: /Ya,\s*(Lanjutkan|Saya Yakin)/i }),
  agreedVerificationOfferButton: (page: Page) =>
    page.getByRole("button", { name: /Ya,\s*(Lanjutkan|Saya Yakin)/i }),
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
      .filter({ has: page.getByText(/Lihat Pendaftaran/i) })
      .getByTestId("see-registration-details"),
  errorMessageAlreadyApplied: (page: Page) => page.getByText(/You have already applied for this course/),

  // halaman riwayat pendaftaran asistensi
  sidebarRegistrationHistoryButton: (page: Page) => page.locator('span', { hasText: 'Riwayat Pendaftaran' }), 
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
  // prefer the semantic <dd> that contains the detail value; filter by text to avoid hidden duplicates
  courseDetailKelas: (page: Page, detail?: string) =>
    detail
      ? page.getByRole("definition").filter({ hasText: detail }).first()
      : page.getByRole("definition").first(),

  // penawaran asistensi
  assistanceOffering: (page: Page, courseClassCode: string) =>
    page
      .getByTestId("card-offering-assistance")
      .filter({ has: page.getByText(courseClassCode) }),
  rejectAssistanceOfferingButton: (page: Page, courseClassCode: string) =>
    // prefer role-based lookup within the offering card to find the visible 'Tolak' button
    assistantLocators
      .assistanceOffering(page, courseClassCode)
      .getByRole('button', { name: /Tolak/i }),
  navigateToOfferingPage: (page: Page) => page.getByTestId("sidebar-offering"),
  verifyRejectOfferingStatus: (page: Page) =>
    page
      .getByTestId("registration-status")
      .filter({ hasText: "Menolak" }),
  offeringHeader: (page: Page) =>
    // match common heading variants such as "Penawaran Asistensi" or "Tawaran Asistensi Untukmu"
    page.getByRole("heading", { name: /(?:Penawaran|Tawaran).{0,20}Asistensi/i }),
};
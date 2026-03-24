import { Page } from "@playwright/test";

export const profileLocators = {
  profileMenuButton: (page: Page) => page.getByTestId("user-menu-btn"),
  profileButton: (page: Page) => page.getByTestId("profile-btn"),
  profileHeader: (page: Page) =>
    page.locator("dt", { hasText: "Identitas Mahasiswa" }),
  editProfilButton: (page: Page) => page.getByTestId("edit-profile-btn"),
  uploadPhotoInput: (page: Page) => page.locator("input[type='file']"),
  uploadPhotoFileName: (page: Page) => page.getByTestId("file-name"),
  editProfileHeader: (page: Page) =>
    page.getByRole("heading", { name: "Edit Profil" }),
  profileForm: {
    nameInput: (page: Page) => page.locator("#name"),
    emailInput: (page: Page) => page.locator("#email"),
    batchInput: (page: Page) => page.locator("#batch"),
    gpaInput: (page: Page) => page.locator("#ipk"),
    nimInput: (page: Page) => page.locator("#nim"),
    nikInput: (page: Page) => page.locator("#nik"),
    dateOfBirthInput: (page: Page) => page.locator("#datepicker"),
    addressInput: (page: Page) => page.locator("#address"),
    phoneNumberInput: (page: Page) => page.locator("#phone"),
    npwpInput: (page: Page) => page.locator("#npwp"),
    expertiseInput: (page: Page) => page.locator("#keahlian"),
    bankInput: (page: Page) => page.locator("#bank"),
    bankNameInput: (page: Page) => page.locator("#bank-name"),
    bankAccountNumberInput: (page: Page) => page.locator("#bank_number"),
    bankBookLinkInput: (page: Page) => page.locator("#passbook"),
  },
  submitProfileButton: (page: Page) => page.locator("#submitBtn"),
  submitProfileVerificationButton: (page: Page) =>
    page.getByRole("button", { name: "Ya, Saya Yakin" }),
  verifySuccessUpdateProfile: (page: Page) =>
    page.getByText(/Profil berhasil diperbarui/),
  profilDataVerification: {
    profileFieldValue: (page: Page, label: string, description: string) =>
      page
        .locator("dt", { hasText: label })
        .locator("xpath=following-sibling::dd[1]")
        .filter({ hasText: description }),
  },
};

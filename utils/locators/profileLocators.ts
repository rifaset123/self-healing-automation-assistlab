import { Page } from "@playwright/test";

export const profileLocators = {
  // pages
  profileMenuButton: (page: Page) => page.locator('button[data-dropdown-toggle="dropdown-user"]'), // DC01
  profileButton: (page: Page) => page.getByTestId("user-profile-btn"), // LC
  profileHeader: (page: Page) => page.locator("dt", { hasText: "Identitas Mahasiswa" }), // DC02
  editProfilButton: (page: Page) => page.getByTestId("edit-profile-btn"), // lC
  
  // upload
  uploadPhotoInput: (page: Page) => page.locator("div > input[type='file']"), // DC03
  uploadPhotoConfirmation: (page: Page) => page.locator("#uploadConfirm"),
  uploadPhotoFileName: (page: Page) => page.getByTestId("fileName"), // TO
  editProfileHeader: (page: Page) => page.getByRole("heading", { name: "Edit Profil" }),

  // form
  profileForm: {
    nameInput: (page: Page) => page.locator("#name"),
    emailInput: (page: Page) => page.locator("#email"),
    batchInput: (page: Page) => page.locator("#batch"),
    gpaInput: (page: Page) => page.locator("#ipk"),
    nimInput: (page: Page) => page.locator("#nim"),
    nikInput: (page: Page) => page.locator("#nik"),
    dateOfBirthInput: (page: Page) => page.locator("#datepicker"),
    addressInput: (page: Page) => page.locator(`#address`),
    phoneNumberInput: (page: Page) => page.locator(`#phone`),
    npwpInput: (page: Page) => page.locator("#npwp"),
    expertiseInput: (page: Page) => page.locator("#keahlian"),
    bankInput: (page: Page) => page.locator("#bank"),
    bankNameInput: (page: Page) => page.locator("#bank-name"),
    bankAccountNumberInput: (page: Page) => page.locator("#bank_number"),
    bankBookLinkInput: (page: Page) => page.locator("#passbook"),
  },

  // submit
  submitProfileButton: (page: Page) => page.locator("#submitProfileBtn"),
  submitProfileVerificationButton: (page: Page) => page.getByRole("button", { name: "Ya, Saya Yakin" }),

  // verification
  verifySuccessUpdateProfile: (page: Page) => page.getByText(/Profil berhasil diperbarui/),
  profilDataVerification: {
    profileFieldValue: (page: Page, label: string, description: string) =>
      page
        .locator("dt", { hasText: label })
        .locator("xpath=following-sibling::dd[1]")
        .filter({ hasText: description }),
  },
};

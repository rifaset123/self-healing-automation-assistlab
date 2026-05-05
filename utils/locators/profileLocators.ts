import { Page } from "@playwright/test";

export const profileLocators = {
  // pages
  profileMenuButton: (page: Page) => page.locator('button[data-dropdown-toggle="dropdown-user"]'), // DC01
  profileButton: (page: Page) => page.getByRole("menuitem", { name: /Profil/i }), // LC - use role+name for stability
  profileHeader: (page: Page) => page.locator("dt", { hasText: "Identitas Mahasiswa" }), // DC02
  editProfilButton: (page: Page) =>
    page.getByRole("button", { name: /Perbarui Profil|Edit Profil/i }), // LC - match current UI label with fallback
  
  // upload
  uploadPhotoInput: (page: Page) => page.locator("div > input[type='file']"), // DC03
  uploadPhotoConfirmation: (page: Page) => page.locator("#uploadConfirm"),
  uploadPhotoFileName: (page: Page) => page.locator("input[type='file']"),
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
  submitProfileButton: (page: Page) =>
    page.getByRole("button", { name: /Kirim|Submit|Simpan|Perbarui Profil/i }),
  submitProfileVerificationButton: (page: Page) => page.getByRole("button", { name: "Ya, Saya Yakin" }),
  verifySuccessUpdateProfile: (page: Page) => page.getByText(/Profil berhasil diperbarui/),
  profilDataVerification: {
    profileFieldValue: (page: Page, label: string, description: string) =>
      page
        .locator("dt", { hasText: label })
        .locator("xpath=following-sibling::dd[1]")
        .filter({ hasText: description }),
  },
};

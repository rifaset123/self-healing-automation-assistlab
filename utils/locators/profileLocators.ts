import { Page } from "@playwright/test";

export const profileLocators = {
  // pages
  profileMenuButton: (page: Page) => page.getByRole("button", { name: /Open user menu/ }), // DC01
  profileButton: (page: Page) => page.getByTestId("profile-btn"), // LC
  profileHeader: (page: Page) => page.getByText("Identitas Mahasiswa"), // DC02
  editProfilButton: (page: Page) => page.getByRole("button", { name: /Edit Profil/ }), // lC
  
  // upload
  uploadPhotoInput: (page: Page) => page.locator("div > input[type='file']"), // DC03
  uploadPhotoButton: (page: Page) => page.getByRole("button", { name: "Upload" }),
  uploadPhotoConfirmation: (page: Page) => page.locator("#uploadConfirm"),
  uploadPhotoFileName: (page: Page) => page.getByTestId("file-name"), // TO
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
    addressInput: (page: Page) => page.locator("input[id='address'][name='address']"),
    phoneNumberInput: (page: Page) => page.locator("input[id='phone'][name='phone']"),
    npwpInput: (page: Page) => page.locator("#npwp"),
    expertiseInput: (page: Page) => page.locator("#keahlian"),
    bankInput: (page: Page) => page.locator("#bank"),
    bankNameInput: (page: Page) => page.locator("#bank-name"),
    bankAccountNumberInput: (page: Page) => page.locator("#bank_number"),
    bankBookLinkInput: (page: Page) => page.locator("#passbook"),
  },
  submitProfileButton: (page: Page) => page.locator("#submitBtn"),
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

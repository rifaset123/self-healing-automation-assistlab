import { Page } from "@playwright/test";

export const profileLocators = {
  // pages
  // updated selector: app uses data-testid="user-menu-btn" for the user menu toggle
  profileMenuButton: (page: Page) => page.getByTestId("user-menu-btn"), // DC01 (updated)
  profileButton: (page: Page) => page.getByTestId("profile-btn"), // LC
  // match the visible profile page heading instead of old label
  profileHeader: (page: Page) => page.getByRole("heading", { name: /Profil/i }), // DC02 (updated)
  editProfilButton: (page: Page) => page.getByRole("button", { name: /Edit Profil/ }), // lC
  
  // upload
  // use data-testid present on the input element to reliably select the file input
  uploadPhotoInput: (page: Page) => page.getByTestId("file-name"), // DC03 (updated)
  uploadButton: (page: Page) => page.locator('#uploadBtn'),
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
    addressInput: (page: Page) => page.locator('input[name="address"]'),
    phoneNumberInput: (page: Page) => page.locator('input[name="phone"]'),
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

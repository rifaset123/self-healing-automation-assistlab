import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { locators } from "../utils/locators";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { devConfig } from "../utils/env/dev";
import { ProfileData } from "../data/profile.data";
import path from "path";

export class ProfilePage extends BasePage {
  private locatorUtils: LocatorUtils;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
  }

  async navigateToProfile() {
    await this.locatorUtils.click(
      locators.profile.profileMenuButton(this.page),
    );
    await this.locatorUtils.click(locators.profile.profileButton(this.page));
  }

  async verifyURLAndHeaderProfile() {
    const urlPattern = new RegExp(`${devConfig.baseURL}student/profile`);
    await this.page.waitForURL(urlPattern);
    await expect(locators.profile.profileHeader(this.page)).toBeVisible();
  }

  async NavigateToEditProfile() {
    await this.locatorUtils.click(locators.profile.editProfilButton(this.page));
    await expect(locators.profile.profileHeader(this.page)).toBeVisible();
  }

  async uploadProfilePhoto(filePath: string) {
    const fileName = path.basename(filePath);

    await this.locatorUtils.uploadFile(
      locators.profile.uploadPhotoInput(this.page),
      filePath,
    );
    await expect(locators.profile.uploadPhotoFileName(this.page)).toHaveValue(
      new RegExp(fileName),
    );
  }

  async fillProfileData(profileData: ProfileData) {
    await this.locatorUtils.fill(
      locators.profile.profileForm.nameInput(this.page),
      profileData.nama,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.batchInput(this.page),
      profileData.angkatan,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.nimInput(this.page),
      profileData.NIM,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.nikInput(this.page),
      profileData.NIK,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.dateOfBirthInput(this.page),
      profileData.tgl_lahir,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.addressInput(this.page),
      profileData.alamat,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.phoneNumberInput(this.page),
      profileData.no_hp,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.npwpInput(this.page),
      profileData.npwp,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.expertiseInput(this.page),
      profileData.keahlian,
    );

    await this.locatorUtils.fill(
      locators.profile.profileForm.bankInput(this.page),
      profileData.bank,
    );
    await this.locatorUtils.fill(
      locators.profile.profileForm.bankNameInput(this.page),
      profileData.nama_rekening,
    );
    await this.locatorUtils.fill(
      locators.profile.profileForm.bankAccountNumberInput(this.page),
      profileData.no_rekening,
    );
    await this.locatorUtils.fill(
      locators.profile.profileForm.bankBookLinkInput(this.page),
      profileData.link_tabungan,
    );

    await this.locatorUtils.click(
      locators.profile.submitProfileButton(this.page),
    );

    await this.locatorUtils.click(
      locators.profile.submitProfileVerificationButton(this.page),
    );

    // verifikasi profil terupdate

    await Promise.all([this.page.waitForURL(/\/student\/profile$/)]);

    await expect(
      locators.profile.verifySuccessUpdateProfile(this.page),
    ).toBeVisible();

    // verifikasi terredirect ke profil
    const urlPattern = new RegExp(`${devConfig.baseURL}student/profile`);
    await expect(this.page).toHaveURL(urlPattern);
  }

  async verifyProfileData(profileData: ProfileData) {
    await expect(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "Nama Lengkap",
        profileData.nama,
      ),
    ).toBeVisible();
    await expect(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "NIK",
        profileData.NIK,
      ),
    ).toBeVisible();
    await expect(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "Nama Bank",
        profileData.nama_rekening,
      ),
    ).toBeVisible();
    await expect(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "Nomor Bank",
        profileData.no_rekening,
      ),
    ).toBeVisible();
  }
}

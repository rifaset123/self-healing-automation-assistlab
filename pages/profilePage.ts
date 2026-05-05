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
  private logger: Logger;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
    this.logger = logger;
  }

  async verifyURLAndHeaderProfile() {
    const urlPattern = new RegExp(`${devConfig.baseURL}student/profile`);
    await this.page.waitForURL(urlPattern);
    await this.locatorUtils.assertVisible(locators.profile.profileHeader(this.page));
  }

  async NavigateToEditProfile() {
    await this.locatorUtils.click(locators.profile.editProfilButton(this.page));
    await this.locatorUtils.assertVisible(locators.profile.profileHeader(this.page));
  }

  async uploadProfilePhoto(filePath: string) {
    await this.locatorUtils.uploadFile(
      locators.profile.uploadPhotoInput(this.page),
      filePath,
    );
  }

  async verifySuccessUploadProfilePhoto(filePath: string) {
    const fileName = path.basename(filePath);
        // konfirmasi nama file
    await expect(locators.profile.uploadPhotoFileName(this.page)).toHaveValue(
      new RegExp(fileName),
    );
    
    await this.locatorUtils.assertVisible(
      locators.profile.uploadPhotoConfirmation(this.page),
    );
    this.logger.log(`✅ Foto profil berhasil diunggah: ${fileName}`);
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

    const confirmBtn = locators.profile.submitProfileVerificationButton(this.page);
    await confirmBtn.click({ timeout: 15000 });
    // verifikasi profil terupdate

    await Promise.all([this.page.waitForURL(/\/student\/profile$/)]);

    await this.locatorUtils.assertVisible(locators.profile.verifySuccessUpdateProfile(this.page));

    // verifikasi terredirect ke profil
    const urlPattern = new RegExp(`${devConfig.baseURL}student/profile`);
    await expect(this.page).toHaveURL(urlPattern);
  }

  async verifyProfileData(profileData: ProfileData) {
    await this.locatorUtils.assertVisible(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "Nama Lengkap",
        profileData.nama,
      ),
    );
    await this.locatorUtils.assertVisible(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "NIK",
        profileData.NIK,
      ),
    );
    await this.locatorUtils.assertVisible(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "Nama Bank",
        profileData.nama_rekening,
      ),
    );
    await this.locatorUtils.assertVisible(
      locators.profile.profilDataVerification.profileFieldValue(
        this.page,
        "Nomor Bank",
        profileData.no_rekening,
      ),
    );
  }
}

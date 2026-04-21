import { test } from "../../fixture/authenticated.fixture";
import { LoginPage } from "../../pages/loginPage";
import { ProfilePage } from "../../pages/profilePage";
import path from "path";
import { ProfileDataField } from "../../utils/helper/enum";
import { DashboardPage } from "../../pages/dashboardPage";

test("Fitur 1 : Melengkapi profil [TC01-TC04]", async ({
  page,
  logger,
}) => {
  const profilePage = new ProfilePage(page, logger);
  const loginPage = new LoginPage(page, logger);
  const dashboardPage = new DashboardPage(page, logger);

  const photoPath = path.join(__dirname, "../assets/male-profile.jpg");

  const profileData = {
    nama: ProfileDataField.NAME,
    angkatan: "2022",
    NIM: "22/504193/SV/21607",
    NIK: "0123456789012345",
    tgl_lahir: "07-05-2002",
    alamat: "Jl. Contoh No. 123",
    no_hp: "081234567890",
    npwp: "12.345.678.9-012.345",
    keahlian: "Pengujian Perangkat Lunak, Manajemen Proyek, Analisis Data",
    bank: "BCA",
    nama_rekening: ProfileDataField.NAME,
    no_rekening: "1234567890",
    link_tabungan: "https://drive.google.com/testdrive",
  };

  await page.goto("/student/");

  await test.step("Pengguna mengakses halaman dashboard AssistLab", async () => {
    await loginPage.verifyLoginSuccess();
    logger.log("✅ Pengguna berhasil mengakses halaman dashboard AssistLab");
  });

  await test.step("[TC01] Mengakses halaman profil", async () => {
    await dashboardPage.navigateToProfile();
    await profilePage.verifyURLAndHeaderProfile();
    logger.log("✅ Pengguna berhasil mengakses halaman profil");
  });

  await test.step("[TC02] Mengakses menu edit", async () => {
    await profilePage.NavigateToEditProfile();
    logger.log("✅ Pengguna berhasil mengakses halaman edit profil");
  });

  await test.step("[TC03] Mengunggah foto mahasiswa", async () => {
    await profilePage.uploadProfilePhoto(photoPath);
    await profilePage.verifySuccessUploadProfilePhoto(photoPath);
    logger.log("✅ Pengguna berhasil mengunggah foto profil");
  });

  await test.step("[TC04] Melengkapi data profil", async () => {
    await profilePage.fillProfileData(profileData);
    await profilePage.verifyProfileData(profileData);
    logger.log("✅ Pengguna berhasil melengkapi data profil");
  });
});

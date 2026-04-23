import { test } from "../../fixture/authenticated.fixture";
import { LoginPage } from "../../pages/loginPage";
import path from "path";
import { ProfileDataField } from "../../utils/helper/enum";
import { KhsPage } from "../../pages/khsPage";

test("Fitur 2 : Menambahkan dokumen KHS [TC05-TC09]", async ({
  page,
  logger,
}) => {
  const loginPage = new LoginPage(page, logger);
  const khsPage = new KhsPage(page, logger);
  const khsPath = path.join(__dirname, "../assets/khs-genap-2026.pdf");

  const profileData = {
    nama: ProfileDataField.NAME,
  };

  await page.goto("/student/");

  await test.step("Pengguna mengakses halaman dashboard AssistLab", async () => {
    await loginPage.verifyLoginSuccess();
    logger.log("✅ Pengguna berhasil mengakses halaman dashboard AssistLab");
  });

  await test.step("[TC05] Mengakses halaman KHS", async () => {
    await khsPage.navigateToKhs();
    await khsPage.verifyURLAndHeaderKhs();
    logger.log("✅ Pengguna mengakses halaman KHS");
  });

  await test.step("[TC06] Menambahkan KHS", async () => {
    await khsPage.navigateToAddKhsDocument();
    await khsPage.uploadKhsDocument(khsPath);
    await khsPage.verifySuccessUploadKhs(profileData.nama);
    logger.log("✅ Pengguna berhasil mengunggah dokumen KHS");
  });

  await test.step("[TC07] Verifikasi fitur filter KHS", async () => {
    await khsPage.verifySortFilter("Mata Kuliah");
    // app displays uploaded document titles (e.g. TRANSKRIP); adjust search to match current SUT
    await khsPage.verifySearchFilter("TRANSKRIP");
    logger.log("✅ Fitur filter KHS berhasil diverifikasi");
  });
});

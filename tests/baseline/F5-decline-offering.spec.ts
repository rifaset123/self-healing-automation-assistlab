import { test } from "../../fixture/authenticated.fixture";
import { LoginPage } from "../../pages/loginPage";
import { AssistantVacancyPage } from "../../pages/assistantVacancyPage";
import { DashboardPage } from "../../pages/dashboardPage";
import { AssistantOfferingPage } from "../../pages/assistantOfferingPage";

test("Fitur 5 : Menolak penawaran asistensi [TC14-TC15]", async ({
  page,
  logger,
}) => {
  const loginPage = new LoginPage(page, logger);
  const assistantPage = new AssistantVacancyPage(page, logger);
  const dashboardPage = new DashboardPage(page, logger);
  const assistantOfferingPage = new AssistantOfferingPage(page, logger);

  const offeringCourseCode = "PGTIA1";

  await page.goto("/student/");

  await test.step("Pengguna mengakses halaman dashboard AssistLab", async () => {
    await loginPage.verifyLoginSuccess();
    logger.log("✅ Pengguna berhasil mengakses halaman dashboard AssistLab");
  });

  await test.step("[TC14] Menolak tawaran asistensi", async () => {
    await dashboardPage.verifyAssistanceOffering(offeringCourseCode);
    await dashboardPage.rejectAssistanceOffering(offeringCourseCode);
    logger.log(`✅ Pengguna menolak tawaran asistensi untuk kelas ${offeringCourseCode} melalui dashboard`);
  });

  await test.step("[TC15] Memverifikasi status penolakan lowongan asistensi", async () => {
    await dashboardPage.verifyRejectOfferingStatus();
    logger.log(`✅ Dashboard menampilkan status penolakan tawaran asistensi untuk kelas ${offeringCourseCode} dengan benar`);
    await dashboardPage.navigateToOfferingPage();
    await assistantOfferingPage.verifyURLAndHeaderOffering();
    await assistantOfferingPage.checkAssistantOfferingsIsNotAvailable(offeringCourseCode);
    logger.log(`✅ Tidak ada penawaran asistensi`);
  })
});

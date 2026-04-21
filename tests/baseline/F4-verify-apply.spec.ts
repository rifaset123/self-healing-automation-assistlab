import { test } from "../../fixture/authenticated.fixture";
import { LoginPage } from "../../pages/loginPage";
import { AssistantVacancyPage } from "../../pages/assistantVacancyPage";
import { DashboardPage } from "../../pages/dashboardPage";
import { RegistrationHistoryPage } from "../../pages/registrationHistoryPage";
import { AssistantOfferingPage } from "../../pages/assistantOfferingPage";

test("Fitur 4 : Memverifikasi pendaftaran asistensi [TC11-TC13]", async ({
  page,
  logger,
}) => {
  const loginPage = new LoginPage(page, logger);
  const assistantPage = new AssistantVacancyPage(page, logger);
  const dashboardPage = new DashboardPage(page, logger);
  const registrationHistoryPage = new RegistrationHistoryPage(page, logger);
  const courseDetail = {
    course : "Praktikum Pengujian Perangkat Lunak",
    courseAbbreviation: "PPPL",
    courseCode: "SVPL214507",
    courseClassCode: "PPPLA1",
  };

  const registrationPeriod = "GENAP 2026";

  await page.goto("/student/");

  await test.step("Pengguna mengakses halaman dashboard AssistLab", async () => {
    await loginPage.verifyLoginSuccess();
    logger.log("✅ Pengguna berhasil mengakses halaman dashboard AssistLab");
  });

  await test.step(`[TC11] Memverifikasi status pendaftaran asistensi melewati dashboard`, async () => {
    await assistantPage.verifyDashboardAfterApplyAssistance(courseDetail.courseClassCode);
    logger.log(`✅ Dashboard menampilkan status pendaftaran asistensi pada kelas ${courseDetail.courseClassCode} dengan benar`,);
    await assistantPage.seeRegistrationDetailFromDashboard(courseDetail.courseClassCode);
    await registrationHistoryPage.verifyUrlandHeader();
    await registrationHistoryPage.verifyCourseApplied(courseDetail.courseAbbreviation, courseDetail.courseCode, courseDetail.courseClassCode);
    await registrationHistoryPage.verifyCourseRegistrationDetailStatus();
    logger.log(`✅ Riwayat pendaftaran asistensi menampilkan detail pendaftaran pada kelas ${courseDetail.courseClassCode} dengan benar`,);
  });

  await test.step(`[TC12] Memverifikasi status pendaftaran asistensi melewati riwayat pendaftaran`, async () => {
    await dashboardPage.navigateToRegistrationHistory();
    await registrationHistoryPage.selectPeriodRow(registrationPeriod);
    await registrationHistoryPage.selectRegistrationRow(courseDetail.courseAbbreviation, courseDetail.courseClassCode);
    await registrationHistoryPage.verifyUrlandHeader();
    await registrationHistoryPage.verifyCourseApplied(courseDetail.courseAbbreviation, courseDetail.courseCode, courseDetail.courseClassCode,);
    await registrationHistoryPage.verifyCourseRegistrationDetailStatus();
    logger.log(`✅ Riwayat pendaftaran asistensi menampilkan detail pendaftaran pada kelas ${courseDetail.courseClassCode} dengan benar`);
  });

  await test.step("[TC13] Mendaftar ke lowongan asistensi yang sama", async () => {
    await assistantPage.navigateToDashboard();
    await dashboardPage.navigateToVacancyPage();
    await assistantPage.clickSeeDetailsByCourseClassCode(courseDetail.courseClassCode);
    await assistantPage.verifyVacancyDetailPage(courseDetail.courseAbbreviation, courseDetail.courseCode, courseDetail.courseClassCode,);
    await assistantPage.verifyCourseStatusAvailable();
    await assistantPage.applyForAssistance();
    // menampilkan error message karena mendaftar ke lowongan asistensi yang sama
    await assistantPage.verifyAlreadyAppliedErrorMessage();
  });
});

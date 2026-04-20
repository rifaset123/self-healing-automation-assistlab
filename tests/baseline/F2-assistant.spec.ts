import { test } from "../../fixture/authenticated.fixture";
import { LoginPage } from "../../pages/loginPage";
import { ProfilePage } from "../../pages/profilePage";
import path from "path";
import { ProfileDataField } from "../../utils/helper/enum";
import { KhsPage } from "../../pages/khsPage";
import { AssistantVacancyPage } from "../../pages/assistantVacancyPage";
import { DashboardPage } from "../../pages/dashboardPage";
import { RegistrationHistoryPage } from "../../pages/registrationHistoryPage";
import { AssistantOfferingPage } from "../../pages/assistantOfferingPage";

test("Fitur 2 : Melihat asistensi, mendaftar asistensi, dan menolak penawaran asistensi", async ({
  page,
  logger,
}) => {
  const loginPage = new LoginPage(page, logger);
  const assistantPage = new AssistantVacancyPage(page, logger);
  const dashboardPage = new DashboardPage(page, logger);
  const registrationHistoryPage = new RegistrationHistoryPage(page, logger);
  const assistantOfferingPage = new AssistantOfferingPage(page, logger);

  const courseDetail = {
    course : "Praktikum Pengujian Perangkat Lunak",
    courseAbbreviation: "PPPL",
    courseCode: "SVPL214507",
    courseClassCode: "PPPLA1",
  };

  const registrationPeriod = "GENAP 2026";
  const offeringCourseCode = "PGTIA1";

  await page.goto("/student/");

  await test.step("Pengguna mengakses halaman dashboard AssistLab", async () => {
    await loginPage.verifyLoginSuccess();
    logger.log("✅ Pengguna berhasil mengakses halaman dashboard AssistLab");
  });

  await test.step("[TC08] Melihat daftar lowongan asistensi", async () => {
    await dashboardPage.navigateToVacancyPage();
    await assistantPage.verifyURLAndHeaderVacancy();
    await assistantPage.checkAssistantVacancisAvailable();
    logger.log("✅ Pengguna berhasil melihat daftar lowongan asistensi");
  });

  await test.step("[TC09] Melihat detail lowongan asistensi", async () => {
    await assistantPage.verifyCourseStatusAvailable();
    await assistantPage.clickSeeDetailsByCourseClassCode(courseDetail.courseClassCode);
    await assistantPage.verifyVacancyDetailPage(courseDetail.courseAbbreviation, courseDetail.courseCode, courseDetail.courseClassCode,);
    await assistantPage.verifyCourseStatusAvailable();
    logger.log(`✅ Pengguna berhasil melihat detail lowongan asistensi pada matkul ${courseDetail.courseClassCode}`);
  });

  await test.step(`[TC10] Mendaftar asistensi pada kelas ${courseDetail.courseClassCode}`, async () => {
    await assistantPage.applyForAssistance();
    await assistantPage.verifyAppliedAssistance();
    logger.log(`✅ Pengguna berhasil mendaftar asistensi pada kelas ${courseDetail.courseClassCode}`,);
  });

  await test.step(`[TC11] Memverifikasi status pendaftaran asistensi melewati dashboard`, async () => {
    await assistantPage.navigateToDashboard();
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

  await test.step("[TC14] Menolak tawaran asistensi", async () => {
    await assistantPage.navigateToDashboard();
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

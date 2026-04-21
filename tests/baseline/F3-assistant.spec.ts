import { test } from "../../fixture/authenticated.fixture";
import { LoginPage } from "../../pages/loginPage";
import { AssistantVacancyPage } from "../../pages/assistantVacancyPage";
import { DashboardPage } from "../../pages/dashboardPage";

test("Fitur 3 : Melihat dan mendaftar asistensi [TC08-TC10]", async ({
  page,
  logger,
}) => {
  const loginPage = new LoginPage(page, logger);
  const assistantPage = new AssistantVacancyPage(page, logger);
  const dashboardPage = new DashboardPage(page, logger);
  const courseDetail = {
    course : "Praktikum Pengujian Perangkat Lunak",
    courseAbbreviation: "PPPL",
    courseCode: "SVPL214507",
    courseClassCode: "PPPLA1",
  };

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
});

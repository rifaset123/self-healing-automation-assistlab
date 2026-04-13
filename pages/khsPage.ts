import { expect, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { LocatorUtils } from "../utils/helper/locatorUtils";
import { Logger } from "../utils/helper/logger";
import { locators } from "../utils/locators";
import { devConfig } from "../utils/env/dev";
import path from "path";

export class KhsPage extends BasePage {
  private locatorUtils: LocatorUtils;
  private logger : Logger;

  constructor(page: Page, logger: Logger) {
    super(page);
    this.locatorUtils = new LocatorUtils(logger);
    this.logger = logger;
  }

  async navigateToKhs() {
    await this.locatorUtils.click(locators.khs.sidebarKhsButton(this.page));
  }

  async verifyURLAndHeaderKhs() {
    const urlPattern = new RegExp(`${devConfig.baseURL}student/document`);
    await this.page.waitForURL(urlPattern);
    await expect(locators.khs.khsHeader(this.page)).toBeVisible();
  }

  async navigateToAddKhsDocument() {
    await this.locatorUtils.click(locators.khs.addKhsButton(this.page));
    await expect(locators.khs.addKhsInformationHeader(this.page)).toBeVisible();
  }

  async uploadKhsDocument(filePath: string) {
    const fileName = path.basename(filePath);

    await this.locatorUtils.uploadFile(
      locators.khs.uploadKhsInput(this.page),
      filePath,
    );
    await expect(locators.khs.uploadedKhsFileName(this.page)).toHaveText(
      new RegExp(fileName),
    );
    const submitKHSbtn = locators.khs.submitKhsButton(this.page);
    await submitKHSbtn.click({ timeout: 15000 })
  }

  async verifySuccessUploadKhs(owner: string) {
    await Promise.all([this.page.waitForURL(/\/student\/document\/result$/)]);
    await expect(locators.khs.verifySuccessUploadKhs(this.page)).toBeVisible();
    await expect(
      locators.khs.verifyKhsDocumentOwner(this.page, owner),
    ).toBeVisible();
  }

  async verifySortFilter(columnName: string) {
    await this.locatorUtils.click(
      locators.khs.verifySortFilter(this.page),
    );

    // Verifikasi data terurut
    const headers = await locators.khs
      .tableHeaders(this.page)
      .allTextContents();

    const columnIndex = headers.findIndex((h) => h.trim().includes(columnName));

    if (columnIndex === -1) {
      throw new Error(`Column ${columnName} not found`);
    }

    // memverifikasi spesifik kolom yang diurutkan
    const columnValues = await locators.khs
      .tableColumnCells(this.page, columnIndex)
      .allTextContents();

    const sortedValues = [...columnValues].sort((a, b) => a.localeCompare(b));

    expect(columnValues).toEqual(sortedValues);
    // add log
    this.logger.log(`✅ Kolom ${columnName} telah terurut dengan benar, diawali dengan ${columnValues[0].trim()}`);
  }

  async verifySearchFilter(search: string) {
    await this.locatorUtils.fill(
      locators.khs.verifySearchFilterInput(this.page),
      search,
    );
    await expect(
      locators.khs.verifyFilteredData(this.page, search),
    ).toBeVisible();
  }
}

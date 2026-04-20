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
    await this.locatorUtils.assertVisible(locators.khs.khsHeader(this.page));
  }

  async navigateToAddKhsDocument() {
    await this.locatorUtils.click(locators.khs.addKhsButton(this.page));
    await this.locatorUtils.assertVisible(locators.khs.addKhsInformationHeader(this.page));
  }

  async uploadKhsDocument(filePath: string) {
    const fileName = path.basename(filePath); // file only allows PDF, expect ONLY PDF FILE

    await this.locatorUtils.uploadFile(
      locators.khs.uploadKhsInput(this.page),
      filePath,
    );
    await this.locatorUtils.assertVisible(locators.khs.uploadedKhsFileName(this.page, fileName)) // assume only PDF file
    const submitKHSbtn = locators.khs.submitKhsButton(this.page);
    await submitKHSbtn.click({ timeout: 15000 })
  }

  async verifySuccessUploadKhs(owner: string) {
    await Promise.all([this.page.waitForURL(/\/student\/document\/result$/)]);
    await this.locatorUtils.assertVisible(locators.khs.verifySuccessUploadKhs(this.page));
    await this.locatorUtils.assertVisible(
      locators.khs.verifyKhsDocumentOwner(this.page, owner),
    );
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
    await this.locatorUtils.assertVisible(locators.khs.verifyFilteredData(this.page, search));
  }
}

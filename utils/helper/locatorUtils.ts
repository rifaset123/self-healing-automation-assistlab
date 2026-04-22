import { Locator, test } from "@playwright/test";
import { Logger } from "./logger";
import path from "path"
export class LocatorUtils {
  private logger: Logger;
  private testName: string;

  constructor(logger: Logger, testName?: string) {
    this.logger = logger;
    this.testName = testName || "DefaultTest";
  }

  async click(locator: Locator, retries = 3) {
    await this.assertVisible(locator);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const elementText =
          (await locator.textContent())?.replace(/\s+/g, " ").trim() || "N/A";
        this.logger.log(
          `Percobaan ${attempt}: Menekan element - ${elementText}`,
        );
        await locator.click();
        return;
      } catch (error) {
        this.logger.error(`❌ Gagal menekan element pada percobaan ${attempt}: ${error}`);
        if (attempt === retries) {
          await this.captureFailureDetails(locator, "Kegagalan klik");
          throw error;
        }
      }
    }
  }

  async selectDropDownOption(
    locator: Locator,
    selectedOption: string,
    retries = 3,
  ) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.log(
          `Percobaan ${attempt}: Memilih opsi '${selectedOption}' dari dropdown`,
        );
        await locator.selectOption({ label: selectedOption });
        return;
      } catch (error) {
        this.logger.error(
          `❌ Gagal memilih opsi pada percobaan ${attempt}: ${error}`,
        );
        if (attempt === retries) {
          await this.captureFailureDetails(
            locator,
            "Kegagalan memilih opsi dropdown",
          );
          throw error;
        }
      }
    }
  }

  async fill(locator: Locator, text: string, retries = 3) {
    await this.assertVisible(locator);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.log(`Percobaan ${attempt}: Mengisi input dengan: ${text}`);
        await locator.fill(text);

        // Verify the value was actually set
        const actual = await locator.inputValue();
        const passed = actual === text;

        this.logger.log(`${passed ? "✅" : "❌"} Fill assertion`);
        this.logger.log(`   Expected : "${text}"`);
        this.logger.log(`   Actual   : "${actual}"`);

        if (!passed) {
          throw new Error(`Fill mismatch — expected "${text}" but got "${actual}"`);
        }
        return;
      } catch (error) {
        this.logger.error(`❌ Gagal mengisi input pada percobaan ${attempt}: ${error}`);
        if (attempt === retries) {
          await this.captureFailureDetails(locator, "Kegagalan mengisi input");
          throw error;
        }
      }
    }
  }

  async uploadFile(locator: Locator, filePath: string, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await locator.setInputFiles(filePath);
        this.logger.log(`✅ File diunggah: ${path.basename(filePath)}`);
        return;
      } catch (error) {
        this.logger.error(`❌ Gagal mengunggah file pada percobaan ${attempt}: ${error}`);
        if (attempt === retries) {
          await this.captureFailureDetails(locator, "Kegagalan mengunggah file");
          throw error;
        }
      }
    }
  }

  async assertVisible(locator: Locator, timeout = 10000) {
    try {
      await locator.waitFor({ state: "visible", timeout });
      const elementText =
        (await locator.textContent())?.replace(/\s+/g, " ").trim() || "N/A";
      this.logger.log(`✅ Element terlihat: ${elementText}`);
    } catch (error) {
      this.logger.error(
        `❌ Element TIDAK terlihat setelah ${timeout / 1000} detik!`,
      );
      await this.captureFailureDetails(locator, "Kegagalan Visibility Assertion");
      throw new Error(
        `Element not visible: ${locator.toString()} | Error: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }
  async assertNotVisible(locator: Locator, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      if (!(await locator.isVisible())) {
        this.logger.log(`✅ Element TIDAK terlihat seperti yang diharapkan`);
        return;
      } else {
        this.logger.warn(`⚠️ Percobaan ${attempt}: Element tetap tidak terlihat`);
      }
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    this.logger.error(`❌ Element MASIH TIDAK TERLIHAT setelah ${retries} percobaan!`);
    await this.captureFailureDetails(
      locator,
      "Kegagalan Non-Visibility Assertion",
    );
    throw new Error(`Element masih terlihat: ${locator}`);
  }

  /** mengambil screenshot */
  private async captureFailureDetails(locator: Locator, action: string) {
    try {
      const screenshot = await locator.screenshot();
      test.info().attach(`📸 ${action} Screenshot`, {
        body: screenshot,
        contentType: "image/png",
      });
      this.logger.error(`📸 Screenshot diambil untuk aksi ${action}`);
    } catch (error) {
      this.logger.error(`❌ Gagal mengambil screenshot: ${error}`);
    }
  }
}

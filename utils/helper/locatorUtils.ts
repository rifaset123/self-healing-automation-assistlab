import { Locator, test } from "@playwright/test";
import { Logger } from "./logger";
import path from "path"
export class LocatorUtils {
  private logger: Logger;
  private testName: string;

  constructor(logger: Logger, testName?: string) {
    // ✅ testName is now optional
    this.logger = logger;
    this.testName = testName || "DefaultTest"; // ✅ Use default name if not provided
  }

  async click(locator: Locator, retries = 3) {
    await this.assertVisible(locator, retries);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const elementText =
          (await locator.textContent())?.replace(/\s+/g, " ").trim() || "N/A";
        this.logger.log(
          `Attempt ${attempt}: Clicking element - ${elementText}`,
        );
        await locator.click();
        return;
      } catch (error) {
        this.logger.error(`❌ Click failed on attempt ${attempt}: ${error}`);
        if (attempt === retries) {
          await this.captureFailureDetails(locator, "Click Failure");
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
          `Attempt ${attempt}: Selecting option '${selectedOption}' from dropdown`,
        );
        await locator.selectOption({ label: selectedOption });
        return;
      } catch (error) {
        this.logger.error(
          `❌ Select option failed on attempt ${attempt}: ${error}`,
        );
        if (attempt === retries) {
          await this.captureFailureDetails(
            locator,
            "Select Option Dropdown Failure",
          );
          throw error;
        }
      }
    }
  }

  async fill(locator: Locator, text: string, retries = 3) {
    await this.assertVisible(locator, retries);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.log(`Attempt ${attempt}: Filling input with: ${text}`);
        await locator.fill(text);
        return;
      } catch (error) {
        this.logger.error(`❌ Fill failed on attempt ${attempt}: ${error}`);
        if (attempt === retries) {
          await this.captureFailureDetails(locator, "Fill Failure");
          throw error;
        }
      }
    }
  }

  async uploadFile(locator: Locator, filePath: string, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await locator.setInputFiles(filePath);
        this.logger.log(`✅ File uploaded: ${path.basename(filePath)}`);
        return;
      } catch (error) {
        this.logger.error(`❌ Upload failed on attempt ${attempt}: ${error}`);
        if (attempt === retries) {
          await this.captureFailureDetails(locator, "File Upload Failure");
          throw error;
        }
      }
    }
  }

  async assertVisible(locator: Locator, timeout = 90000) {
    try {
      await locator.waitFor({ state: "visible", timeout: 90000 });
      const elementText =
        (await locator.textContent())?.replace(/\s+/g, " ").trim() || "N/A";
      this.logger.log(`✅ Element is visible: ${elementText}`);
    } catch (error) {
      this.logger.error(
        `❌ Element is NOT visible after ${timeout / 1000} seconds`,
      );
      await this.captureFailureDetails(locator, "Visibility Assertion Failure");
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
        this.logger.log(`✅ Element is NOT visible as expected.`);
        return;
      } else {
        this.logger.warn(`⚠️ Attempt ${attempt}: Element is still visible`);
      }
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    this.logger.error(`❌ Element is STILL VISIBLE after ${retries} attempts`);
    await this.captureFailureDetails(
      locator,
      "Non-Visibility Assertion Failure",
    );
    throw new Error(`Element is still visible: ${locator}`);
  }

  /** Captures a screenshot and attaches it to Allure */
  private async captureFailureDetails(locator: Locator, action: string) {
    try {
      const screenshot = await locator.screenshot();
      test.info().attach(`📸 ${action} Screenshot`, {
        body: screenshot,
        contentType: "image/png",
      });
      this.logger.error(`📸 Screenshot captured for ${action}`);
    } catch (error) {
      this.logger.error(`❌ Failed to capture screenshot: ${error}`);
    }
  }
}

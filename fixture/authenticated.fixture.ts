import { test as base, expect } from "@playwright/test";
import { Logger } from "../utils/helper/logger";
import { TestStatus } from "../utils/helper/enum";

export const test = base.extend<{
  logger: Logger;
}>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger();

    await use(logger);

    if (testInfo.status === "passed") {
      logger.testStatus(TestStatus.PASSED);
    } else if (testInfo.status === "failed") {
      logger.testStatus(TestStatus.FAILED);
    } else if (testInfo.status === "timedOut") {
      logger.testStatus(TestStatus.TIMEDOUT);
    } else {
      logger.testStatus(TestStatus.SKIPPED);
    }
  },
});

export { expect };
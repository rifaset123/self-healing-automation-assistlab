import { chromium, BrowserContext, Page } from "@playwright/test";

export async function launchWithProfile(): Promise<{ context: BrowserContext; page: Page }> {
  const userDataDir = "C:/Users/L E N O V O/AppData/Local/Google/Chrome/User Data";

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: "chrome",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [`--profile-directory=Profile 4`],
  });

  console.log("🚀 Browser launched with user data dir");

  const page = await context.newPage();

  return { context, page };
}

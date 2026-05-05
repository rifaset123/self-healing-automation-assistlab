import { Page } from "@playwright/test";

export const loginLocators = {
  googleAuthButton: (page: Page) =>
    page.getByRole("link", { name: "Login dengan Email UGM" }),
  greetingHeader: (page: Page) => page.getByRole("heading", { level: 1 }),
  googleLoginEmailInput: (page: Page) => page.locator("#identifierId"),
  googleLoginPasswordInput: (page: Page) => page.getByLabel('Enter your password'),
  googleLoginNextButton: (page: Page) =>
    page.getByRole("button", { name: /next|lanjut|continue|lanjutkan/i }),
  
};

export const loginUGMLocators = {
  // get username id
  UGMUsername: (page: Page) => page.locator("input#username"),
  UGMPass: (page: Page) => page.locator("input#password"),
  UGMLoginButton: (page: Page) =>
    page.getByRole("button", { name: /login|masuk/i }),
};

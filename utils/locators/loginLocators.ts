import { Page } from "@playwright/test";

export const loginLocators = {
  googleAuthButton: (page: Page) =>
    page.getByRole("link", { name: "Login dengan Email UGM" }),
  greetingHeader: (page: Page) => page.getByRole("heading", { level: 1 }),
  // heres the <input type="email" class="whsOnd zHQkBf" jsname="YPqjbf" autocomplete="username webauthn" spellcheck="false" tabindex="0" aria-label="Email or phone" aria-describedby="i8" name="identifier" value="" aria-disabled="false" autocapitalize="none" id="identifierId" dir="ltr" data-initial-dir="ltr" data-initial-value="">
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

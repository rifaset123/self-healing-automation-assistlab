import { Page } from "@playwright/test";

export const loginLocators = {
  googleAuthButton: (page: Page) =>
    page.getByRole("link", { name: "Login dengan Email UGM" }),
  greetingHeader: (page: Page) =>
    page.getByRole('heading', { level: 1 }),
}

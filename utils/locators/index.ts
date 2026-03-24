import { assistantLocators } from "./assistantLocator";
import { khsLocators } from "./khsLocators";
import { loginLocators, loginUGMLocators } from "./loginLocators";
import { profileLocators } from "./profileLocators";

export const locators = {
  login: loginLocators,
  loginUGM: loginUGMLocators,
  profile: profileLocators,
  khs: khsLocators,
  assistant: assistantLocators,
};

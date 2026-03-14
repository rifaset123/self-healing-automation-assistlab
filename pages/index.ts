import { Page } from "@playwright/test";
import { Logger } from "../utils/helper/logger";
import { BasePage } from "./basePage";

export class Pages {
    basePage: BasePage;

    constructor(page: Page, logger: Logger) {
        this.basePage = new BasePage(page);
    }
}

import { test } from '../../fixture/authenticated.fixture';
import { testData } from '../../data';
import { Logger } from '../../utils/helper/logger';
import { Pages } from '../../pages';

test.describe('Create and Verify New Patient Scenarios',() => {
    test('[Automation] Login test google auth awikwok', async ({page, login}) => {
        const logger = new Logger();
        const pages = new Pages(page, logger);

        await test.step("Login", async () => {
            await login(testData.users.student);
        });
    })
})
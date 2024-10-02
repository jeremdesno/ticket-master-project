"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const integration_module_1 = require("../src/integration/integration.module");
const integration_service_1 = require("../src/integration/integration.service");
async function runIntegration() {
    const app = await core_1.NestFactory.createApplicationContext(integration_module_1.IntegrationModule);
    const integrationService = app.get(integration_service_1.IntegrationService);
    try {
        const events = await integrationService.getEvents();
        console.log('Events retrieved:', events.page.totalElements, 'Pages:', events.page.totalPages);
        await integrationService.parseAndSaveEvents(events);
        console.log('Events parsed and saved');
    }
    catch (error) {
        console.error('Error:', error.message);
    }
    finally {
        await app.close();
    }
}
runIntegration().catch((error) => {
    console.error('Error running integration:', error);
});
//# sourceMappingURL=run-integration.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const integration_module_1 = require("../src/integration/integration.module");
const integration_service_1 = require("../src/integration/integration.service");
async function runGenreIntegration() {
    const app = await core_1.NestFactory.createApplicationContext(integration_module_1.IntegrationModule);
    const integrationService = app.get(integration_service_1.IntegrationService);
    try {
        const classifications = await integrationService.getClassifications();
        console.log('Classifications retrieved:', classifications.page.totalElements, 'Pages:', classifications.page.totalPages);
        await integrationService.parseAndSaveGenresAndSubGenres(classifications);
        console.log('Genres & Sub Genres parsed and saved');
    }
    catch (error) {
        console.error('Error:', error.message);
    }
    finally {
        await app.close();
    }
}
runGenreIntegration().catch((error) => {
    console.error('Error running integration:', error);
});
//# sourceMappingURL=run-genres-integration.js.map
import { NestFactory } from '@nestjs/core';
import { IntegrationModule } from '../src/integration/integration.module'; 
import { IntegrationService } from '../src/integration/integration.service';

async function runGenreIntegration() {
  const app = await NestFactory.createApplicationContext(IntegrationModule);
  const integrationService = app.get(IntegrationService);

  try {
    const classifications = await integrationService.getClassifications();
    console.log(
      'Classifications retrieved:',
      classifications.page.totalElements,
      'Pages:',
      classifications.page.totalPages,
    );
    await integrationService.parseAndSaveGenresAndSubGenres(classifications);
    console.log('Genres & Sub Genres parsed and saved');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await app.close(); 
  }
}

runGenreIntegration().catch((error) => {
  console.error('Error running integration:', error);
});

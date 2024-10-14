import { NestFactory } from '@nestjs/core';
import { IntegrationModule } from '../src/integration/integration.module'; 
import { IntegrationService } from '../src/integration/integration.service';

async function runIntegration() {
  const app = await NestFactory.createApplicationContext(IntegrationModule);
  const integrationService = app.get(IntegrationService);

  try {
    const events = await integrationService.getEvents();
    console.log(
      'Events retrieved:',
      events.page.totalElements,
      'Pages:',
      events.page.totalPages,
    );
    await integrationService.parseAndSaveEvents(events);
    console.log('Events parsed and saved');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await app.close(); 
  }
}

runIntegration().catch((error) => {
  console.error('Error running integration:', error);
});

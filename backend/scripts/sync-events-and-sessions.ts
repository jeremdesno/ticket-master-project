import { NestFactory } from '@nestjs/core';
import { IntegrationModule } from '../src/integration/integration.module'; 
import { IntegrationService } from '../src/integration/integration.service';

async function syncEventsAndSessions() {
  const app = await NestFactory.createApplicationContext(IntegrationModule);
  const integrationService = app.get(IntegrationService);

  try {
    const newExtractedEvents = await integrationService.getNewExtractedEvents();
    console.log(`Fetched ${newExtractedEvents.length} new sessions`)
    await integrationService.syncSessions(newExtractedEvents);
    console.log('Events and Sessions synced');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await app.close(); 
  }
}

syncEventsAndSessions().catch((error) => {
  console.error('Error syncing data:', error);
});

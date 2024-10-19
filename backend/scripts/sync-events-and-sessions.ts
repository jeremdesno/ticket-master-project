import { NestFactory } from '@nestjs/core';
import { IntegrationModule } from '../src/integration/integration.module'; 
import { IntegrationService } from '../src/integration/integration.service';

async function syncEventsAndSessions() {
  const app = await NestFactory.createApplicationContext(IntegrationModule);
  const integrationService = app.get(IntegrationService);

  try {
    const newExtractedEvents = await integrationService.getNewExtractedEvents();
    console.log(`Fetched ${newExtractedEvents.length} new sessions`)
    const newEvents = await integrationService.getNewEvents();
    console.log(`Fetched ${newEvents.length} new events`)

    await integrationService.syncSessions(newExtractedEvents);
    await integrationService.syncEvents(newEvents)
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

import { NestFactory } from '@nestjs/core';
import { IntegrationModule } from '../src/integration/integration.module'; 
import { IntegrationService } from '../src/integration/integration.service';

async function syncEventsAndSessions() {
  const app = await NestFactory.createApplicationContext(IntegrationModule);
  const integrationService = app.get(IntegrationService);

  const connectionStatus = await integrationService.doHealthChecks();
  if (connectionStatus){
    try {
      // Fetch new sessions and events
      const newExtractedEvents = await integrationService.getNewExtractedEvents();
      console.log(`Fetched ${newExtractedEvents.length} new sessions`);

      const newEvents = await integrationService.getNewEvents();
      console.log(`Fetched ${newEvents.length} new events`);

      await integrationService.syncSessions(newExtractedEvents);
      await integrationService.syncEvents(newEvents);
      await integrationService.indexEvents(newEvents)
      

      console.log('Events and Sessions synced and indexed');
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      await app.close(); 
    }
  } else {
    throw new Error('Failed to connect to postgresql and elasticsearch instances')
  }
}

syncEventsAndSessions().catch((error) => {
  console.error('Error syncing data:', error);
});

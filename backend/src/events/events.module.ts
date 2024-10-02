import { Module } from '@nestjs/common';

import { EventController } from './events.controller';
import { EventService } from './events.service';

@Module({
  providers: [EventService],
  controllers: [EventController],
})
export class EventsModule {}

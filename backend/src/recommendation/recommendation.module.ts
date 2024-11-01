import { Module } from '@nestjs/common';

import { RecommendationService } from './recommendation.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}

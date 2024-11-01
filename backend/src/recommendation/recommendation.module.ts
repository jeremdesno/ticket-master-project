import { Module } from '@nestjs/common';

import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [RecommendationService],
  exports: [RecommendationService],
  controllers: [RecommendationController],
})
export class RecommendationModule {}

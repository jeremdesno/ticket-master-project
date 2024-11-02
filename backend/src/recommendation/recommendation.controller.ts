import { Controller, Get, Query } from '@nestjs/common';

import { RecommendationService } from './recommendation.service';
import { SemanticSearchResult } from './types';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  async searchSimilarEvents(
    @Query('eventId') eventId: string,
    @Query('top_k') top_k: number = 4,
  ): Promise<SemanticSearchResult[]> {
    return await this.recommendationService.searchSimilarEvents(
      eventId,
      Number(top_k),
    );
  }
}

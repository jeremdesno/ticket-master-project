import { Controller, Get, Query } from '@nestjs/common';

import { EventSearchService } from './eventSearch.service';
import { EventSearchResult } from './types';

@Controller('search')
export class EventSearchController {
  constructor(private readonly eventSearchService: EventSearchService) {}

  @Get()
  async searchEvents(
    @Query('query') query: string,
  ): Promise<EventSearchResult[]> {
    const searchResults = await this.eventSearchService.searchEvents(query);
    return searchResults;
  }
}

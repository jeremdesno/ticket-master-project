import { Controller, Get, Query } from '@nestjs/common';

import { EventSearchService } from './eventSearch.service';
import { EventSearchResult, SearchAfter } from './types';

@Controller('search')
export class EventSearchController {
  constructor(private readonly eventSearchService: EventSearchService) {}

  @Get()
  async searchEvents(
    @Query('query') query: string,
    @Query('lastDocSortScore') lastDocSortScore: number | null = null,
    @Query('lastDocSortId') lastDocSortId: string | null = null,
    @Query('size') size: number = 15,
  ): Promise<EventSearchResult[]> {
    const lastDocSort: SearchAfter =
      lastDocSortScore && lastDocSortId
        ? [lastDocSortScore, lastDocSortId]
        : null;
    return await this.eventSearchService.searchEvents(query, lastDocSort, size);
  }
}

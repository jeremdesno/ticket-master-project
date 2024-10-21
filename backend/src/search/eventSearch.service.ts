import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EventDataModel } from 'src/common/models';

import {
  EventSearchBody,
  EventSearchRequestBody,
  EventSearchResult,
  SearchAfter,
} from './types';

@Injectable()
export class EventSearchService {
  private readonly index = 'event';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  public async checkHealth(): Promise<boolean> {
    try {
      await this.elasticsearchService.ping();
      return true;
    } catch (error) {
      console.error('Elasticsearch is down: ', error);
      throw new Error('Elasticsearch is not reachable');
    }
  }

  public async indexEvent(event: EventDataModel): Promise<{ result: string }> {
    return await this.elasticsearchService.index<EventSearchBody>({
      index: this.index,
      id: event.id, // assures that no event is duplicated when indexed
      document: {
        id: event.id,
        name: event.name,
        venueName: event.venueName,
      },
    });
  }

  public async searchEvents(
    query: string,
    lastDocSort: SearchAfter | null = null,
    size = 15,
  ): Promise<EventSearchResult[]> {
    const body: EventSearchRequestBody = {
      query: {
        multi_match: {
          query: query,
          fields: ['name', 'venueName'],
          fuzziness: 'AUTO',
        },
      },
      size: size,
      sort: [{ _score: { order: 'desc' } }, { id: 'asc' }],
    };

    if (lastDocSort) {
      body.search_after = lastDocSort;
    }
    const result = await this.elasticsearchService.search<EventSearchResult>({
      index: this.index,
      body,
    });

    return result.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));
  }
}

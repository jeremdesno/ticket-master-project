import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EventDataModel } from 'src/common/models';

import { EventSearchBody, EventSearchResult } from './types';

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
      document: {
        id: event.id,
        name: event.name,
        venueName: event.venueName,
      },
    });
  }

  public async searchEvents(query: string): Promise<EventSearchResult[]> {
    const result = await this.elasticsearchService.search<EventSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['name', 'venueName'],
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }
}

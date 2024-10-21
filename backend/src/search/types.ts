export interface EventSearchBody {
  id: string;
  name: string;
  venueName: string;
}

export interface EventSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: EventSearchBody;
    }>;
  };
}

export type SearchAfter = [number, string];

export interface EventSearchRequestBody {
  query: {
    multi_match: {
      query: string;
      fields: string[];
      fuzziness: string;
    };
  };
  size: number;
  sort: [{ _score: { order: 'desc' } }, { id: 'asc' }];
  search_after?: SearchAfter;
}

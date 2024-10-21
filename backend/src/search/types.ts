export interface EventSearchBody {
  id: string;
  name: string;
  venueName: string;
}

export interface EventSearchResult extends EventSearchBody {
  score: number;
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

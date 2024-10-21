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

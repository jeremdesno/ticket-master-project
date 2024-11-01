export interface EventPointStruct {
  id: string;
  vector: number[];
  payload: {
    eventId: string;
    name: string;
    genre: string;
    subgenre: string;
  };
}

export interface SemanticSearchResponse {
  points: {
    id: string | number;
    score: number;
    payload?:
      | Record<string, unknown>
      | {
          [key: string]: unknown;
        }
      | null
      | undefined;
  }[];
}

export interface SemanticSearchResult {
  id: string;
  eventId: string;
  score: number;
}

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

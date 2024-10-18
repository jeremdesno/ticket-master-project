export interface DatabaseSchema {
  extractedEvents: ExtractedEventDataModel;
  events: EventDataModel;
  eventSessions: EventSessionDataModel;
  genres: GenreDataModel;
  subgenres: SubGenreDataModel;
}

export interface ExtractedEventDataModel {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  url: string;
  description: string;
  genre: string;
  startDateSales: Date;
  endDateSales: Date;
  venueAddress: string;
  venueName: string;
  imageUrl: string | null;
}

// Stores event details
export interface EventDataModel {
  id: string;
  name: string;
  description: string;
  genre: string;
  venueAddress: string;
  venueName: string;
  imageUrl: string | null;
}

// Stores a specifique session of an event
export interface EventSessionDataModel {
  id: string; // We keep the extracted event id for simplicity
  startDate: Date;
  endDate: Date | null;
  url: string;
  startDateSales: Date;
  endDateSales: Date;
  eventId: string; // foreign key to the event table
}

export interface GenreDataModel {
  id: string;
  name: string;
}

export interface SubGenreDataModel {
  id: string;
  name: string;
  genreId: string;
}

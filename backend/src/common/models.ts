export interface DatabaseSchema {
  users: User;
  extractedEvents: ExtractedEventDataModel;
  events: EventDataModel;
  eventSessions: EventSessionDataModel;
  genres: GenreDataModel;
  subgenres: SubGenreDataModel;
  favoriteEvents: FavoriteEvents;
}

export interface ExtractedEventDataModel {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  url: string;
  description: string;
  genre: string;
  subGenre: string;
  startDateSales: Date;
  endDateSales: Date;
  venueAddress: string;
  venueName: string;
  imageUrl: string | null;
}

// Stores event details
export interface EventDataModel {
  id: string; // Hash of name + venueName
  name: string;
  description: string;
  genre: string;
  subGenre: string;
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

export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
}

export interface FavoriteEvents {
  userId: string;
  eventId: string;
}

export interface DatabaseSchema {
  events: ExtractedEventDataModel;
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

export interface GenreDataModel {
  id: string;
  name: string;
}

export interface SubGenreDataModel {
  id: string;
  name: string;
  genreId: string;
}

export interface DatabaseSchema {
    events: EventDataModel;
    genres: GenreDataModel;
    subgenres: SubGenreDataModel;
}
export interface EventDataModel {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    url: string;
    description: string;
    genre: string;
    startDateSales: Date;
    endDateSales: Date;
    venueAddress: string;
    venueName: string;
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

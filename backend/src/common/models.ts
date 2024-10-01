export interface DatabaseSchema {
  events: EventDataModel;
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

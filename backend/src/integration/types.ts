/**
 * @description This file contains TypeScript interfaces used for
 * interacting with the Ticketmaster API.
 */

export interface Link {
  href: string;
  templated?: boolean;
}

export interface Links {
  self: Link;
  next?: Link;
  prev?: Link;
}

export interface Venue {
  address: {
    line1?: string;
    line2?: string;
    line3?: string;
  };
  name?: string;
}

export interface EmbeddedData {
  venues?: Venue[];
}

export interface dates {
  start: { localDate: string; localTime?: string; dateTBD: boolean };
  end?: { localDate: string; localTime?: string; dateTBD: boolean };
}

export interface sales {
  public: { startDateTime: string; endDateTime?: string };
}
interface Classification {
  genre: Genre;
  segment: {
    id: string;
    name: string;
  };
}

export interface Image {
  url: string;
  ratio: string;
  width: number;
  height: number;
}

export interface EventExtracted {
  id: string;
  name: string;
  dates: dates;
  url: string;
  description: string;
  type: string;
  sales: sales;
  _embedded?: EmbeddedData;
  classifications: Classification[];
  images: Image[];
  [key: string]:
    | string
    | number
    | Array<string | number | object | boolean>
    | object;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface EventsResponse {
  _links: Links;
  _embedded: {
    events: EventExtracted[];
  };
  page: Page;
}

export interface Genre {
  id: string;
  name: string;
}

export interface ClassificationItem {
  id: string;
  name: string;
  _links: Links;
  segment?: {
    id: string;
    name: string;
    _embedded: {
      genres: Genre[];
    };
  };
}

export interface ClassificationsResponse {
  _links: Links;
  _embedded: {
    classifications: ClassificationItem[];
  };
  page: Page;
}

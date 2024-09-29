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

export interface EventExtracted {
  id: string;
  name: string;
  dates: object;
  url: string;
  description: string;
  type: string;
  sales: object;
  place: object;
  [key: string]:
    | string
    | number
    | Array<string | number | object | boolean>
    | object;
}

export interface Embedded {
  events: EventExtracted[];
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface EventsResponse {
  _links: Links;
  _embedded: Embedded;
  page: Page;
}

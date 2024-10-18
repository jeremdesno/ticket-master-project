import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Kysely } from 'kysely';

import { ClassificationsResponse, EventsResponse } from './types';
import { parsePageClassifications, parsePageEvents } from './utils';
import { DatabaseService } from '../common/database.service';
import {
  DatabaseSchema,
  EventDataModel,
  EventSessionDataModel,
  ExtractedEventDataModel,
  GenreDataModel,
  SubGenreDataModel,
} from '../common/models';

@Injectable()
export class IntegrationService {
  private readonly baseUrl = 'https://app.ticketmaster.com';
  private readonly apiKey: string;
  private readonly database: Kysely<DatabaseSchema>;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    this.apiKey = this.configService.get<string>('TICKETMASTER_API_KEY');
    this.database = this.databaseService.getDatabase();
  }

  async getEvents(): Promise<EventsResponse> {
    const startDateTime = new Date();
    startDateTime.setDate(startDateTime.getDate() + 1);
    startDateTime.setHours(0, 0, 0, 0);
    const startDateTimeFormatted = startDateTime
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z');

    const endDateTime = new Date(startDateTimeFormatted);
    endDateTime.setDate(endDateTime.getDate() + 1);
    const endDateTimeFormatted = endDateTime
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z');

    const url = `${this.baseUrl}/discovery/v2/events.json?apikey=${this.apiKey}&locale=*&city=Paris&countryCode=FR&startDateTime=${startDateTimeFormatted}&endDateTime=${endDateTimeFormatted}`;
    console.log(
      `Fetching events from the ${startDateTimeFormatted} to the ${endDateTimeFormatted}`,
    );
    try {
      const response = await axios.get<EventsResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching events');
      throw error;
    }
  }

  async upsertExtractedEvent(event: ExtractedEventDataModel): Promise<void> {
    await this.database
      .insertInto('extractedEvents')
      .values(event)
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate,
          url: event.url,
          description: event.description,
          genre: event.genre,
          startDateSales: event.startDateSales,
          endDateSales: event.endDateSales,
          venueAddress: event.venueAddress,
          venueName: event.venueName,
          imageUrl: event.imageUrl,
        }),
      )
      .execute();
  }

  async parseAndSaveEvents(data: EventsResponse): Promise<void> {
    let nextUrl: string | null = data._links.self.href;

    while (nextUrl) {
      const pageEventsParsed = await parsePageEvents(data);

      for (const parsedEvent of pageEventsParsed) {
        this.upsertExtractedEvent(parsedEvent);
      }
      console.log('upserted page:', data.page.number);

      const nextLink = data._links?.next;

      if (nextLink && nextLink.href) {
        nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;
        try {
          const response = await axios.get<EventsResponse>(nextUrl);
          data = response.data;
        } catch (error) {
          console.error('Error fetching next page of events: ', error);
        }
      } else {
        nextUrl = null;
      }
    }
  }

  async upsertEvent(event: EventDataModel): Promise<void> {
    await this.database
      .insertInto('events')
      .values({
        id: event.id,
        name: event.name,
        description: event.description,
        genre: event.genre,
        venueAddress: event.venueAddress,
        venueName: event.venueName,
        imageUrl: event.imageUrl,
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: event.name,
          description: event.description,
          genre: event.genre,
          venueAddress: event.venueAddress,
          venueName: event.venueName,
          imageUrl: event.imageUrl,
        }),
      )
      .execute();
  }

  async upsertEventSession(session: EventSessionDataModel): Promise<void> {
    await this.database
      .insertInto('eventSessions')
      .values({
        id: session.id,
        startDate: session.startDate,
        endDate: session.endDate,
        url: session.url,
        startDateSales: session.startDateSales,
        endDateSales: session.endDateSales,
        eventId: session.eventId,
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          startDate: session.startDate,
          endDate: session.endDate,
          url: session.url,
          startDateSales: session.startDateSales,
          endDateSales: session.endDateSales,
          eventId: session.eventId,
        }),
      )
      .execute();
  }


  async getClassifications(): Promise<ClassificationsResponse> {
    const url = `${this.baseUrl}/discovery/v2/classifications.json?apikey=${this.apiKey}`;
    console.log('Fetching classifications');
    try {
      const response = await axios.get<ClassificationsResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching classifications');
      throw error;
    }
  }

  async upsertGenre(genre: GenreDataModel): Promise<void> {
    await this.database
      .insertInto('genres')
      .values(genre)
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: genre.name,
        }),
      )
      .execute();
  }

  async upsertSubGenre(subGenre: SubGenreDataModel): Promise<void> {
    await this.database
      .insertInto('subgenres')
      .values(subGenre)
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: subGenre.name,
          genreId: subGenre.genreId,
        }),
      )
      .execute();
  }

  async parseAndSaveGenresAndSubGenres(
    data: ClassificationsResponse,
  ): Promise<void> {
    let nextUrl: string | null = data._links.self.href;

    while (nextUrl) {
      const [pageGenresParsed, pageSubGenresParsed] =
        await parsePageClassifications(data);

      for (const parsedGenre of pageGenresParsed) {
        this.upsertGenre(parsedGenre);
      }

      for (const parsedSubGenre of pageSubGenresParsed) {
        this.upsertSubGenre(parsedSubGenre);
      }
      console.log('upserted page:', data.page.number);

      const nextLink = data._links?.next;

      if (nextLink && nextLink.href) {
        nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;
        try {
          const response = await axios.get<ClassificationsResponse>(nextUrl);
          data = response.data;
        } catch (error) {
          console.error('Error fetching next page of classifications: ', error);
        }
      } else {
        nextUrl = null;
      }
    }
  }
}

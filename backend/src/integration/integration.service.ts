import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Kysely, sql } from 'kysely';
import { v4 as uuidv4 } from 'uuid';

import { ClassificationsResponse, EventsResponse } from './types';
import {
  generateHashFromNameAndVenue,
  parsePageClassifications,
  parsePageEvents,
  resizeImage,
  uploadToImgBB,
  sleep,
} from './utils';
import { DatabaseService } from '../common/database.service';
import {
  DatabaseSchema,
  EventDataModel,
  EventSessionDataModel,
  ExtractedEventDataModel,
  GenreDataModel,
  SubGenreDataModel,
} from '../common/models';
import { RecommendationService } from '../recommendation/recommendation.service';
import { EventPointStruct } from '../recommendation/types';
import { EventSearchService } from '../search/eventSearch.service';

@Injectable()
export class IntegrationService {
  private readonly baseUrl = 'https://app.ticketmaster.com';
  private readonly apiKey: string;
  private readonly database: Kysely<DatabaseSchema>;

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
    private eventSearchService: EventSearchService,
    private recommendationService: RecommendationService,
  ) {
    this.apiKey = this.configService.get<string>('TICKETMASTER_API_KEY');
    this.database = this.databaseService.getDatabase();
  }

  async doHealthChecks(): Promise<boolean> {
    return (
      this.databaseService.checkHealth() &&
      this.eventSearchService.checkHealth()
    );
  }

  async getEvents(): Promise<EventsResponse> {
    const startDateTime = new Date();
    startDateTime.setDate(startDateTime.getDate() + 1);
    startDateTime.setHours(0, 0, 0, 0);
    const startDateTimeFormatted = startDateTime
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z');

    const endDateTime = new Date(startDateTimeFormatted);
    endDateTime.setDate(endDateTime.getDate() + 3);
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
          subGenre: event.subGenre,
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
    const MAX_RETRIES = 5;
    const BASE_DELAY = 10000; // 10 second

    while (nextUrl) {
      const pageEventsParsed = await parsePageEvents(data);

      for (const parsedEvent of pageEventsParsed) {
        this.upsertExtractedEvent(parsedEvent);
      }

      console.log('Upserted page:', data.page.number);

      const nextLink = data._links?.next;

      if (nextLink && nextLink.href) {
        nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;

        let retryCount = 0;
        let success = false;
        let delay = BASE_DELAY;

        while (retryCount < MAX_RETRIES && !success) {
          try {
            if (retryCount > 0) {
              console.log(`Retrying... attempt ${retryCount}`);
              await sleep(delay);
              delay *= 3;
            }

            const response = await axios.get<EventsResponse>(nextUrl);
            data = response.data;
            success = true;
          } catch (error) {
            retryCount++;
            console.error(
              `Error fetching next page of events (attempt ${retryCount}):`,
              error,
            );

            if (retryCount >= MAX_RETRIES) {
              console.error('Max retries reached. Aborting...');
              nextUrl = null;
              break;
            }
          }
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
        subGenre: event.subGenre,
        venueAddress: event.venueAddress,
        venueName: event.venueName,
        imageUrl: event.imageUrl,
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: event.name,
          description: event.description,
          genre: event.genre,
          subGenre: event.subGenre,
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

  async getNewExtractedEvents(): Promise<ExtractedEventDataModel[]> {
    const newExtractedEvents = await this.database
      .selectFrom('extractedEvents')
      .leftJoin('eventSessions', 'extractedEvents.id', 'eventSessions.id')
      .where('eventSessions.id', 'is', null)
      .selectAll('extractedEvents')
      .execute();
    return newExtractedEvents;
  }

  async getNewEvents(): Promise<EventDataModel[]> {
    const newEvents = await this.database
      .with('sessionsWithNoMatchingEvents', (db) =>
        db
          .selectFrom('extractedEvents')
          .leftJoin('events', (join) =>
            join
              .onRef('extractedEvents.name', '=', 'events.name')
              .onRef('extractedEvents.venueName', '=', 'events.venueName'),
          )
          .where('events.id', 'is', null) // Only select sessions that match to no events in the events table
          .select([
            'extractedEvents.name',
            'extractedEvents.venueName',
            'extractedEvents.description',
            'extractedEvents.genre',
            'extractedEvents.subGenre',
            'extractedEvents.venueAddress',
            'extractedEvents.imageUrl',
            sql<number>`ROW_NUMBER() OVER (PARTITION BY "extractedEvents".name, "extractedEvents"."venueName" ORDER BY "extractedEvents"."startDate" DESC)`.as(
              'rowNumber',
            ),
          ]),
      )
      .selectFrom('sessionsWithNoMatchingEvents')
      .where('rowNumber', '=', 1) // Get only the latest event for each group
      .select([
        'sessionsWithNoMatchingEvents.name',
        'sessionsWithNoMatchingEvents.venueName',
        'sessionsWithNoMatchingEvents.description',
        'sessionsWithNoMatchingEvents.genre',
        'sessionsWithNoMatchingEvents.subGenre',
        'sessionsWithNoMatchingEvents.venueAddress',
        'sessionsWithNoMatchingEvents.imageUrl',
      ])
      .execute();

    const newEventsWithIds = newEvents.map((newExtractedEvent) => {
      const eventId = generateHashFromNameAndVenue(
        newExtractedEvent.name,
        newExtractedEvent.venueName,
      );

      return {
        id: eventId,
        ...newExtractedEvent,
      };
    });

    return newEventsWithIds;
  }

  async syncSessions(
    newExtractedEvents: ExtractedEventDataModel[],
  ): Promise<void> {
    for (const newExtractedEvent of newExtractedEvents) {
      const eventId = generateHashFromNameAndVenue(
        newExtractedEvent.name,
        newExtractedEvent.venueName,
      );

      await this.upsertEventSession({
        id: newExtractedEvent.id,
        startDate: newExtractedEvent.startDate,
        endDate: newExtractedEvent.endDate,
        url: newExtractedEvent.url,
        startDateSales: newExtractedEvent.startDateSales,
        endDateSales: newExtractedEvent.endDateSales,
        eventId: eventId,
      });
    }
  }

  async syncEvents(newEvents: EventDataModel[]): Promise<void> {
    for (const newEvent of newEvents) {
      let imageUrl: string | null = null;
      try {
        const resizedImageBuffer = await resizeImage(newEvent.imageUrl);
        imageUrl = await uploadToImgBB(resizedImageBuffer);
      } catch (error) {
        console.error('Error processing image: ', error);
      }
      await this.upsertEvent({
        id: newEvent.id,
        name: newEvent.name,
        description: newEvent.description,
        genre: newEvent.genre,
        subGenre: newEvent.subGenre,
        venueAddress: newEvent.venueAddress,
        venueName: newEvent.venueName,
        imageUrl: imageUrl,
      });
    }
  }

  async indexEvents(events: EventDataModel[]): Promise<void> {
    for (const event of events) {
      await this.eventSearchService.indexEvent(event);
    }
  }

  async ingestEventsToQdrant(events: EventDataModel[]): Promise<void> {
    const collectionCreated =
      await this.recommendationService.createCollectionIfNotExists();

    const eventDescriptions = events.map((event) => {
      return event.description ? event.description : '';
    });

    const embeddings =
      await this.recommendationService.embedEvents(eventDescriptions);
    const eventPoints: EventPointStruct[] = events.map((event, index) => ({
      id: uuidv4(),
      vector: embeddings[index],
      payload: {
        eventId: event.id,
        name: event.name,
        genre: event.genre,
        subgenre: event.subGenre,
      },
    }));
    if (collectionCreated) {
      await this.recommendationService.addVectorsToQdrant(eventPoints);
    }
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

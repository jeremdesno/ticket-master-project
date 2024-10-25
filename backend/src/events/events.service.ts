import { Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DatabaseService } from 'src/common/database.service';
import {
  DatabaseSchema,
  EventDataModel,
  EventSessionDataModel,
  GenreDataModel,
  SubGenreDataModel,
} from 'src/common/models';

@Injectable()
export class EventService {
  private readonly database: Kysely<DatabaseSchema>;

  constructor(private readonly databaseService: DatabaseService) {
    this.database = this.databaseService.getDatabase();
  }

  async getEvents(
    startDate?: string,
    endDate?: string,
    genre?: string,
    subGenre?: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<EventDataModel[]> {
    let query = this.database
      .selectFrom('events')
      .innerJoin('eventSessions', 'events.id', 'eventSessions.eventId')
      .select([
        'events.id',
        'events.name',
        'events.description',
        'events.genre',
        'events.subGenre',
        'events.venueAddress',
        'events.venueName',
        'events.imageUrl',
      ]);

    if (startDate) {
      query = query.where('eventSessions.startDate', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('eventSessions.startDate', '<=', new Date(endDate));
    }
    if (genre) {
      query = query.where('events.genre', '=', genre);
    }
    if (subGenre) {
      query = query.where('events.subGenre', '=', subGenre);
    }

    query = query
      .distinctOn('events.id')
      .orderBy('events.id', 'asc')
      .orderBy('eventSessions.startDate', 'asc')
      .limit(limit)
      .offset(offset);

    return await query.execute();
  }

  async getEvent(id: string): Promise<EventDataModel | null> {
    return await this.database
      .selectFrom('events')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getSessions(
    eventId: string,
    startingAfter?: string,
    endingBefore?: string,
    limit: number = 5,
  ): Promise<EventSessionDataModel[] | []> {
    let query = this.database
      .selectFrom('eventSessions')
      .selectAll()
      .where('eventId', '=', eventId);
    if (startingAfter) {
      query = query.where(
        'eventSessions.startDate',
        '>=',
        new Date(startingAfter),
      );
    }
    if (endingBefore) {
      query = query.where(
        'eventSessions.startDate',
        '<=',
        new Date(endingBefore),
      );
    }
    return await query.orderBy('startDate', 'asc').limit(limit).execute();
  }

  async getEventsCount(
    genre: string,
    subGenre: string | null = null,
  ): Promise<number> {
    let query = this.database
      .selectFrom('events')
      .select(sql<number>`Count(*)`.as('total'))
      .where('genre', '=', genre);

    if (subGenre) {
      query = query.where('subGenre', '=', subGenre);
    }
    const totalEvents = await query.executeTakeFirstOrThrow();
    return totalEvents.total;
  }

  async getGenres(): Promise<GenreDataModel[]> {
    return await this.database.selectFrom('genres').selectAll().execute();
  }

  async getSubGenres(genreId: string): Promise<SubGenreDataModel[]> {
    return await this.database
      .selectFrom('subgenres')
      .selectAll()
      .where('genreId', '=', genreId)
      .execute();
  }
}

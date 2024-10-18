import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseService } from 'src/common/database.service';
import {
  DatabaseSchema,
  EventDataModel,
  EventSessionDataModel,
  GenreDataModel,
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

  async getSessions(eventId: string): Promise<EventSessionDataModel[] | []> {
    return await this.database
      .selectFrom('eventSessions')
      .selectAll()
      .where('eventId', '=', eventId)
      .execute();
  }

  async getGenres(): Promise<GenreDataModel[]> {
    return await this.database.selectFrom('genres').selectAll().execute();
  }
}

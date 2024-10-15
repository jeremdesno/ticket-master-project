import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseService } from 'src/common/database.service';
import {
  DatabaseSchema,
  EventDataModel,
  GenreDataModel,
} from 'src/common/models';

@Injectable()
export class EventService {
  private readonly database: Kysely<DatabaseSchema>;

  constructor(private readonly databaseService: DatabaseService) {
    this.database = this.databaseService.getDatabase();
  }

  async getEvents(
    limit: number = 20,
    offset: number = 0,
  ): Promise<EventDataModel[]> {
    return await this.database
      .selectFrom('events')
      .selectAll()
      .limit(limit)
      .offset(offset)
      .execute();
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<EventDataModel[]> {
    return await this.database
      .selectFrom('events')
      .selectAll()
      .where('startDate', '>=', new Date(startDate))
      .where('startDate', '<=', new Date(endDate))
      .orderBy('startDate', 'asc')
      .limit(limit)
      .offset(offset)
      .execute();
  }

  async getEvent(id: string): Promise<EventDataModel | null> {
    return await this.database
      .selectFrom('events')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getGenres(): Promise<GenreDataModel[]> {
    return await this.database.selectFrom('genres').selectAll().execute();
  }
}

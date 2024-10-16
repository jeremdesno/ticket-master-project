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
    startDate?: string,
    endDate?: string,
    genre?: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<EventDataModel[]> {
    let query = this.database
      .selectFrom('events')
      .selectAll()
      .limit(limit)
      .offset(offset);

    if (startDate) {
      query = query.where('startDate', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('startDate', '<=', new Date(endDate));
    }
    if (genre) {
      query = query.where('genre', '=', genre);
    }

    query = query.orderBy('startDate', 'asc');
    return await query.execute();
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

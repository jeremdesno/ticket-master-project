import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseService } from 'src/common/database.service';
import {
  DatabaseSchema,
  ExtractedEventDataModel,
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
  ): Promise<ExtractedEventDataModel[]> {
    let query = this.database
      .selectFrom('extractedEvents')
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

  async getEvent(id: string): Promise<ExtractedEventDataModel | null> {
    return await this.database
      .selectFrom('extractedEvents')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getGenres(): Promise<GenreDataModel[]> {
    return await this.database.selectFrom('genres').selectAll().execute();
  }
}

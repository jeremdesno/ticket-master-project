import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DatabaseSchema, EventDataModel } from './models';

@Injectable()
export class DatabaseService {
  private readonly database: Kysely<DatabaseSchema>;

  constructor(private configService: ConfigService) {
    const postgresUser = this.configService.get<string>('POSTGRES_USER');
    const postgresPassword =
      this.configService.get<string>('POSTGRES_PASSWORD');
    const postgresDatabase = this.configService.get<string>('POSTGRES_DB');

    this.database = new Kysely<DatabaseSchema>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: '127.0.0.1',
          port: 5433,
          database: postgresDatabase,
          user: postgresUser,
          password: postgresPassword,
        }),
      }),
    });
  }

  async upsertEvent(event: EventDataModel): Promise<void> {
    await this.database
      .insertInto('events')
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
        }),
      )
      .execute();
  }
}

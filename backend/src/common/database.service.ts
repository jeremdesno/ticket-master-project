import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DatabaseSchema } from './models';

@Injectable()
export class DatabaseService {
  private readonly database: Kysely<DatabaseSchema>;

  constructor(private configService: ConfigService) {
    const postgresUser = this.configService.get<string>('POSTGRES_USER');
    const postgresPassword =
      this.configService.get<string>('POSTGRES_PASSWORD');
    const postgresDatabase = this.configService.get<string>('POSTGRES_DB');
    console.log(`Connecting to database at 127.0.0.1:5433 as ${postgresUser}`);
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
  public getDatabase(): Kysely<DatabaseSchema> {
    return this.database;
  }
}

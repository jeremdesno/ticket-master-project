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
    const host = this.configService.get<string>('HOST', '127.0.0.1');
    const port = this.configService.get<string>('PORT', '5433');
    console.log(`Connecting to database at ${host}:${port} as ${postgresUser}`);
    this.database = new Kysely<DatabaseSchema>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: host,
          port: port,
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

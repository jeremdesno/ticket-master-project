import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Kysely } from 'kysely';

import { DatabaseService } from '../common/database.service';
import { DatabaseSchema, UserDataModel } from '../common/models';

@Injectable()
export class UsersService {
  private readonly database: Kysely<DatabaseSchema>;

  constructor(private readonly databaseService: DatabaseService) {
    this.database = this.databaseService.getDatabase();
  }

  async createUser(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.database
      .insertInto('users')
      .values({ username, password: hashedPassword })
      .execute();
  }

  async findByUsername(username: string): Promise<UserDataModel | undefined> {
    const users = await this.database
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .execute();
    return users[0];
  }
}

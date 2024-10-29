import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseService } from 'src/common/database.service';
import { DatabaseSchema } from 'src/common/models';

@Injectable()
export class FavoritesService {
  private readonly database: Kysely<DatabaseSchema>;

  constructor(private readonly databaseService: DatabaseService) {
    this.database = this.databaseService.getDatabase();
  }

  async addFavorite(userId: string, eventId: string): Promise<void> {
    await this.database
      .insertInto('favoriteEvents')
      .values({ userId, eventId })
      .onConflict((oc) => oc.doNothing())
      .execute();
  }

  async getUserFavorites(
    userId: string,
  ): Promise<{ userId: string; eventId: string }[]> {
    return await this.database
      .selectFrom('favoriteEvents')
      .selectAll()
      .where('userId', '=', userId)
      .execute();
  }

  async removeFavorite(userId: string, eventId: string): Promise<void> {
    await this.database
      .deleteFrom('favoriteEvents')
      .where('userId', '=', userId)
      .where('eventId', '=', eventId)
      .execute();
  }

  async removeAllFavorites(userId: string): Promise<void> {
    await this.database
      .deleteFrom('favoriteEvents')
      .where('userId', '=', userId)
      .execute();
  }
}

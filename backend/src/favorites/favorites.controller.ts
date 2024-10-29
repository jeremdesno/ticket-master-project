import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { FavoriteEventsDataModel } from 'src/common/models';

import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':userId/:eventId')
  async addFavorite(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<void> {
    await this.favoritesService.addFavorite(userId, eventId);
  }

  @Get(':userId/:eventId')
  async isFavorite(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<boolean> {
    return await this.favoritesService.isFavorite(userId, eventId);
  }

  @Get(':userId')
  async getUserFavorites(
    @Param('userId') userId: string,
  ): Promise<FavoriteEventsDataModel[]> {
    return await this.favoritesService.getUserFavorites(userId);
  }

  @Delete(':userId/:eventId')
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string,
  ): Promise<void> {
    await this.favoritesService.removeFavorite(userId, eventId);
  }

  @Delete(':userId')
  async removeAllFavorites(@Param('userId') userId: string): Promise<void> {
    await this.favoritesService.removeAllFavorites(userId);
  }
}

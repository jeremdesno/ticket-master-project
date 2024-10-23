import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  EventDataModel,
  EventSessionDataModel,
  GenreDataModel,
  SubGenreDataModel,
} from 'src/common/models';

import { EventService } from './events.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvents(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('genre') genre?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<EventDataModel[]> {
    return this.eventService.getEvents(
      startDate,
      endDate,
      genre,
      limit,
      offset,
    );
  }

  @Get('genres')
  async getGenres(): Promise<GenreDataModel[]> {
    return await this.eventService.getGenres();
  }

  @Get('subGenres')
  async getSubGenres(
    @Query('genreId') genreId: string,
  ): Promise<SubGenreDataModel[]> {
    return await this.eventService.getSubGenres(genreId);
  }

  @Get(':id')
  async getEvent(@Param('id') id: string): Promise<EventDataModel | null> {
    return this.eventService.getEvent(id);
  }

  @Get(':eventId/sessions')
  async getEventSessions(
    @Param('eventId') eventId: string,
    @Query('limit') limit: number = 5,
  ): Promise<EventSessionDataModel[] | []> {
    return this.eventService.getSessions(eventId, limit);
  }

  @Get('genres/:genre/numberEvents')
  async getTotalPages(@Param('genre') genre: string): Promise<number> {
    return this.eventService.getTotalGenreEvents(genre);
  }
}

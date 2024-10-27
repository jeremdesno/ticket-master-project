import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  EventDataModel,
  EventSessionDataModel,
  GenreDataModel,
  SubGenreDataModel,
} from 'src/common/models';

import { EventService } from './events.service';
import { Public } from '../auth/public.decorator';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvents(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('genre') genre?: string,
    @Query('subGenre') subGenre?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<EventDataModel[]> {
    return this.eventService.getEvents(
      startDate,
      endDate,
      genre,
      subGenre,
      limit,
      offset,
    );
  }

  @Public()
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

  @Get('count')
  async getEventsCount(
    @Query('genre') genre: string,
    @Query('subGenre') subGenre: string | null = null,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<number> {
    return this.eventService.getEventsCount(
      genre,
      subGenre,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async getEvent(@Param('id') id: string): Promise<EventDataModel | null> {
    return this.eventService.getEvent(id);
  }

  @Get(':eventId/sessions')
  async getEventSessions(
    @Param('eventId') eventId: string,
    @Query('startingAfter') startingAfter: string,
    @Query('endingBefore') endingBefore: string,
    @Query('limit') limit: number = 5,
  ): Promise<EventSessionDataModel[] | []> {
    return this.eventService.getSessions(
      eventId,
      startingAfter,
      endingBefore,
      limit,
    );
  }
}

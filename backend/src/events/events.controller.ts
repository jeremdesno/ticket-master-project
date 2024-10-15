import { Controller, Get, Query, Param } from '@nestjs/common';
import { EventDataModel, GenreDataModel } from 'src/common/models';

import { EventService } from './events.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvents(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<EventDataModel[]> {
    return this.eventService.getEvents(limit, offset);
  }

  @Get('by-date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<EventDataModel[]> {
    return this.eventService.findByDateRange(startDate, endDate, limit, offset);
  }

  @Get('genres')
  async getGenres(): Promise<GenreDataModel[]> {
    return await this.eventService.getGenres();
  }

  @Get(':id')
  async getEvent(@Param('id') id: string): Promise<EventDataModel | null> {
    return this.eventService.getEvent(id);
  }
}

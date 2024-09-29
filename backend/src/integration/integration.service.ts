import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { EventExtracted, EventsResponse } from './types';
import { EventDataModel } from '../database/events';

@Injectable()
export class IntegrationService {
  private readonly baseUrl = 'https://app.ticketmaster.com';
  private readonly apiKey: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TICKETMASTER_API_KEY');
  }

  async makeRequest<T>(url: string): Promise<T> {
    const maxRetries = 5;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const response = await lastValueFrom(this.httpService.get(url));
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          retryCount++;
        } else {
          throw new Error(`Error when making the request: ${error.message}`);
        }
      }
    }
    throw new Error(`Max retries reached for request: ${url}`);
  }

  async getEvents(): Promise<EventsResponse> {
    const startDateTime = new Date();
    startDateTime.setDate(startDateTime.getDate() + 1);
    startDateTime.setHours(0, 0, 0, 0);
    const startDateTimeFormatted = startDateTime
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z');

    const endDateTime = new Date(startDateTimeFormatted);
    endDateTime.setDate(endDateTime.getDate() + 1);
    const endDateTimeFormatted = endDateTime
      .toISOString()
      .replace(/\.\d{3}Z$/, 'Z');

    const url = `${this.baseUrl}/discovery/v2/events.json?apikey=${this.apiKey}&locale=*&city=Paris&countryCode=FR&startDateTime=${startDateTimeFormatted}&endDateTime=${endDateTimeFormatted}`;

    return await this.makeRequest<EventsResponse>(url);
  }

  async parsePageEvents(data: EventsResponse): Promise<EventDataModel[]> {
    if (!data._embedded || !data._embedded.events) {
      throw new Error('Invalid data structure');
    }

    return data._embedded.events.map((event: EventExtracted) => {
      const venue = event._embedded?.venues?.[0];
      const venueAddress = [
        venue.address?.line1,
        venue.address?.line2,
        venue.address?.line3,
      ]
        .filter(Boolean)
        .join(', ');

      const startDate = event.dates.start.dateTBD
        ? 'TBD'
        : `${event.dates.start.localDate} ${event.dates.start.localTime || ''}`.trim();

      const endDate = event.dates.end?.dateTBD
        ? 'TBD'
        : `${event.dates.end?.localDate || ''} ${event.dates.end?.localTime || ''}`.trim();

      return {
        id: event.id,
        name: event.name,
        startDate: startDate || 'TBD',
        endDate: endDate || 'TBD',
        startDateSales: event.sales.public.startDateTime,
        endDateSales: event.sales.public.endDateTime,
        url: event.url,
        description: event.description,
        eventType: event.type,
        venueAddress: venueAddress || 'No address available',
        venueName: venue.name || 'No information',
      };
    });
  }
  }
}

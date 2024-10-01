import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { EventExtracted, EventsResponse } from './types';
import { EventDataModel } from '../database/models';

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
        ? null
        : new Date(
            `${event.dates.start.localDate}T${event.dates.start.localTime || '00:00:00'}`,
          );

      const endDate = event.dates.end?.dateTBD
        ? null
        : event.dates.end?.localDate
          ? new Date(
              `${event.dates.end.localDate}T${event.dates.end.localTime || '23:59:59'}`,
            )
          : null;

      const startDateSales = event.sales.public.startDateTime
        ? new Date(event.sales.public.startDateTime)
        : null;

      const endDateSales = event.sales.public.endDateTime
        ? new Date(event.sales.public.endDateTime)
        : null;
      const genre: string[] = [];
      for (const classification of event.classifications) {
        genre.push(classification.genre?.name);
      }

      return {
        id: event.id,
        name: event.name,
        startDate: startDate,
        endDate: endDate,
        startDateSales: startDateSales,
        endDateSales: endDateSales,
        url: event.url,
        description: event.description,
        genre: genre.join('/'),
        venueAddress: venueAddress || 'No address available',
        venueName: venue.name || 'No information',
      };
    });
  }

  async parseEvents(data: EventsResponse): Promise<EventDataModel[]> {
    let events: EventDataModel[] = [];
    let nextUrl: string | null = data._links.self.href;

    while (nextUrl) {
      const pageEventsParsed = await this.parsePageEvents(data);
      events = events.concat(pageEventsParsed);

      const nextLink = data._links?.next;

      if (nextLink && nextLink.href) {
        nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;
        console.log();
        data = await this.makeRequest<EventsResponse>(nextUrl);
      } else {
        nextUrl = null;
      }
    }
    return events;
  }
}

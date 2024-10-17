import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Kysely } from 'kysely';
import { lastValueFrom } from 'rxjs';
import sharp from 'sharp';

import {
  ClassificationsResponse,
  EventExtracted,
  EventsResponse,
} from './types';
import { DatabaseService } from '../common/database.service';
import {
  DatabaseSchema,
  EventDataModel,
  GenreDataModel,
  SubGenreDataModel,
} from '../common/models';

@Injectable()
export class IntegrationService {
  private readonly baseUrl = 'https://app.ticketmaster.com';
  private readonly apiKey: string;
  private readonly imgBBApiKey: string;
  private readonly database: Kysely<DatabaseSchema>;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private databaseService: DatabaseService,
  ) {
    this.apiKey = this.configService.get<string>('TICKETMASTER_API_KEY');
    this.imgBBApiKey = this.configService.get<string>('IMGBB_API_KEY');
    this.database = this.databaseService.getDatabase();
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

  async resizeImage(imageUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data);

      return await sharp(imageBuffer)
        .resize(targetWidth, targetHeight)
        .toBuffer();
    } catch (error) {
      console.error('Error fetching or processing image:', error);
      throw error;
    }
  }

  async uploadToImgBB(imageBuffer: Buffer): Promise<string> {
    const base64Image = imageBuffer.toString('base64');
    const imgBBUrl = `https://api.imgbb.com/1/upload`;

    try {
      const formData = {
        key: this.imgBBApiKey,
        image: base64Image,
        expiration: 172800, // 2 jours
      };

      const response = await lastValueFrom(
        this.httpService.post(imgBBUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      );

      if (response.data && response.data.data.url) {
        return response.data.data.url;
      } else {
        throw new Error('Failed to upload image to imgBB');
      }
    } catch (error) {
      console.error('Error uploading image to imgBB:', error);
      throw new Error('Image upload to imgBB failed');
    }
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
    console.log(
      `Fetching events from the ${startDateTimeFormatted} to the ${endDateTimeFormatted}`,
    );
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
        genre.push(
          classification.segment?.name === 'Undefined'
            ? 'Others'
            : classification.segment?.name,
        );
      }
        let imageUrl: string | null = null;
        if (closestImage) {

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
          imageUrl: imageUrl,
      };
    });
  }

  async upsertEvent(event: EventDataModel): Promise<void> {
    await this.database
      .insertInto('events')
      .values(event)
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate,
          url: event.url,
          description: event.description,
          genre: event.genre,
          startDateSales: event.startDateSales,
          endDateSales: event.endDateSales,
          venueAddress: event.venueAddress,
          venueName: event.venueName,
          imageUrl: event.imageUrl,
        }),
      )
      .execute();
  }

  async parseAndSaveEvents(data: EventsResponse): Promise<void> {
    let nextUrl: string | null = data._links.self.href;

    while (nextUrl) {
      const pageEventsParsed = await this.parsePageEvents(data);

      for (const parsedEvent of pageEventsParsed) {
        this.upsertEvent(parsedEvent);
      }
      console.log('upserted page:', data.page.number);

      const nextLink = data._links?.next;

      if (nextLink && nextLink.href) {
        nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;
        data = await this.makeRequest<EventsResponse>(nextUrl);
      } else {
        nextUrl = null;
      }
    }
  }

  async getClassifications(): Promise<ClassificationsResponse> {
    const url = `${this.baseUrl}/discovery/v2/classifications.json?apikey=${this.apiKey}`;
    console.log('Fetching classifications');
    return await this.makeRequest<ClassificationsResponse>(url);
  }

  async parsePageClassifications(
    data: ClassificationsResponse,
  ): Promise<[GenreDataModel[], SubGenreDataModel[]]> {
    if (!data._embedded || !data._embedded.classifications) {
      throw new Error('Invalid data structure');
    }
    const subGenreList: SubGenreDataModel[] = [];
    const genreList: GenreDataModel[] = [];
    data._embedded.classifications.forEach((classification) => {
      const genreId = classification.segment?.id;
      const genreName =
        classification.segment?.name === 'Undefined'
          ? 'Others'
          : classification.segment?.name;
      if (genreId && genreName) {
        genreList.push({ id: genreId, name: genreName });
      }

      if (classification?.segment?._embedded?.genres) {
        classification.segment._embedded.genres.forEach((subGenre) => {
          subGenreList.push({
            id: subGenre.id,
            name: subGenre.name,
            genreId: genreId,
          });
        });
      }
    });
    return [genreList, subGenreList];
  }

  async upsertGenre(genre: GenreDataModel): Promise<void> {
    await this.database
      .insertInto('genres')
      .values(genre)
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: genre.name,
        }),
      )
      .execute();
  }

  async upsertSubGenre(subGenre: SubGenreDataModel): Promise<void> {
    await this.database
      .insertInto('subgenres')
      .values(subGenre)
      .onConflict((oc) =>
        oc.column('id').doUpdateSet({
          name: subGenre.name,
          genreId: subGenre.genreId,
        }),
      )
      .execute();
  }

  async parseAndSaveGenresAndSubGenres(
    data: ClassificationsResponse,
  ): Promise<void> {
    let nextUrl: string | null = data._links.self.href;

    while (nextUrl) {
      const [pageGenresParsed, pageSubGenresParsed] =
        await this.parsePageClassifications(data);

      for (const parsedGenre of pageGenresParsed) {
        this.upsertGenre(parsedGenre);
      }

      for (const parsedSubGenre of pageSubGenresParsed) {
        this.upsertSubGenre(parsedSubGenre);
      }
      console.log('upserted page:', data.page.number);

      const nextLink = data._links?.next;

      if (nextLink && nextLink.href) {
        nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;
        data = await this.makeRequest<ClassificationsResponse>(nextUrl);
      } else {
        nextUrl = null;
      }
    }
  }
}

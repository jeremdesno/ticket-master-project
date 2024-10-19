import axios from 'axios';
import { createHash } from 'crypto';
import sharp from 'sharp';
import {
  ExtractedEventDataModel,
  GenreDataModel,
  SubGenreDataModel,
} from 'src/common/models';

import {
  ClassificationsResponse,
  EventExtracted,
  EventsResponse,
  Image,
} from './types';

export const targetHeight = 200;
export const targetWidth = 300;

export const findClosestImage = (images: Image[]): Image | null => {
  let closestImage: Image | null = null;
  let closestDifference = Number.MAX_SAFE_INTEGER;

  for (const image of images) {
    const widthDifference = Math.abs(image.width - targetWidth);
    const heightDifference = Math.abs(image.height - targetHeight);
    const totalDifference = widthDifference + heightDifference;

    if (totalDifference < closestDifference) {
      closestDifference = totalDifference;
      closestImage = image;
    }
  }

  return closestImage;
};

export async function resizeImage(imageUrl: string): Promise<Buffer> {
  try {
    const response = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = Buffer.from(response.data);

    return await sharp(imageBuffer)
      .resize(targetWidth, targetHeight)
      .toBuffer();
  } catch (error) {
    console.error('Error fetching or processing image: ', error);
  }
}

export async function uploadToImgBB(imageBuffer: Buffer): Promise<string> {
  const imgBBApiKey = process.env.IMGBB_API_KEY;
  const base64Image = imageBuffer.toString('base64');
  const imgBBUrl = `https://api.imgbb.com/1/upload`;

  try {
    const formData = {
      key: imgBBApiKey,
      image: base64Image,
      expiration: 43200, // 12 hours
    };

    const response = await axios.post(imgBBUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.data.url) {
      return response.data.data.url;
    } else {
      throw new Error('Failed to upload image to imgBB');
    }
  } catch (error) {
    console.error('Error uploading image to imgBB: ', error);
  }
}

export async function parsePageEvents(
  data: EventsResponse,
): Promise<ExtractedEventDataModel[]> {
  if (!data._embedded || !data._embedded.events) {
    throw new Error('Invalid data structure');
  }

  const events = await Promise.all(
    data._embedded.events.map(async (event: EventExtracted) => {
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

      const closestImage = findClosestImage(event.images);

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
        imageUrl: closestImage.url,
      };
    }),
  );
  return events;
}

export function generateHashFromNameAndVenue(
  name: string,
  venueName: string,
): string {
  const hash = createHash('sha256');
  hash.update(name + venueName);
  return hash.digest('hex');
}

export async function parsePageClassifications(
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

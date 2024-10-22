import axiosInstance from './axios';
import {
  EventDataModel,
  EventSessionDataModel,
  ExtractedEventDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';

export const fetchEvents = async (
  genre?: string,
  startDate?: string,
  endDate?: string,
  limit = 15,
  offset = 0,
): Promise<ExtractedEventDataModel[]> => {
  const response = await axiosInstance.get('/events', {
    params: { genre, startDate, endDate, limit, offset },
  });

  // Parse dates
  const events = response.data.map((event: ExtractedEventDataModel) => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: event.endDate ? new Date(event.endDate) : null,
    startDateSales: new Date(event.startDateSales),
    endDateSales: new Date(event.endDateSales),
  }));

  return events;
};

export const fetchEvent = async (
  id: string,
): Promise<EventDataModel | null> => {
  const response = await axiosInstance.get(`/events/${id}`);
  const event = response.data;
  return event ? event : null;
};

export const fetchEventSessions = async (
  eventId: string,
  limit = 5,
): Promise<EventSessionDataModel[]> => {
  const response = await axiosInstance.get(
    `/events/${eventId}/sessions?limit=${limit}`,
  );
  const sessions = response.data;
  return sessions.map(
    (session: EventSessionDataModel): EventSessionDataModel => {
      return {
        ...session,
        startDate: new Date(session.startDate),
        endDate: session.endDate ? new Date(session.endDate) : null,
        startDateSales: new Date(session.startDateSales),
        endDateSales: new Date(session.endDateSales),
      };
    },
  );
};

export const fetchNumberEvents = async (genre: string): Promise<number> => {
  const response = await axiosInstance.get(
    `/events/genres/${genre}/numberEvents`,
  );
  return response.data;
};

export const SearchEvents = async (
  query: string,
  lastDocSortScore: number | null = null,
  lastDocSortId: string | null = null,
  size = 15,
): Promise<EventSearchResult[]> => {
  const response = await axiosInstance.get(`/search`, {
    params: { query, lastDocSortScore, lastDocSortId, size },
  });
  return response.data;
};

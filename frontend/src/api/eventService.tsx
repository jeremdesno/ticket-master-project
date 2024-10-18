import axiosInstance from './axios';
import { ExtractedEventDataModel } from '../../../backend/src/common/models';

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
): Promise<ExtractedEventDataModel | null> => {
  const response = await axiosInstance.get(`/events/${id}`);
  const event = response.data;
  if (event) {
    return {
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
      startDateSales: new Date(event.startDateSales),
      endDateSales: new Date(event.endDateSales),
    };
  } else {
    return null;
  }
};

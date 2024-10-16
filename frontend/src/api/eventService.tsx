import axiosInstance from './axios';
import { EventDataModel } from '../../../backend/src/common/models';

export const fetchEvents = async (
  genre?: string,
  startDate?: string,
  endDate?: string,
  limit = 15,
  offset = 0,
): Promise<EventDataModel[]> => {
  const response = await axiosInstance.get('/events', {
    params: { genre, startDate, endDate, limit, offset },
  });

  // Parse dates
  const events = response.data.map((event: EventDataModel) => ({
    ...event,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    startDateSales: new Date(event.startDateSales),
    endDateSales: new Date(event.endDateSales),
  }));

  return events;
};

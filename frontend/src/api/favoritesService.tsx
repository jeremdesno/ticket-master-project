import axiosInstance from './axios';
import { FavoriteEventsDataModel } from '../../../backend/src/common/models';

export const fetchFavoriteStatus = async (
  userId: number,
  eventId: string,
): Promise<boolean> => {
  const response = await axiosInstance.get(`favorites/${userId}/${eventId}`);
  return response.data;
};

export const addFavorite = async (
  userId: number,
  eventId: string,
): Promise<void> => {
  await axiosInstance.post(`favorites/${userId}/${eventId}`);
};

export const removeFavorite = async (
  userId: number,
  eventId: string,
): Promise<void> => {
  await axiosInstance.delete(`favorites/${userId}/${eventId}`);
};

export const fetchFavorites = async (
  userId: number,
): Promise<FavoriteEventsDataModel[] | null> => {
  try {
    const response = await axiosInstance.get(`favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Failed to fetch favorites');
    return null;
  }
};

import axiosInstance from './axios';

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

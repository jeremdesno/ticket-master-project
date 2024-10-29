import axiosInstance from './axios';

export interface GenreDataModel {
  id: string;
  name: string;
}

export const fetchGenres = async (): Promise<GenreDataModel[]> => {
  try {
    const response = await axiosInstance.get('/events/genres');
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const fetchSubGenres = async (
  genreId: string,
): Promise<GenreDataModel[]> => {
  try {
    const response = await axiosInstance.get(
      `/events/subGenres?genreId=${genreId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching genre ${genreId} subgenres:`, error);
    throw error;
  }
};

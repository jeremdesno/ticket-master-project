import axiosInstance from './axios';

export const login = async (
  username: string,
  password: string,
): Promise<void> => {
  await axiosInstance.post('/auth/login', { username, password });
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const whoami = async (): Promise<string> => {
  const response = await axiosInstance.get('auth/whoami');
  return response.data;
};

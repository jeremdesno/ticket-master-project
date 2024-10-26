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

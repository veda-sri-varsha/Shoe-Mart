import { Credentials, Signup } from '@/interfaces/auth';
import { authQueries } from '@/api/react-query/auth';
import { axiosInstance } from '@/services/API/axios';
import { LocalStorageService } from '@/services/local-storage-service';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_PERMISSIONS_KEY,
} from '@/utils/constants';
import axios from 'axios';

export const login = async (body: Credentials) => {
  const { data } = await axiosInstance.post(authQueries.login.endpoint, body);
  return data;
};

export const signup = async (body: Signup) => {
  const { data } = await axiosInstance.post(authQueries.signup.endpoint, body);
  return data;
};

export const getAccessToken = async () => {
  try {
    const refreshToken = LocalStorageService.get(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      window.location.href = '/login';
      return;
    }

    const { data } = await axios.get(
      ${process.env.NEXT_PUBLIC_SERVER_BASE_URL}iam/auth/token/refresh,
      {
        headers: {
          Authorization: Bearer ${refreshToken},
        },
      },
    );
    LocalStorageService.set(ACCESS_TOKEN_KEY, data.data.access_token);
    window.location.reload();
  } catch {
    window.location.href = '/login';
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post(authQueries.logout.endpoint);
  } catch {
  } finally {
    LocalStorageService.remove(ACCESS_TOKEN_KEY);
    LocalStorageService.remove(REFRESH_TOKEN_KEY);
    LocalStorageService.remove(USER_PERMISSIONS_KEY);

    window.location.href = '/login';
  }
};
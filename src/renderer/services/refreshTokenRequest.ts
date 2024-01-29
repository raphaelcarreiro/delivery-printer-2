import axios from 'axios';
import constants from 'renderer/constants/constants';

export async function refreshTokenRequest(): Promise<string> {
  const api = axios.create({
    baseURL: constants.BASE_URL,
    withCredentials: true,
    headers: {
      app: 'admin',
    },
  });

  const response = await api.post('/auth/refresh');

  return response.data.token;
}

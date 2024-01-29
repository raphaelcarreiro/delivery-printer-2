import axios, { CancelTokenSource, AxiosError, AxiosRequestConfig } from 'axios';
import { refreshTokenRequest } from './refreshTokenRequest';
import constants from 'renderer/constants/constants';
import { history } from './history';

type Queue = {
  onSuccess: (config: AxiosRequestConfig) => void;
  onFailure: (err: Error) => void;
  config: any;
  error: AxiosError;
};

let isRefresing = false;
let queue: Queue[] = [];

const api = axios.create({
  baseURL: constants.BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    if (config.headers) {
      config.headers.App = 'admin';
    }

    return config;
  },
  err => Promise.reject(err)
);

api.interceptors.response.use(
  response => response,
  async (error: AxiosError<any>) => {
    const config = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (error.response?.data?.code === 'login.invalid_credentials') {
      return Promise.reject(error);
    }

    if (error.response?.data?.code !== 'access_token.expired') {
      history.push('/login');
      return Promise.reject(error);
    }

    if (isRefresing) {
      return new Promise((resolve, reject) => {
        queue.push({
          onSuccess: _config => resolve(api(_config)),
          onFailure: _error => reject(_error),
          config,
          error,
        });
      });
    }

    if (!isRefresing) {
      isRefresing = true;

      try {
        await refreshTokenRequest();

        if (!config) {
          return Promise.reject(error);
        }

        queue.forEach(item => {
          item.onSuccess(item.config);
        });

        return await api(config);
      } catch (err) {
        console.error(err);
        queue.forEach(item => item.onFailure(item.error));
        history.push('/login');
      } finally {
        isRefresing = false;
        queue = [];
      }
    }

    return Promise.reject(error);
  }
);

export function getCancelTokenSource(): CancelTokenSource {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
}

export { api };

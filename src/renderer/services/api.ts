import axios, { CancelTokenSource } from 'axios';
import constants from 'renderer/constants/constants';
import { apiErrorInterceptor } from './apiErrorInterceptor';

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
  error => apiErrorInterceptor(error)
);

export function getCancelTokenSource(): CancelTokenSource {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
}

export { api };

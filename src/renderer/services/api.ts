import axios, { CancelTokenSource } from 'axios';
import constants from 'renderer/constants/constants';
import { history } from './history';

const api = axios.create({
  baseURL: constants.BASE_URL,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    if (config.headers) {
      config.headers.App = 'admin';
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  config => {
    return config;
  },
  err => {
    const token = localStorage.getItem('token');

    if (token && err?.response?.status === 401) {
      localStorage.removeItem('token');
      history.push('/login');
      return;
    }

    return Promise.reject(err);
  }
);

export function getCancelTokenSource(): CancelTokenSource {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
}

export { api };

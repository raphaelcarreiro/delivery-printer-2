import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setRestaurant } from 'renderer/store/modules/restaurant/actions';
import { setUser } from 'renderer/store/modules/user/actions';
import { User } from 'renderer/types/user';
import { api } from 'renderer/services/api';
import { AxiosError } from 'axios';
import { useSocketConnections } from 'renderer/hooks/useSockets';

interface AuthContextData {
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  authenticated: boolean;
  checkEmail(email: string): Promise<User>;
  loading: boolean;
  me(): Promise<void>;
}

const AuthContext = React.createContext({} as AuthContextData);

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useSocketConnections(authenticated);

  useEffect(() => {
    setLoading(true);
    api
      .get('/users/me')
      .then(response => {
        dispatch(setRestaurant(response.data.restaurant));
        dispatch(setUser(response.data));
        setAuthenticated(true);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        const response = await api.post('/login', { email, password });
        dispatch(setRestaurant(response.data.data.restaurant));
        dispatch(setUser(response.data.data.user));
        setAuthenticated(true);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          throw new Error('Usuário ou senha incorretos');
        }

        throw new Error('Não foi possível fazer o login');
      }
    },
    [dispatch]
  );

  const checkEmail = useCallback(async (email: string): Promise<User> => {
    try {
      const response = await api.get(`/user/show/${email}`);
      return response.data.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        throw new Error('E-mail não encontrado');
      }

      throw err;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await api.post('/logout');
    setAuthenticated(false);
    dispatch(setRestaurant(null));
    dispatch(setUser({} as User));
  }, [dispatch]);

  const me = useCallback(async () => {
    await api.get('/users/me');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        authenticated,
        checkEmail,
        loading,
        me,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

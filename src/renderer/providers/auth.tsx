import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setRestaurant } from 'renderer/store/modules/restaurant/actions';
import { setUser } from 'renderer/store/modules/user/actions';
import { User } from 'renderer/types/user';
import { api } from 'renderer/services/api';

interface AuthContextData {
  login(email: string, password: string): Promise<boolean>;
  logout(): Promise<boolean>;
  isAuthenticated(): boolean;
  checkEmail(email: string): Promise<User>;
  loading: boolean;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    setLoading(true);
    api
      .get('/users/current')
      .then(response => {
        dispatch(setRestaurant(response.data.restaurant));
        dispatch(setUser(response.data));
      })
      .catch(err => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        api
          .post('/login', { email, password })
          .then(_response => {
            const response = _response.data.data;
            localStorage.setItem('token', response.token);
            dispatch(setRestaurant(response.restaurant));
            dispatch(setUser(response.user));
            resolve(true);
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 401) reject(new Error('Usuário ou senha incorretos'));
            } else reject(new Error(err.message));
          });
      });
    },
    [dispatch]
  );

  const checkEmail = useCallback((email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      api
        .get(`/user/show/${email}`)
        .then(response => {
          resolve(response.data.data);
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 401) reject(new Error('E-mail não encontrado'));
          } else reject(new Error(err.message));
        });
    });
  }, []);

  const logout = useCallback((): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      api
        .post('/logout')
        .then(() => {
          localStorage.removeItem('token');
          dispatch(setRestaurant(null));
          resolve(true);
        })
        .catch(err => {
          reject(new Error(err));
        });
    });
  }, [dispatch]);

  const isAuthenticated = useCallback((): boolean => {
    return !!localStorage.getItem('token');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        checkEmail,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

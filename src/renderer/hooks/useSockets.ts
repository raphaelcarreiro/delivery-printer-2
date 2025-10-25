import { useAuth } from 'renderer/providers/auth';
import { useAdminSocket } from './useAdminSocket';
import { useBoardSocket } from './useBoardSocket';
import { useOrderSocket } from './useOrderSocket';
import { useEffect } from 'react';

export function useSocketConnections(isAuthenticated: boolean) {
  const { socket: adminSocket } = useAdminSocket();
  const { socket: boardSocket } = useBoardSocket();
  const { socket: orderSocket } = useOrderSocket();

  useEffect(() => {
    if (isAuthenticated) {
      orderSocket?.connect();
    } else {
      orderSocket?.disconnect();
    }
  }, [isAuthenticated, orderSocket]);

  useEffect(() => {
    if (isAuthenticated) {
      boardSocket?.connect();
    } else {
      boardSocket?.disconnect();
    }
  }, [isAuthenticated, boardSocket]);

  useEffect(() => {
    if (isAuthenticated) {
      adminSocket?.connect();
    } else {
      adminSocket?.disconnect();
    }
  }, [isAuthenticated, adminSocket]);
}

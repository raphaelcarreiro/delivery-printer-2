import constants from 'renderer/constants/constants';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'renderer/store/selector';
import { useDispatch } from 'react-redux';

const socket: Socket = io(constants.WS_BASE_URL);

type UseSocket = [Socket, boolean];

let timer: NodeJS.Timeout;

export function useSocket(): UseSocket {
  const [connected, setConnected] = useState(socket.connected);
  const restaurant = useSelector(state => state.restaurant);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });
  }, [restaurant, dispatch]);

  useEffect(() => {
    if (restaurant && connected) {
      socket.emit('register', restaurant.id);
      socket.emit('printer_ping', restaurant.id);

      timer = setInterval(() => {
        socket.emit('printer_ping', restaurant.id);
      }, 30000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [connected, restaurant]);

  return [socket, connected];
}

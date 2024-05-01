import constants from 'constants/constants';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'renderer/store/selector';
import { useDispatch } from 'react-redux';
import { setRestaurantIsOpen } from 'renderer/store/modules/restaurant/actions';
import packageJson from '../../../package.json';

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

    socket.on('handleRestaurantState', (response: { isOpen: boolean }) => {
      dispatch(setRestaurantIsOpen(response.isOpen));
    });

    socket.on('admin_ping', () => {
      socket.emit('printer_ping', {
        restaurant_id: restaurant?.id,
        version: packageJson.version,
      });
    });

    return () => {
      socket.off('handleRestaurantState');
      socket.off('admin_ping');
    };
  }, [restaurant, dispatch]);

  useEffect(() => {
    if (restaurant && connected) {
      socket.emit('register', restaurant.id);
      socket.emit('printer_ping', {
        restaurant_id: restaurant.id,
        version: packageJson.version,
      });

      timer = setInterval(() => {
        socket.emit('printer_ping', {
          restaurant_id: restaurant.id,
          version: packageJson.version,
        });
      }, 30000);

      window.electron.socketRegister(restaurant.id);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [connected, restaurant]);

  return [socket, connected];
}

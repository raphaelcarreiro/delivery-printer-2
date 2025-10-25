import constants from 'constants/constants';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'renderer/store/selector';
import { useDispatch } from 'react-redux';
import { setRestaurantIsOpen } from 'renderer/store/modules/restaurant/actions';
import packageJson from '../../../package.json';
import { useAdminSocket } from './useAdminSocket';

let timer: NodeJS.Timeout;

export function useAdminSocketEvents(): void {
  const restaurant = useSelector(state => state.restaurant);
  const dispatch = useDispatch();
  const { socket, isConnected } = useAdminSocket();

  useEffect(() => {
    socket?.on('handleRestaurantState', (response: { isOpen: boolean }) => {
      dispatch(setRestaurantIsOpen(response.isOpen));
    });

    socket?.on('admin_ping', () => {
      socket?.emit('printer_ping', {
        restaurant_id: restaurant?.uuid,
        version: packageJson.version,
      });
    });

    return () => {
      socket?.off('handleRestaurantState');
      socket?.off('admin_ping');
    };
  }, [restaurant, dispatch, socket]);

  useEffect(() => {
    if (restaurant && isConnected) {
      socket?.emit('printer_ping', {
        restaurant_id: restaurant.id,
        restaurant_uuid: restaurant.uuid,
        version: packageJson.version,
      });

      timer = setInterval(() => {
        socket?.emit('printer_ping', {
          restaurant_id: restaurant.id,
          restaurant_uuid: restaurant.uuid,
          version: packageJson.version,
        });
      }, 30000);

      window.electron.socketRegister(restaurant.uuid);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isConnected, restaurant, socket]);
}

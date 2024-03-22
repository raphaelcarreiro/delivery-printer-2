import constants from 'renderer/constants/constants';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'renderer/store/selector';
import { useDispatch } from 'react-redux';
import { OrderData } from 'renderer/types/order';
import { setRestaurantIsOpen } from 'renderer/store/modules/restaurant/actions';
import { BoardControlMovement } from 'renderer/types/boardControlMovement';

const socket: Socket = io(constants.WS_BASE_URL);

type UseSocket = [Socket, boolean];

let timer: NodeJS.Timeout;

export function useSocket(print: (orderId: string) => void): UseSocket {
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

    socket.on('stored', (order: OrderData) => {
      print(order.uuid);
    });

    socket.on('printOrder', (order: OrderData) => {
      print(order.uuid);
    });

    socket.on('print_board_billing', (movement: BoardControlMovement) => {
      // setBoardMovement(movement);
    });

    socket.on('handleRestaurantState', (response: { isOpen: boolean }) => {
      dispatch(setRestaurantIsOpen(response.isOpen));
    });

    socket.on('admin_ping', () => {
      socket.emit('printer_ping', restaurant?.id);
    });

    return () => {
      socket.off('handleRestaurantState');
      socket.off('printShipment');
      socket.off('printOrder');
      socket.off('stored');
      socket.off('print_board_billing');
    };
  }, [restaurant, dispatch, print]);

  useEffect(() => {
    if (!restaurant?.configs?.print_only_shipment) {
      socket.on('printShipment', (order: OrderData) => {
        print(order.uuid);
      });
    }

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
  }, [connected, restaurant, print]);

  return [socket, connected];
}

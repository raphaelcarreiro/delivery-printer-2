import constants from 'renderer/constants/constants';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormarOrder } from './useFormatOrder';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'renderer/store/selector';
import { useDispatch } from 'react-redux';
import { OrderData } from 'renderer/types/order';
import { setRestaurantIsOpen } from 'renderer/store/modules/restaurant/actions';
import { BoardControlMovement } from 'renderer/types/boardControlMovement';

const socket: Socket = io(constants.WS_BASE_URL);

type UseSocket = [Socket, boolean];

let timer: NodeJS.Timeout;

export function useSocket(
  setOrders: Dispatch<SetStateAction<OrderData[]>>,
  setShipment: Dispatch<SetStateAction<OrderData | null>>,
  setBoardMovement: Dispatch<SetStateAction<BoardControlMovement | null>>
): UseSocket {
  const formatOrder = useFormarOrder();
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
      const formattedOrder = formatOrder(order);
      setOrders(oldOrders => [...oldOrders, formattedOrder]);
    });

    socket.on('printOrder', (order: OrderData) => {
      const formattedOrder = formatOrder(order);
      setOrders(oldOrders => [...oldOrders, formattedOrder]);
    });

    socket.on('print_board_billing', (movement: BoardControlMovement) => {
      setBoardMovement(movement);
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
  }, [restaurant, dispatch, formatOrder, setOrders, setBoardMovement]);

  useEffect(() => {
    if (!restaurant?.configs.print_only_shipment) {
      socket.on('printShipment', (order: OrderData) => {
        const formattedOrder = formatOrder(order);
        setShipment(formattedOrder);
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
  }, [connected, restaurant, setShipment, formatOrder]);

  return [socket, connected];
}

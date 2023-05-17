import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'renderer/store/selector';
import { useAuth } from 'renderer/providers/auth';
import { api } from 'renderer/services/api';
import Status from '../status/Status';
import { history } from 'renderer/services/history';
import { OrderData } from 'renderer/types/order';
import { useFormarOrder } from 'renderer/hooks/useFormatOrder';
import { useSocket } from 'renderer/hooks/useSocket';
import InsideLoading from '../loading/InsideLoading';
import { BoardControlMovement } from 'renderer/types/boardControlMovement';
import ApprovedOrderSplittedByProduct from '../printing-layouts/ApprovedOrderSplittedByProduct';
import DispatchedOrderOnly from '../printing-layouts/DispatchedOrderOnly';
import ApprovedBoardOrder from '../printing-layouts/ApprovedBoardOrder';
import ApprovedOrder from '../printing-layouts/ApprovedOrder';
import DispatchedOrder from '../printing-layouts/DispatchedOrder';
import BoardBilling from '../printing-layouts/board-billing/BoardBilling';

const Home: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [toPrint, setToPrint] = useState<OrderData | null>(null);
  const [shipment, setShipment] = useState<OrderData | null>(null);
  const restaurant = useSelector(state => state.restaurant);
  const auth = useAuth();
  const formatOrder = useFormarOrder();
  const [boardMovement, setBoardMovement] = useState<BoardControlMovement | null>(null);
  const [socket, wsConnected] = useSocket(setOrders, setShipment, setBoardMovement);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get('/orders/print/list');
        if (response.data.length > 0) {
          const formattedOrders = response.data.map((order: OrderData) => formatOrder(order));
          setOrders(oldOrders => [...oldOrders, ...formattedOrders]);
        }
      } catch (err) {
        console.log(err);
      }
    }

    const timer = setInterval(getOrders, 18000);

    return () => {
      clearInterval(timer);
    };
  }, [formatOrder]);

  useEffect(() => {
    if (orders.length > 0) {
      const tp = orders.find(order => !order.printed);

      if (!tp) {
        setOrders([]);
        setToPrint(null);
        return;
      }

      setToPrint(tp);
    }
  }, [orders]);

  const handleOrderClose = useCallback(() => {
    if (toPrint)
      setOrders(oldOrders =>
        oldOrders.map(order => {
          if (order.id === toPrint.id) order.printed = true;
          return order;
        })
      );
  }, [toPrint]);

  const handleShipmentClose = useCallback(() => {
    if (shipment) setShipment(null);
  }, [shipment]);

  function handleLogout() {
    auth.logout().then(() => {
      socket.disconnect();
      history.push('/login');
    });
  }

  if (auth.loading) {
    return <InsideLoading />;
  }

  return (
    <>
      {toPrint && !toPrint.printed ? (
        restaurant?.configs.print_by_product ? (
          <ApprovedOrderSplittedByProduct handleClose={handleOrderClose} order={toPrint} />
        ) : toPrint.board_movement_id ? (
          <ApprovedBoardOrder handleClose={handleOrderClose} order={toPrint} />
        ) : restaurant?.configs.print_only_shipment ? (
          <DispatchedOrderOnly order={toPrint} handleClose={handleOrderClose} />
        ) : (
          <ApprovedOrder handleClose={handleOrderClose} order={toPrint} />
        )
      ) : shipment && !shipment.printed ? (
        <DispatchedOrder order={shipment} handleClose={handleShipmentClose} />
      ) : boardMovement ? (
        <BoardBilling movement={boardMovement} handleClose={() => setBoardMovement(null)} />
      ) : (
        <Status wsConnected={wsConnected} handleLogout={handleLogout} />
      )}
    </>
  );
};

export default Home;

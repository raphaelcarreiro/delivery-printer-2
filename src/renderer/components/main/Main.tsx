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
import { Button } from '@material-ui/core';

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
        const formattedOrders = response.data.map((order: OrderData) => formatOrder(order));
        setOrders(state => (state.length > 0 ? state : formattedOrders));
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

  const handleClose = useCallback(() => {
    if (!toPrint) {
      return;
    }

    setOrders(state =>
      state.map(order => {
        if (order.id === toPrint.id) {
          order.printed = true;
        }
        return order;
      })
    );
  }, [toPrint]);

  function handleLogout() {
    auth.logout().then(() => {
      socket.disconnect();
      history.push('/login');
    });
  }

  if (auth.loading) {
    return <InsideLoading />;
  }

  function handleClick() {
    window.electron
      .rawPrint(
        `<html>
        <body>
          <h1>Hello</h1>
        </body>
      </html>`
      )
      .catch(err => console.error(err));
  }

  return (
    <>
      <div style={{ padding: 20 }}>
        <Button onClick={handleClick} variant="contained" color="primary">
          imprimir
        </Button>
      </div>
      {toPrint ? (
        restaurant?.configs.print_by_product ? (
          <ApprovedOrderSplittedByProduct handleClose={handleClose} data={toPrint} />
        ) : toPrint.board_movement_id ? (
          <ApprovedBoardOrder handleClose={handleClose} data={toPrint} />
        ) : restaurant?.configs.print_only_shipment ? (
          <DispatchedOrderOnly data={toPrint} handleClose={handleClose} />
        ) : (
          <ApprovedOrder handleClose={handleClose} data={toPrint} />
        )
      ) : shipment ? (
        <DispatchedOrder data={shipment} handleClose={() => setShipment(null)} />
      ) : boardMovement ? (
        <BoardBilling movement={boardMovement} handleClose={() => setBoardMovement(null)} />
      ) : (
        <Status wsConnected={wsConnected} handleLogout={handleLogout} />
      )}
    </>
  );
};

export default Home;

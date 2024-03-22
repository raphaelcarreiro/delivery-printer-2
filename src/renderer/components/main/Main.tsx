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
import { Button } from '@material-ui/core';

const Home: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [toPrint, setToPrint] = useState<OrderData | null>(null);
  const [shipment, setShipment] = useState<OrderData | null>(null);
  const restaurant = useSelector(state => state.restaurant);
  const auth = useAuth();
  const formatOrder = useFormarOrder();
  const [boardMovement, setBoardMovement] = useState<BoardControlMovement | null>(null);

  const print = useCallback((uuid: string) => {
    window.electron
      .rawPrint(`http://localhost:8000/orders/${uuid}/print-created`)
      .then(() => {})
      .catch(err => console.error(err));
  }, []);

  const [socket, wsConnected] = useSocket(print);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get('/orders/print/list');
        response.data.forEach((order: OrderData) => print(order.uuid));
      } catch (err) {
        console.log(err);
      }
    }

    const timer = setInterval(getOrders, 18000);

    return () => {
      clearInterval(timer);
    };
  }, [print]);

  useEffect(() => {
    const tp = orders.find(order => !order.printed);

    if (!tp) {
      setOrders([]);
      setToPrint(null);
      return;
    }

    setToPrint(tp);
  }, [orders]);

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
      .rawPrint(`http://localhost:8000/orders/0f16cb13-4212-4253-a47e-b0142aefaccc/print-created`)
      .then(() => {})
      .catch(err => console.error(err));
  }

  return (
    <>
      <div style={{ padding: 20 }}>
        <Button onClick={handleClick} variant="contained" color="primary">
          imprimir
        </Button>
      </div>

      <Status wsConnected={wsConnected} handleLogout={handleLogout} />
    </>
  );
};

export default Home;

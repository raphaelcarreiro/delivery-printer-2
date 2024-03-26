import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from 'renderer/providers/auth';
import { api } from 'renderer/services/api';
import Status from '../status/Status';
import { history } from 'renderer/services/history';
import { OrderData } from 'renderer/types/order';
import { useSocket } from 'renderer/hooks/useSocket';
import InsideLoading from '../loading/InsideLoading';

export enum PrintingLayoutOptions {
  created = 'print-created',
  dispatched = 'print-dispatched',
  onlyDispatched = 'print-dispatched-v2',
}

const Home: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const auth = useAuth();

  const print = useCallback((uuid: string, layout: PrintingLayoutOptions) => {
    return window.electron
      .rawPrint(`http://localhost:8000/orders/${uuid}/${layout}`)
      .then(() => uuid)
      .catch(err => console.error(err));
  }, []);

  const [socket, wsConnected] = useSocket(print);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get('/orders/print/list');

        const ids = await Promise.all(
          response.data.map((order: OrderData) => print(order.uuid, PrintingLayoutOptions.created))
        );

        await Promise.all(ids.map(id => api.post(`/orders/printed`, { order_id: id })));
      } catch (err) {
        console.log(err);
      }
    }

    const timer = setInterval(getOrders, 18000);

    return () => {
      clearInterval(timer);
    };
  }, [print]);

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
      <Status wsConnected={wsConnected} handleLogout={handleLogout} />
    </>
  );
};

export default Home;

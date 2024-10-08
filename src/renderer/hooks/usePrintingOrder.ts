import { useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { OrderData } from 'renderer/types/order';
import { api } from 'renderer/services/api';
import constants from 'constants/constants';
import { uuidv4 } from 'renderer/helpers/uuid';

type PrintingLayoutOptions = 'print-created' | 'print-dispatched';

type Response = {
  content: string;
  copies: number;
  device_name: string | null;
};

export function usePrintingOrder(socket: Socket, isConnected: boolean): void {
  const print = useCallback(async (uuid: string, layout: PrintingLayoutOptions) => {
    try {
      const response = await api.get<Response[]>(`${constants.BASE_URL}orders/${uuid}/${layout}`);

      const promises = response.data.map(payload =>
        window.electron.rawPrint({
          content: payload.content,
          copies: payload.copies,
          deviceName: payload.device_name,
          id: uuidv4(),
        })
      );

      await Promise.all(promises);

      api.patch(`/orders/${uuid}/printed`);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    socket.on('printOrder', (order: OrderData) => {
      print(order.uuid, 'print-created');
    });

    socket.on('printShipment', (order: OrderData) => {
      print(order.uuid, 'print-dispatched');
    });

    return () => {
      socket.off('printShipment');
      socket.off('printOrder');
    };
  }, [print, socket]);

  useEffect(() => {
    async function findOrders() {
      try {
        const response = await api.get<OrderData[]>('/orders/print/list');
        await Promise.all(response.data.map(order => print(order.uuid, 'print-created')));
      } catch (err) {
        console.log(err);
      }
    }

    if (isConnected) {
      findOrders();
    }
  }, [isConnected, print]);
}

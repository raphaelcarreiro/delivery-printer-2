import { useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { OrderData } from 'renderer/types/order';
import { api } from 'renderer/services/api';
import constants from 'renderer/constants/constants';

export enum PrintingLayoutOptions {
  created = 'print-created',
  dispatched = 'print-dispatched',
  onlyDispatched = 'print-dispatched-v2',
}

export function usePrintingOrder(socket: Socket): void {
  const print = useCallback(async (uuid: string, layout: PrintingLayoutOptions) => {
    try {
      await window.electron.rawPrint(`${constants.BASE_URL}orders/${uuid}/${layout}`);

      return uuid;
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    socket.on('stored', (order: OrderData) => {
      print(order.uuid, PrintingLayoutOptions.created);
    });

    socket.on('printOrder', (order: OrderData) => {
      print(order.uuid, PrintingLayoutOptions.created);
    });

    socket.on('printShipment', (order: OrderData) => {
      print(order.uuid, PrintingLayoutOptions.dispatched);
    });

    return () => {
      socket.off('printShipment');
      socket.off('printOrder');
      socket.off('stored');
    };
  }, [print, socket]);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get('/orders/print/list');

        const ids = await Promise.all(
          response.data.map((order: OrderData) => print(order.uuid, PrintingLayoutOptions.created))
        );

        await Promise.all(ids.map(id => api.patch(`/orders/${id}/printed`)));
      } catch (err) {
        console.log(err);
      }
    }

    const timer = setInterval(getOrders, 18000);

    return () => {
      clearInterval(timer);
    };
  }, [print]);
}

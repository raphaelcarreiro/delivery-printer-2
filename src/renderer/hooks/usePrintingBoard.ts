import { useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { BoardControlMovement } from 'renderer/types/boardControlMovement';
import constants from 'renderer/constants/constants';
import { api } from 'renderer/services/api';
import { uuidv4 } from 'renderer/helpers/uuid';

type PrintingLayoutOptions = 'billing-content' | 'content';

type Response = {
  content: string;
  copies: number;
  device_name: string | null;
};

export function usePrintingBoard(socket: Socket): void {
  const print = useCallback(async (session: BoardControlMovement, layout: PrintingLayoutOptions) => {
    try {
      const response = await api.get<Response[]>(`${constants.BASE_URL}board-sessions/${session.id}/${layout}`);

      const promises = response.data.map(payload =>
        window.electron.rawPrint({
          content: payload.content,
          copies: payload.copies,
          deviceName: payload.device_name,
          id: uuidv4(),
        })
      );

      await Promise.all(promises);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    socket.on('print_board_billing', (session: BoardControlMovement) => {
      print(session, 'billing-content');
    });

    socket.on('print_board', (session: BoardControlMovement) => {
      print(session, 'content');
    });

    return () => {
      socket.off('print_board_billing');
    };
  }, [print, socket]);
}

import { useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { BoardControlMovement } from 'renderer/types/boardControlMovement';
import constants from 'renderer/constants/constants';

export enum PrintingLayoutOptions {
  billing = 'billing',
}

export function usePrintingBoard(socket: Socket): void {
  const print = useCallback((session: BoardControlMovement, layout: PrintingLayoutOptions) => {
    window.electron
      .rawPrint(`${constants.BASE_URL}boardMovements/${session.id}/${layout}`)
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    socket.on('print_board_billing', (session: BoardControlMovement) => {
      print(session, PrintingLayoutOptions.billing);
    });

    return () => {
      socket.off('print_board_billing');
    };
  }, [print, socket]);
}

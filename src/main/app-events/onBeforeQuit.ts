import { socketRestaurantUuid } from '../../main/ipc-events/onSocketRegister';
import { Socket } from 'socket.io-client';

export function onBeforeQuit(socket: Socket) {
  socket.emit('printer_exited', socketRestaurantUuid);
}

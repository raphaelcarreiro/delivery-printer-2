import { IpcMainInvokeEvent } from 'electron';
import { Socket } from 'socket.io-client';

export let socketRestaurantId: number;

export function onSocketRegister(event: IpcMainInvokeEvent, socket: Socket, id: number) {
  socket.emit('register', id);
  socketRestaurantId = id;
}

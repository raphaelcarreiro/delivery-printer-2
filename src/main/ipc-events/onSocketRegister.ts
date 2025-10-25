import { IpcMainInvokeEvent } from 'electron';
import { Socket } from 'socket.io-client';

export let socketRestaurantUuid: string;

export function onSocketRegister(event: IpcMainInvokeEvent, socket: Socket, id: string) {
  socket.emit('subscribe_channel', id);
  socketRestaurantUuid = id;
}

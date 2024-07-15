import { IpcMainInvokeEvent, Notification } from 'electron';

export function onNotification(event: IpcMainInvokeEvent, orderSequence: string) {
  new Notification({
    title: 'Pedido recebido',
    body: `Pedido ${orderSequence} enviado para impressão`,
    icon: './assets/icon.ico',
  }).show();
}

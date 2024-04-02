import { IpcMainEvent } from 'electron';

export async function onIPCExample(event: IpcMainEvent, arg: string) {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;

  console.log(msgTemplate(arg));

  event.reply('ipc-example', msgTemplate('pong'));
}

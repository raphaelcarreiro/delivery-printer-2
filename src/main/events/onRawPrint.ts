import { BrowserWindow, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';

type Payload = {
  content: string;
  copies: number;
  deviceName: string;
  id: string;
};

export async function onRawPrint(event: IpcMainInvokeEvent, { content, copies, deviceName, id }: Payload) {
  const win = new BrowserWindow({ show: false });

  const file = path.join(os.tmpdir(), `${id}.print.html`);

  fs.writeFileSync(file, content);

  const printers = await win.webContents.getPrintersAsync();

  const printer = printers.find(printer => printer.name === deviceName);

  await win.webContents.loadFile(file);

  await new Promise((resolve, reject) => {
    win.webContents.print(
      {
        silent: true,
        deviceName: printer?.name,
        color: false,
        collate: false,
        copies,
        margins: {
          marginType: 'none',
        },
      },
      (success, reason) => {
        win.close();

        if (success) {
          fs.rmSync(file);
          resolve(success);
          return;
        }

        reject(reason);
      }
    );
  });
}

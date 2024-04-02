/**
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { BrowserWindow, app, ipcMain } from 'electron';
import { onRawPrint } from './ipc-events/onRawPrint';
import { TrayBuilder } from './tray';
import { MainWindowBuilder } from './window';
import { onWindowAllClosed } from './app-events/onWindowAllClosed';
import { onIPCExample } from './ipc-events/onIPCExample';

async function mainWindow(): Promise<BrowserWindow> {
  const window = await new MainWindowBuilder(app).build();

  new TrayBuilder(app, window).build();

  return window;
}

ipcMain.on('ipc-example', onIPCExample);
ipcMain.handle('rawPrint', onRawPrint);

app.on('window-all-closed', () => onWindowAllClosed(app));

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app
  .whenReady()
  .then(async () => {
    const window = await mainWindow();

    app.on('second-instance', () => {
      if (window.isMinimized()) {
        window.restore();
      }

      window.focus();
    });

    app.on('activate', () => {
      console.log('activate');
    });
  })
  .catch(console.log);

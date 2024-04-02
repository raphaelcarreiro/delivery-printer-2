/**
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, ipcMain } from 'electron';
import { onRawPrint } from './events/onRawPrint';
import { createTray } from './tray';
import { createMainWindow } from './window';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;

  console.log(msgTemplate(arg));

  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('rawPrint', onRawPrint);

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return;
  }

  app.quit();
});

app
  .whenReady()
  .then(() => {
    let created = false;

    createMainWindow(app).then(window => {
      created = true;
      createTray(app, window);
    });

    app.on('activate', () => {
      if (created) {
        return;
      }

      createMainWindow(app).then(window => {
        created = true;
        createTray(app, window);
      });
    });
  })
  .catch(console.log);

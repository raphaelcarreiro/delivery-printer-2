import { App, BrowserWindow, shell } from 'electron';
import { installExtensions } from './extensions';
import { getAssetPath } from './asset';
import path from 'path';
import { resolveHtmlPath } from './util';
import { isQuiting } from './tray';
import MenuBuilder from './menu';
import { updater } from './updater';

export async function createMainWindow(app: App) {
  await installExtensions();

  const mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath(app, 'icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('ready-to-show', () => {
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
      return;
    }

    mainWindow.show();
  });

  mainWindow.on('minimize', event => {
    event.preventDefault();
    // mainWindow.hide();
  });

  mainWindow.on('close', event => {
    if (isQuiting) {
      return;
    }

    event.preventDefault();

    mainWindow.hide();
  });

  new MenuBuilder(mainWindow).buildMenu();

  mainWindow.webContents.setWindowOpenHandler(edata => {
    shell.openExternal(edata.url);

    return {
      action: 'deny',
    };
  });

  updater();

  return mainWindow;
}

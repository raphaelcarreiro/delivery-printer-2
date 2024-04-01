import { Tray, App, BrowserWindow, Menu } from 'electron';
import { getAssetPath } from './asset';

export let isQuiting = false;

export function createTray(app: App, window: BrowserWindow) {
  const tray = new Tray(getAssetPath(app, 'icon.png'));

  tray.on('double-click', () => {
    window.show();
  });

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '    Abrir',
        click: () => {
          window.show();
        },
      },
      {
        label: '    Minimizar para a bandeja',
        click: () => {
          window.hide();
        },
      },
      {
        label: '    Fechar',
        click: () => {
          isQuiting = true;
          app.quit();
        },
      },
    ])
  );
}

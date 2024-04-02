import { Tray, App, BrowserWindow, Menu } from 'electron';
import { getAssetPath } from './asset';

export let isQuiting = false;

export function createTray(app: App, window: BrowserWindow) {
  const tray = new Tray(getAssetPath(app, 'icon.png'));

  tray.on('double-click', () => {
    window.show();
  });

  const menu = Menu.buildFromTemplate([
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
      type: 'separator',
    },
    {
      label: '    Fechar',
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('SGrande Delivery Printer');
  tray.setContextMenu(menu);
}

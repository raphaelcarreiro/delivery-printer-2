import { App, BrowserWindow, shell } from 'electron';
import { Extensions } from './extensions';
import { getAssetPath } from './asset';
import path from 'path';
import { resolveHtmlPath } from './util';
import { isQuiting } from './tray';
import MenuBuilder from './menu';
import { AppUpdater } from './updater';

export class MainWindowBuilder {
  private window: BrowserWindow;

  constructor(private readonly app: App) {
    this.window = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      icon: getAssetPath(app, 'icon.ico'),
      webPreferences: this.getWindowWebPreferences(),
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: 'white',
        symbolColor: '#222',
        height: 50,
      },
    });
  }

  async build(): Promise<BrowserWindow> {
    await this.extensions();

    this.load();
    this.settings();
    this.menu();
    this.events();
    this.updater();

    return this.window;
  }

  private async extensions() {
    const extentions = new Extensions();
    await extentions.install();
  }

  private load() {
    this.window.loadURL(resolveHtmlPath('index.html'));
  }

  private settings() {
    this.window.setMenuBarVisibility(false);

    this.window.webContents.setWindowOpenHandler(edata => {
      shell.openExternal(edata.url);

      return {
        action: 'deny',
      };
    });
  }

  private menu() {
    const menuBuilder = new MenuBuilder(this.window);
    menuBuilder.buildMenu();
  }

  private events() {
    this.window.on('ready-to-show', () => {
      if (process.env.START_MINIMIZED) {
        this.window.minimize();
        return;
      }

      this.window.show();
    });

    this.window.on('minimize', event => {
      event.preventDefault();
      // mainWindow.hide();
    });

    this.window.on('close', event => {
      if (isQuiting) {
        return;
      }

      event.preventDefault();

      this.window.hide();
    });
  }

  private updater() {
    const updater = new AppUpdater();
    updater.run();
  }

  private getWindowWebPreferences() {
    const filePath = this.app.isPackaged
      ? path.join(__dirname, 'preload.js')
      : path.join(__dirname, '../../.erb/dll/preload.js');

    return {
      preload: filePath,
    };
  }
}

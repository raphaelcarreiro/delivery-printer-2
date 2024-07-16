import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Notification } from 'electron';
import path from 'path';

export class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    this.events();
  }

  run() {
    autoUpdater.checkForUpdates().catch(() => {
      console.log('Erro ao verificar atualização');
    });
  }

  private notification() {
    new Notification({
      icon: path.join(process.resourcesPath, 'assets', 'icon.ico'),
      title: `Nova versão disponível`,
      body: 'Feche a aplicação e espere alguns segundos para aplicar a atualização',
    }).show();
  }

  private events() {
    autoUpdater.on('update-downloaded', () => {
      this.notification();
    });
  }
}

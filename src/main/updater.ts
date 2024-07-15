import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Notification } from 'electron';

export class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
  }

  notification(version: string) {
    new Notification({
      icon: './assets/icon.ico',
      title: `Versão ${version} disponível`,
      body: 'Feche a aplicação e espere alguns segundos para aplicar a atualização',
    }).show();
  }

  run() {
    autoUpdater
      .checkForUpdates()
      .then(response => {
        if (response?.updateInfo.version) {
          this.notification(response.updateInfo.version);
        }
      })
      .catch(() => {
        console.log('Erro ao verificar atualização');
      });
  }
}

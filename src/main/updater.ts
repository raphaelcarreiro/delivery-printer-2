import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export class AppUpdater {
  private BODY = 'Feche a aplicação e espere alguns segundos para aplicar a atualização';
  private TITLE = 'Nova versão disponível';

  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
  }

  run() {
    autoUpdater.checkForUpdatesAndNotify({
      body: this.BODY,
      title: this.TITLE,
    });
  }
}

import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export function updater() {
  log.transports.file.level = 'info';

  autoUpdater.logger = log;

  autoUpdater.checkForUpdatesAndNotify({
    body: 'Feche a aplicação e espere alguns segundos para aplicar a atualização',
    title: 'Nova versão disponível',
  });
}

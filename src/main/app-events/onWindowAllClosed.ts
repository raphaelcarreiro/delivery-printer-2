import { App } from 'electron';

export function onWindowAllClosed(app: App) {
  if (process.platform === 'darwin') {
    return;
  }

  app.quit();
}

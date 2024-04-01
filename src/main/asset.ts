import { App } from 'electron';
import path from 'path';

export function getAssetPath(app: App, ...paths: string[]) {
  const assetPath = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');

  return path.join(assetPath, ...paths);
}

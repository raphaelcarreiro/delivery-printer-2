import { BrowserWindow } from 'electron';

export function onSecondInstance(window: BrowserWindow) {
  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}

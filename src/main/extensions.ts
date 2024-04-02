import devtoolsInstaller, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import electronDebug from 'electron-debug';
import sourceMapSupport from 'source-map-support';

export async function installExtensions() {
  const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  if (isDebug) {
    devtoolsInstaller([REACT_DEVELOPER_TOOLS], {
      forceDownload: !!process.env.UPGRADE_EXTENSIONS,
    }).catch(console.log);
  }

  if (!isDebug) {
    sourceMapSupport.install();
  }

  if (isDebug) {
    electronDebug({
      devToolsMode: 'bottom',
      isEnabled: true,
      showDevTools: true,
    });
  }
}

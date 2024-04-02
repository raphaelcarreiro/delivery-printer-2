import devtoolsInstaller, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import electronDebug from 'electron-debug';
import sourceMapSupport from 'source-map-support';

export class Extensions {
  private isDebug: boolean;

  constructor() {
    this.isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
  }

  async install() {
    this.devTools();
    this.sourceMap();
  }

  private devTools() {
    if (this.isDebug) {
      devtoolsInstaller([REACT_DEVELOPER_TOOLS], {
        forceDownload: !!process.env.UPGRADE_EXTENSIONS,
      }).catch(console.log);
    }

    electronDebug({
      devToolsMode: 'bottom',
      isEnabled: true,
      showDevTools: false,
    });
  }

  private sourceMap() {
    if (!this.isDebug) {
      sourceMapSupport.install();
    }
  }
}

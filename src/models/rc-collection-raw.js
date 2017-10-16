import _uniq from 'lodash/uniq';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import findUp from 'find-up';
import fs from 'fs';
import path from 'path';

class RcCollectionRaw {
  constructor(opts = {}) {
    this.fileExists = this.fileExists.bind(this);
    this.env = opts.env || process.env;
    this.name = opts.name || 'blueprint';

    this.fs = opts.fs || fs;
    this.rc = opts.rc || this.env.BLUEPRINT_RC || `${this.name}rc`;
    this.cwd = opts.cwd || process.cwd();
    this.home =
      opts.home || this.env.HOME || this.env.HOMEPATH || this.env.USERPROFILE;
    this.path = opts.path || path;
    this.dotRc = opts.dotRc || `.${this.rc}`;
    this.findUp = opts.findUp || findUp;
    this.appData = opts.appData || this.env.APPDATA;
    this.cliFiles = opts.cliFiles || [];
    this.envFiles = opts.envFiles || this.env.BLUEPRINT_CONFIG || [];
    this.platform = opts.platform || process.platform;
    this.userFiles = opts.userFiles || [];
    this.systemFiles = opts.systemFiles || [];
    this.localAppData = opts.localAppData || this.env.LOCALAPPDATA;
    this.projectFiles = opts.projectFiles || [this.findUp(this.dotRc)];
    this.xdgConfigDirs =
      opts.xdgConfigDirs || (this.env.XDG_CONFIG_DIRS || '/etc/xdg').split(':');
    this.xdgConfigHome = opts.xdgConfigHome || this.env.XDG_CONFIG_HOME;
    this.handleOS();
  }

  rawPaths() {
    return _uniq([
      ...this.adjustedPaths(this.cliFiles),
      ...this.adjustedPaths(this.envFiles),
      ...this.projectFiles,
      ...this.userFiles,
      ...this.systemFiles
    ]);
  }

  files() {
    return _filter(this.rawPaths(), this.fileExists);
  }

  fileExists(file) {
    return this.fs.existsSync(file) && this.fs.statSync(file).isFile();
  }

  normalizePaths(orig) {
    if (Array.isArray(orig)) return orig;
    if (typeof orig === 'string') return orig.split(':');
    return [];
  }

  adjustedPaths(rawPaths) {
    const paths = this.normalizePaths(rawPaths);
    const pathEx = this.path;
    return _map(paths, p => {
      if (p[0] === '~') {
        return pathEx.resolve(this.home, p.slice(1));
      } else {
        return pathEx.resolve(this.cwd, p);
      }
    });
  }

  handleOS() {
    let userDir;
    switch (this.platform) {
    case 'freebsd': // pretty sure
    /* NEEDS TESTING */
    case 'sunos': // maybe?
    /* NEEDS TESTING */
    case 'linux': // for sure
      userDir = this.path.resolve(this.home, this.xdgConfigHome || '.config');
      this.userFiles = [
        this.path.resolve(this.home, this.dotRc),
        this.path.resolve(userDir, this.dotRc),
        this.path.resolve(userDir, this.rc),
        this.path.resolve(userDir, this.name, this.rc),
        this.path.resolve(userDir, this.name, 'config')
      ];
      this.systemFiles = _map(this.xdgConfigDirs, d =>
        this.path.resolve(d, this.rc)
      );
      break;
    // https://stackoverflow.com/questions/3373948/equivalents-of-xdg-config-home-and-xdg-data-home-on-mac-os-x
    case 'darwin':
      /* NEEDS TESTING */
      this.userFiles = [
        this.path.resolve(this.home, this.dotRc),
        this.path.resolve(
          this.home,
          'Library',
          'Preferences',
          this.name,
          this.dotRc
        ),
        this.path.resolve(
          this.home,
          'Library',
          'Preferences',
          this.name,
          this.rc
        ),
        this.path.resolve(
          this.home,
          'Library',
          'Preferences',
          this.name,
          'config'
        )
      ];
      this.systemFiles = [
        this.path.resolve('/Library', 'Preferences', this.name, this.rc),
        this.path.resolve('/Library', 'Preferences', this.name, 'config')
      ];
      break;
    case 'win32':
      /* NEEDS TESTING */
      userDir = this.path.resolve(this.appData);
      this.userFiles = [
        this.path.resolve(this.home, this.dotRc),
        this.path.resolve(this.localAppData, this.name, this.rc),
        this.path.resolve(this.localAppData, this.name, 'config'),
        this.path.resolve(this.appData, this.name, this.rc),
        this.path.resolve(this.appData, this.name, 'config')
      ];
      this.systemFiles = []; // i can't even
      break;
    default:
    // something serious unexpected happens, raise error or exit?
    }
  }
}

export default RcCollectionRaw;

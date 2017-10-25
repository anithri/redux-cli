import _ from 'lodash';
import fsEx from 'fs';
import process from 'process';
import pathEx from 'path';
import findUpEx from 'findUp';
import untildify from 'untildify';

class FileCollection {
  constructor({cliFile = false, name = 'blueprint'}) {
    this.cwd = process.cwd();
    this.name = name;

    this.rcFile = `${name}rc`.toLowerCase();
    this.dotRc = `.${this.rcFile}`;
    this.envName = `${name}_config`.toUpperCase();

    this.cliFile = cliFile;
    this.all = this.allFiles(this.cliFile);
    this.present = this.findTargetFiles(this.all);
  }

  allFiles(morePaths, {findUp = findUpEx, env = process.env, path = pathEx} = {}) {
    const potentials = [
      morePaths, // will include argv[--config]
      env[this.envName],
      this.dotRc,
      findUp(this.dotRc),
      this.byOS(process.platform)
    ];
    return _(potentials)
      .flatten()
      .compact()
      .map(f => path.resolve(this.cwd, untildify(f)))
      .uniq();
  }

  byOS(platform, {path = pathEx, home = os.homedir(), env = process.env} = {}) {
    let userDir;
    switch (platform) {
    case 'freebsd': // pretty sure
      /* NEEDS TESTING */
    case 'sunos': // maybe?
      /* NEEDS TESTING */
    case 'linux': // for sure
      userDir = path.resolve(home, env.XDG_CONFIG_HOME || '.config');
      return [
        path.resolve(home, this.dotRc),
        path.resolve(userDir, this.dotRc),
        path.resolve(userDir, this.rcFile),
        path.resolve(userDir, this.name, this.rcFile),
        path.resolve(userDir, this.name, 'config')
      ];
      // https://stackoverflow.com/questions/3373948/equivalents-of-xdg-config-home-and-xdg-data-home-on-mac-os-x
    case 'darwin':
      /* NEEDS TESTING */
      userDir = path.resolve(home, 'Library', 'Preferences', this.name);
      return [
        path.resolve(home, this.dotRc),
        path.resolve(userDir, this.dotRc),
        path.resolve(userDir, this.rcFile),
        path.resolve(userDir, 'config')
      ];
    case 'win32':
      /* NEEDS TESTING */
      const localApp = env.LOCALAPPDATA || 'LOCALAPPDATA';
      const app = env.APPDATA || 'APPDATA';
      return [
        path.resolve(home, this.dotRc),
        path.resolve(localApp, this.name, this.rcFile),
        path.resolve(localApp, this.name, 'config'),
        path.resolve(app, this.name, this.rcFile),
        path.resolve(app, this.name, 'config')
      ];
    default:
      return [];
      // something serious unexpected happens, raise error or exit?
    }
  }

  findTargetFiles(targets, {fs = fsEx} = {}) {
    return _(targets)
      .filter(file => fs.existsSync(file) && fs.statSync(file).isFile());
  }
}

export default FileCollection;

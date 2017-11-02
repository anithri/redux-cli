import _ from 'lodash';
import fsEx from 'fs';
import pathEx from 'path';
import pluralize from 'pluralize';

class DirCollection {
  constructor(rcFiles, rcDirs, { name = 'blueprints' } = {}) {
    this.name = name;
    this.bpDir = pluralize(name);
    this.dotBp = '.' + this.bpDir;
    this.rcFiles = rcFiles;
    this.defaults = this.fromRc(rcFiles);
    this.all = [...rcDirs, ...this.defaults];
    this.present = this.findPaths(this.all);
  }

  fromRc(files, { path = pathEx } = {}) {
    return _(files)
      .map(file => {
        const dir = path.dirname(file);
        return [path.resolve(dir, this.bpDir), path.resolve(dir, this.dotBp)];
      })
      .flatten()
      .value();
  }

  findPaths(targets, { fs = fsEx } = {}) {
    return _(targets).filter(
      dir => fs.existsSync(dir) && fs.statSync(dir).isDirectory()
    ).value();
  }
}

export default DirCollection;

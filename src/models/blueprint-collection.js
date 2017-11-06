import fs from 'fs';
import path from 'path';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import Blueprint from './blueprint';
import _flatten from 'lodash/flatten';

export default class BlueprintCollection {
  constructor(pathList, rc) {
    this.pathList = pathList;
    this.rc = rc;
    this.addBlueprint = this.addBlueprint.bind(this);
  }

  all() {
    // Is there a more idiomatic way to do this?  I miss ruby's ||=
    if (this.allBlueprints) {
      return this.allBlueprints;
    } else {
      return (this.allBlueprints = this.discoverBlueprints(this.pathList));
    }
  }

  allNames() {
    return _map(this.all(), bp => bp.name);
  }

  lookupAll(name) {
    return _filter(this.all(), bp => bp.name === name);
  }

  lookup(name) {
    return this.lookupAll(name)[0];
  }

  /* istanbul ignore next */
  addBlueprint(path) {
    return Blueprint.load(path, this.rc);
  }

  /* istanbul ignore next */
  discoverBlueprints(paths) {
    return _map(this.findBlueprints(paths), this.addBlueprint);
  }

  /* istanbul ignore next */
  findBlueprints(bpPaths) {
    return _flatten(
      _map(bpPaths, dir => {
        const subdirs = _map(fs.readdirSync(dir), p => path.resolve(dir, p));
        return _filter(subdirs, d =>
          fs.existsSync(path.resolve(d, 'index.js'))
        );
      })
    );
  }
}

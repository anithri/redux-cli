import path from 'path';
import fs from 'fs';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _isNil from 'lodash/isNil';
import _isBool from 'lodash/isBoolean';
import _isString from 'lodash/isString';
import _isArray from 'lodash/isArray';
import _flatten from 'lodash/flatten';
import _uniq from 'lodash/uniq';
import Blueprint from './blueprint';

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

  generators() {
    // until we learn to tell generators apart from partials
    return _filter(this.all(), bp => bp.name);
  }

  allNames() {
    return _map(this.all(), bp => bp.name);
  }

  addBlueprint(path) {
    return Blueprint.load(path, this.rc);
  }

  discoverBlueprints(paths) {
    return _map(this.findBlueprints(paths), this.addBlueprint);
  }

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

  lookupAll(name) {
    return _filter(this.all(), bp => bp.name === name);
  }

  lookup(name) {
    return this.lookupAll(name)[0];
  }
}

import fsEx from 'fs';
import pathEx from 'path';
import _reduce from 'lodash/reduce';
import _toPairs from 'lodash/toPairs';
import stripJsonComments from 'strip-json-comments';
import mergeData from '../util/mergers';
import untildify from 'untildify';

// const rcRaw = new RcRaw({rcFiles: rcFiles.present, args, defaults});
class RcRaw {
  constructor({rcFiles = [], args = {}, defaults = {}} = {}) {
    this.rcFiles = rcFiles;
    this.args = args;
    this.defaults = defaults;
    this.collection = {};
  }

  data() {
    if (this.assembledData) return this.assembledData;
    return (this.assembledData = this.assembleAll(this.rcFiles));
  }

  assembleAll(rcFiles = this.rcFiles, {fs = fsEx} = {}) {
    const collected = [
      this.args,
      ...(this.collectAll(rcFiles, {fs})),
      this.defaults
    ].reverse(); // merge expects lowest priority first

    const assembled = mergeData(collected);
    assembled.assembly = {rcFiles};

    return assembled;
  }

  collectAll(files, {fs = fsEx} = {}) {
    return _reduce(
      files,
      (all, file) => {
        return [...all, this.collectFile(file, {fs})];
      },
      {}
    );
  }

  adjustPaths(obj, file, {path = pathEx} = {}) {
    if (!obj.paths) return obj;
    const basePath = path.dirname(file);
    const pathsObj = obj.paths || {};
    const paths = _reduce(
      _toPairs(pathsObj),
      (all, [key, keyPath]) => {
        all[key] = path.resolve(basePath, untildify(keyPath));
        return all;
      },
      {}
    );
    return {...obj, paths};
  }

  collectFile(file, {fs = fsEx} = {}) {
    try {
      const contents = fs.readFileSync(file);
      const obj = JSON.parse(stripJsonComments(contents.toString()));
      const adjusted = this.adjustPaths(obj, file);
      this.collection[file] = obj;
      return adjusted;
    } catch (err) {
      // do something here I'm too lazy atm to figure out
      // where should a file read or json parse error be handled?
      // How do we present error to user
      // continue processing? cli option to (en|dis)able?
      // log/trace/debug?
      // and *ugh* testing
      const errData = {message: err.message, name: err.name};
      return {error: errData, stack: err.stack};
    }
  }
}

export default RcRaw;

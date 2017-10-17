import fs from 'fs';
import _reduceRight from 'lodash/reduceRight';
import _reduce from 'lodash/reduce';
import stripJsonComments from 'strip-json-comments';
import rcCollectionRaw from './rc-collection-raw';
import mergeData from 'util/mergers';

class RcCollection {
  constructor(args = {}) {
    this.fs = args.fs || fs;
    this.mergeData = args.mergeData || mergeData;
    this.collector = args.collector || this.collectAll;
    this.rawCollection = args.rawCollection || new rcCollectionRaw(args);
    this.files = args.files || this.rawCollection.files();
    this.defaults = args.defaults || {};
    this.rcFiles = [];
    this.collection = args.collection || this.collector(this.files);
    this.assembler = args.assembler || this.assembleAll;
  }

  data(defaults = {}) {
    if (this.assembledData) return this.assembledData;
    return (this.assembledData = this.assembler(
      this.files,
      this.collection,
      defaults
    ));
  }

  assembleAll(order, collected, defaults) {
    const assembled = _reduceRight(
      order,
      (all, name) => mergeData(all, collected[name]),
      defaults
    );
    assembled.assembly = {
      configFiles: order
    };

    return assembled;
  }

  collectAll(files) {
    // take rawCollections.paths and for each one
    //   1. attempt to read as commented json.
    //   2. store result in collection keyed by the path
    return _reduce(
      files,
      (all, file) => {
        all[file] = this.collectFile(file);
        return all;
      },
      {}
    );
  }

  collectFile(file) {
    try {
      const contents = this.fs.readFileSync(file);
      const obj = JSON.parse(stripJsonComments(contents.toString()));
      this.rcFiles.push(file);
      return obj;
    } catch (err) {
      // do something here I'm too lazy atm to figure out
      // where should a file read or json parse error be handled?
      // How do we present error to user
      // continue processing? cli option to (en|dis)able?
      // log/trace/debug?
      // and *ugh* testing
      const errData = { message: err.message, name: err.name };
      return { error: errData, stack: err.stack };
    }
  }
}

export default RcCollection;

import fs from 'fs';
import _reduce from 'lodash/reduce';
import stripJsonComments from 'strip-json-comments';
import rcCollectionRaw from './rc-collection-raw';

class RcCollection {
  constructor(args = {}) {
    this.fs = args.fs || fs;
    this.collector = args.collector || this.collect;
    this.rawCollection = new rcCollectionRaw(args);
    this.files = args.files || this.rawCollection.files();
    this.collection = this.collector(this.files);
  }

  collect(files) {
    // take rawCollections.paths and for each one
    //   1. attempt to read as commented json.
    //   2. store result in collection keyed by the path
    return _reduce(files, (all, file) => {
      all[file] = this.collectFile(file);
      all[file] = data;
      return all;
    }, {});
  }

  collectFile(file) {
    let contents, errData;
    try {
      contents = this.fs.readFileSync(file);
      return JSON.parse(stripJsonComments(contents.toString()));
    } catch (err) {
      // do something here I'm too lazy atm to figure out
      // where should a file read or json parse error be handled?
      // How do we present error to user
      // continue processing? cli option to (en|dis)able?
      // log/trace/debug?
      // and *ugh* testing
      errData = {message: err.message, name: err.name};
      return {error: errData};
    }
  }
}

export default RcCollection;
import _flatten from 'lodash/flatten';
import _map from 'lodash/map';
import { resolvePath, baseName } from '../util/mergers';
import pathEx from 'path';
import _isNil from 'lodash/isNil';
import _isArray from 'lodash/isArray';
import _isBool from 'lodash/isBoolean';
import _isString from 'lodash/isString';

class BlueprintCollectionRaw {
  constructor({fixedPaths, configPaths}) {
    this.fixedPaths = this.fromPaths(fixedPaths);
    this.configPaths = this.fromConfig(configPaths);
    this.rawPaths = [...this.fixedPaths, ...this.configPaths];
  }

  fromConfig(files) {
    return _flatten(
      _map(
        files,
        file => (
          [
            pathEx.resolve(pathEx.dirname(file), 'blueprints'),
            pathEx.resolve(pathEx.dirname(file), '.blueprints')
          ]
        )
      )
    );
  }

  fromPaths(paths) {
    return _flatten(
      _map(
        paths,
        path => this.processPath()
      )
    );
  }

  processPath(path) {

    if (_isArray(setting)) {
      return [...setting, './blueprints'];
    } else if (_isString(setting)) {
      return [setting, './blueprints'];
    } else if (_isBool(setting)) {
      return setting ? ['./blueprints'] : [];
    } else if (_isNil(setting)) {
      return ['./blueprints'];
    } else {
      // No numbers,
      // raise error here?
      // console.error('Unknown blueprint type');
      return ['./blueprints'];
    }










    return path;
  }

}

export default BlueprintCollectionRaw;
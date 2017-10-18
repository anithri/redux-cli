import _flatten from 'lodash/flatten';
import _get from 'lodash/get';
import mergeData from '../util/mergers';

const COMMON = 'common';

class RcData {
  constructor(data, merger = mergeData) {
    this.data = data;
    this.merger = merger;
  }

  withDefaults(defaults) {
    return this.with({ defaults });
  }

  withPriority(priority) {
    return this.with({ priority });
  }

  with({ priority = {}, data = this.data, common = {}, defaults = {} }) {
    return new RcData(
      this.merger([defaults, common, data, priority]),
      this.merger
    );
  }

  withBp(name, { defaults = {}, priority = {}, common = this.atCommon() }) {
    return this.with({
      data: this.atBp(name),
      common,
      defaults,
      priority
    });
  }

  for(path, defaultVal) {
    return _get(this.data, path, defaultVal);
  }

  forBp(name, key, defaultVal) {
    return this.for(
      `bp.${name}.${key}`,
      this.for(`bp.common.${key}`, defaultVal)
    );
  }

  atBp(name) {
    return this.for(`bp.${name}`) || {};
  }
  atCommon() {
    return this.atBp(COMMON);
  }
}

export default RcData;

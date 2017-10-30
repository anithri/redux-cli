import _get from 'lodash/get';
import mergeData from '../util/mergers';

const COMMON = 'common';

class RcData {
  constructor(data) {
    this.data = data;
  }

  withDefaults(defaults) {
    return this.with({ defaults });
  }

  withPriority(priority) {
    return this.with({ priority });
  }

  with({ priority = {}, data = this.data, common = {}, defaults = {} }) {
    return new RcData(mergeData([defaults, common, data, priority]));
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

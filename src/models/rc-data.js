import _get from 'lodash/get';
import mergeData from 'util/mergers';

class RcData {
  constructor(data, merger = mergeData) {
    this.data = data;
    this.merger = merger;
  }

  withDefaults(defaults) {
    return new RcData(this.merger(defaults, this.data), this.merger);
  }

  withPriority(priority) {
    return new RcData(this.merger(this.data, priority), this.merger);
  }

  withBp(name, defaults = {}) {
    return new RcData(this.forBp(name, defaults), this.merger);
  }

  for(path, defaultVal) {
    return _get(this.data, path, defaultVal);
  }

  forBp(name, defaults = {}) {
    const bp = this.for(`bp.${name}`, {});
    return this.merger(defaults, bp);
  }
}

export default RcData;

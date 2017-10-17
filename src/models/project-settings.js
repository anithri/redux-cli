import _get from 'lodash/get';

class ProjectSettings {
  // public & tested - maintain in 2.0
  constructor(collection, rc, bp, ui) {
    this.collection = collection;
    this.rc = rc;
    this.bp = bp;
    this.ui = ui;
  }

  get blueprints() { return this.bp; }

  all(defaults = {}) {
    return this.rc.with(defaults);
  }

  //public & tested - maintain in 2.0
  getSetting(key, defaultVal) {
    return _get(this.settings, key, defaultVal);
  }
}

export default ProjectSettings;

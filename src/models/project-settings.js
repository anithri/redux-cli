import _get from 'lodash/get';

class ProjectSettings {
  // public & tested - maintain in 2.0
  constructor(rcCollection, rc, bp, ui) {
    this.rcCollection = rcCollection;
    this.rc = rc;
    this.bp = bp;
    this.ui = ui;
  }

  all(defaults = {}) {
    return this.rc.with(defaults);
  }

  //public & tested - maintain in 2.0
  getSetting(key, defaultVal) {
    return _get(this.settings, key, defaultVal);
  }
}

export default ProjectSettings;

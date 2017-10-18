import ProjectSettings from '../models/project-settings';
import UI from '../models/ui';
import RcCollection from '../models/rc-collection';
import RcData from '../models/rc-data';
import BlueprintCollection from '../models/blueprint-collection';

function makeGetEnvironment() {
  let environment;

  return function() {
    if (!environment) {
      const collection = new RcCollection();
      const rc = new RcData(collection.data());
      const blueprints = new BlueprintCollection(
        rc.for('blueprintPaths'),
        rc.for('blueprints')
      );
      const ui = new UI();
      const settings = new ProjectSettings(collection, rc, blueprints, ui);

      environment = { settings, ui };
    }
    return environment;
  };
}

export default makeGetEnvironment();

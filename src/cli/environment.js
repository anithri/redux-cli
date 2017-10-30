import ProjectSettings from 'models/project-settings';
import FileCollection from 'models/file-collection';
import RcRaw from 'models/rc-raw';
import RcData from 'models/rc-data';
import UI from 'models/ui';

function fetchDefaults() {
  return {};
}

function makeGetEnvironment() {
  let environment;

  return function() {
    if (!environment) {
      environment = {
        ui: new UI(),
        settings: new ProjectSettings()
      };
    }
    return environment;
  };
}

export function getEnvironment(args = {}) {
  const name = args.rcName || 'blueprint'; // or whatever
  const configFiles = args.config; // or whatever
  const defaults = fetchDefaults(); // or whatever
  const rcFiles = new FileCollection(configFiles, { name });
  const rcRaw = new RcRaw({ rcFiles: rcFiles.present, args, defaults });
  const rc = new RcData(rcRaw.data);
  // const bpDirs = new DirCollection(rcFiles, rc.blueprintPaths, {name});
  // const blueprints = new BlueprintCollection(bpDirs.present, rc);
  const ui = new UI();
  const environment = {
    rcFiles,
    rcRaw,
    rc,
    // bpDirs,
    // blueprints,
    ui
  };
  return environment;
}

export default makeGetEnvironment();

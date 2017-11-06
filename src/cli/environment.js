import BlueprintCollection from '../models/blueprint-collection';
import FileCollection from '../models/file-collection';
import DirCollection from '../models/dir-collection';
import RcData from '../models/rc-data';
import RcRaw from '../models/rc-raw';
import UI from '../models/ui';


function fetchDefaults() {
  return {};
}

function getEnvironment(args = {}) {
  const name = args.rcName || 'blueprint'; // or whatever
  const configFiles = args.config; // or whatever
  const defaults = fetchDefaults(); // or whatever
  const rcFiles = new FileCollection(configFiles, { name });
  const rcRaw = new RcRaw({ rcFiles: rcFiles.present, args, defaults });
  const rc = new RcData(rcRaw.data());
  const bpPaths = new DirCollection(
    rcFiles.present,
    rc.for('blueprintPaths', []),
    { name }
  );
  const blueprints = new BlueprintCollection(bpPaths.present, rc);
  const ui = new UI();
  const environment = {
    rcFiles,
    rcRaw,
    rc,
    bpPaths,
    blueprints,
    ui
  };
  return environment;
}

export default getEnvironment;

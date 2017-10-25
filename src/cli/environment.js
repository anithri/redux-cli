import ProjectSettings from '../models/project-settings';
import UI from '../models/ui';

function makeGetEnvironment() {
  let environment;

  return function() {
    if (!environment) {
      // const configCli  = argv.getOption('config');
      // const defaults   = fetchDefaults();
      // const rcFiles    = new FileCollection(configCli);
      // const rcRaw      = new RcRaw(rcFiles.present, defaults);
      // const rc         = new RcData(rcRaw);
      // const bpDirs     = new DirCollection(rcFiles, rc.blueprintPaths)
      // const blueprints = new BlueprintCollection(bpDirs.present, rc);
      // const ui         = new UI();
      // environment = {
      //   rcFiles,
      //   rcRaw,
      //   rc,
      //   bpDirs,
      //   blueprints,
      //   ui
      // };


      environment = {
        ui: new UI(),
        settings: new ProjectSettings()
      };
    }
    return environment;
  };
}

export default makeGetEnvironment();

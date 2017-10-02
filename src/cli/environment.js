import ProjectSettings from '../models/project-settings';
import UI from '../models/ui';

let environment;

export default function getEnvironment() {
  if (!environment) {
    environment = {
      ui: new UI(),
      settings: new ProjectSettings()
    };
  }
  return environment;
}

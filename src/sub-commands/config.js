import prettyjson from 'prettyjson';
import SubCommand from '../models/sub-command';

class Config extends SubCommand {
  constructor(options) {
    super(options);
  }

  printUserHelp() {
    this.ui.write('config command to display current configuration');
  }

  dontSkip(type) {
    return !this.settings.settings[`skip-${type}`];
  }

  run() {
    console.log(this.settings)
    const finalConfig = Object.assign({}, this.settings.settings);
    delete finalConfig.configs;
    delete finalConfig.allConfigs;
    delete finalConfig['_'];
    if (this.dontSkip('logo')) {
      this.ui.write(this.cliLogo() + '\n');
    }
    if (this.dontSkip('config-files')) {
      this.ui.writeInfo('Config Files');
      this.ui.writeLine(
        prettyjson.render(this.settings.settings.configs, {}, 8)
      );
    }

    if (this.dontSkip('config-data')) {
      this.ui.writeInfo('Config Data');
      this.ui.writeLine(prettyjson.render(finalConfig, {}, 10));
    }

    if (this.dontSkip('blueprint-paths')) {
      this.ui.writeInfo('Blueprint Paths');
      this.ui.writeLine(
        prettyjson.render(this.settings.blueprints.searchPaths, {}, 8)
      );
    }

    if (this.dontSkip('blueprints')) {
      this.ui.writeInfo('Blueprints');
      this.ui.writeLine(
        prettyjson.render(this.settings.blueprints.allNames(), {}, 8)
      );
    }
  }
}

export default Config;

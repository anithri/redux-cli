import prettyjson from 'prettyjson';
import SubCommand from '../models/sub-command';

class Config extends SubCommand {
  constructor(options) {
    super(options);
  }
  printUserHelp() {
    this.ui.write('config command to display current configuration');
  }

  run() {
    const settings = this.settings;
    const finalConfig = Object.assign({}, settings.rc.data);

    this.ui.write(this.cliLogo() + '\n');
    this.ui.writeInfo('Config Files');
    console.log(prettyjson.render(settings.collection.rcFiles, {}, 8));
    // this.settings.settings.configs.forEach(configFile => {this.ui.writeInfo(`  * ${configFile}`)})
    this.ui.writeInfo('Config Data');
    console.log(prettyjson.render(finalConfig, {}, 10));
    this.ui.writeInfo('Blueprint Paths');
    console.log(prettyjson.render(settings.blueprints.searchPaths, {}, 8));
    this.ui.writeInfo('Blueprints');
    console.log(prettyjson.render(settings.blueprints.allNames(), {}, 8));
  }
}

export default Config;

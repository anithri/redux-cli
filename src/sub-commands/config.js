import prettyjson from 'prettyjson';
import SubCommand from '../models/sub-command';

class Config extends SubCommand {
  constructor(options) {
    super(options);
    this.options = options;
  }

  printUserHelp() {
    this.ui.write('config command to display current configuration');
  }

  run() {
    const { rcFiles, rc, bpPaths, blueprints } = this.options;
    this.ui.write(this.cliLogo() + '\n');
    this.ui.writeInfo('Rc Files');
    console.log(prettyjson.render(rcFiles.present, {}, 8));
    // this.settings.settings.configs.forEach(configFile => {this.ui.writeInfo(`  * ${configFile}`)})
    this.ui.writeInfo('Rc Data');
    console.log(prettyjson.render(rc.data, {}, 10));
    this.ui.writeInfo('Blueprint Paths');
    console.log(prettyjson.render(bpPaths.present, {}, 8));
    this.ui.writeInfo('Blueprints');
    console.log(prettyjson.render(blueprints.allNames(), {}, 8));
  }
}

export default Config;

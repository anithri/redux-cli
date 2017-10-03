import Config from '../../sub-commands/config';
import path from 'path';

const subCommand = new Config();

const usage = `Usage:\n  $0 config`;

module.exports = {
  command: 'config',
  describe: 'Display current configuration',
  builder: yargs => defineBuilder(yargs).usage(usage),
  handler: () => subCommand.run()
};

const defineBuilder = yargs => {
  return yargs.options({
    'skip-logo': {
      alias: 'L',
      describe: "Don' show logo",
      type: 'boolean'
    },

    'skip-blueprints': {
      alias: 'B',
      describe: "Don't show blueprints",
      type: 'boolean'
    },
    'skip-blueprint-paths': {
      alias: 'P',
      describe: "Don't show blueprint paths",
      type: 'boolean'
    },
    'skip-config-data': {
      alias: 'D',
      describe: "Don't show config data",
      type: 'boolean'
    },

    'skip-config-files': {
      alias: 'F',
      describe: "Don't show config files",
      type: 'boolean'
    }
  });
};

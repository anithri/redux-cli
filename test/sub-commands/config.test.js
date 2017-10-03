import Config from 'sub-commands/config';
import MockUI from '../helpers/mock-ui';

// a piece of the logo to match against.
const LOGO_MATCH = /______ _/;
const CONFIG_FILES_MATCH = /Config Files/;
const CONFIG_DATA_MATCH = /Config Data/;
const BLUEPRINT_PATHS_MATCH = /Blueprint Paths/;
const BLUEPRINTS_MATCH = /Blueprints/;

describe('(Sub-Command) Config', () => {
  let config;
  const ui = new MockUI('DEBUG');

  beforeEach(() => {
    ui.clear();
    config = new Config();
    config.ui = ui;
  });

  test('#printUserHelp()', () => {
    config.printUserHelp();
    expect(ui.output).toMatch(/config command/);
  });

  test('#dontSkip(type)', () => {
    setSkipFlag('test-A', true);
    setSkipFlag('test-B', false);
    // test-C deliberately left unset
    expect(config.dontSkip('test-A')).to.be.falsy;
    expect(config.dontSkip('test-B')).to.be.truthy;
    expect(config.dontSkip('test-C')).to.be.truthy;
  });

  describe('#run()', () => {
    test('prints everything when nothing skipped', () => {
      config.run();
      expect(ui.output).toMatch(LOGO_MATCH); // a piece of the logo
      expect(ui.output).toMatch(CONFIG_FILES_MATCH);
      expect(ui.output).toMatch(CONFIG_DATA_MATCH);
      expect(ui.output).toMatch(BLUEPRINT_PATHS_MATCH);
      expect(ui.output).toMatch(BLUEPRINTS_MATCH);
    });

    test('Skips Logo with --skip-logo', () => {
      setSkipFlag('logo', true);
      config.run();
      expect(ui.output).not.toMatch(LOGO_MATCH);
    });

    test('Skips Logo with --skip-config-files', () => {
      setSkipFlag('config-files', true);
      config.run();
      expect(ui.output).not.toMatch(CONFIG_FILES_MATCH);
    });
    test('Skips Logo with --skip-config-data', () => {
      setSkipFlag('config-data', true);
      config.run();
      expect(ui.output).not.toMatch(CONFIG_DATA_MATCH);
    });
    test('Skips Logo with --skip-blueprint-paths', () => {
      setSkipFlag('blueprint-paths', true);
      config.run();
      expect(ui.output).not.toMatch(BLUEPRINT_PATHS_MATCH);
    });
    test('Skips Logo with --skip-blueprints', () => {
      setSkipFlag('blueprints', true);
      config.run();
      expect(ui.output).not.toMatch(BLUEPRINTS_MATCH);
    });
  });

  const setSkipFlag = (name, val = true) => {
    config.settings.settings[`skip-${name}`] = val;
  };

  test('setSkipFlag', () => {
    expect(config.settings.settings['skip-test']).to.be.falsy;
    setSkipFlag('Test');
    expect(config.settings.settings['skip-test']).to.be.truthy;
  });
});

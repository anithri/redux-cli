import { getParser } from 'cli/parser';
import { lineRegEx } from '../../helpers/regex-utils';
import Config from 'sub-commands/config';

jest.mock('sub-commands/config');

describe('(CLI) Config', () => {
  let parser;

  beforeEach(() => {
    parser = getParser();
    parser.$0 = 'bp';
  });

  describe('--help', () => {
    test('shows Usage', done => {
      parser.$0 = 'bp';
      parser.parse('help config', (err, argv, output) => {
        expect(err).to.be.undefined;
        expect(output).to.include('Usage:');
        expect(output).to.match(lineRegEx('bp config'));
        expect(output).to.include('--skip-logo');
        expect(output).to.include('--skip-config-files');
        expect(output).to.include('--skip-config-data');
        expect(output).to.include('--skip-blueprint-paths');
        expect(output).to.include('--skip-blueprints');
        done();
      });
    });

    test("doesn't include --version", done => {
      parser.parse('help init', (err, argv, output) => {
        expect(output).to.not.include('--version, -V');
        done();
      });
    });
  });

  describe('handler', () => {
    test('runs subCommand without arguments', done => {
      parser.parse('config', (err, argv, output) => {
        expect(Config.mock.instances.length).toEqual(1);
        expect(Config.mock.instances[0].run.mock.calls.length).toEqual(1);
        expect(Config.mock.instances[0].run.mock.calls[0]).toEqual([]);
        expect(output).toEqual('');
        done();
      });
    });
  });
});

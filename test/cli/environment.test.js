import { getEnvironment } from 'cli/environment';
import UI from 'models/ui';
import FileCollection from 'models/file-collection';
import RcRaw from 'models/rc-raw';
import RcData from 'models/rc-data';

jest.mock('models/ui');
jest.mock('models/project-settings');

describe('(CLI) Environment', () => {
  describe('#getEnvironment', () => {
    it('returns { rc, rcFiles, rcRaw, ui }', () => {
      const env = getEnvironment({});
      expect(Object.keys(env).sort()).toEqual(['rc', 'rcFiles', 'rcRaw', 'ui']);
    });
    it('returns several properties', () => {
      const env = getEnvironment();
      expect(env.ui).toBeInstanceOf(UI);
      expect(env.rcFiles).toBeInstanceOf(FileCollection);
      expect(env.rcRaw).toBeInstanceOf(RcRaw);
      expect(env.rc).toBeInstanceOf(RcData);
    });
  });
});

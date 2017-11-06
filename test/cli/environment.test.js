import getEnvironment from 'cli/environment';
import UI from 'models/ui';
import FileCollection from 'models/file-collection';
import RcRaw from 'models/rc-raw';
import RcData from 'models/rc-data';
import DirCollection from '../../src/models/dir-collection';
import BlueprintCollection from '../../src/models/blueprint-collection';

jest.mock('models/ui');

describe('(CLI) Environment', () => {
  describe('#getEnvironment(args = {})', () => {
    it('returns several properties', () => {
      const env = getEnvironment();
      expect(env.ui).toBeInstanceOf(UI);
      expect(env.rcFiles).toBeInstanceOf(FileCollection);
      expect(env.rcRaw).toBeInstanceOf(RcRaw);
      expect(env.rc).toBeInstanceOf(RcData);
      expect(env.bpPaths).toBeInstanceOf(DirCollection);
      expect(env.blueprints).toBeInstanceOf(BlueprintCollection);
    });
  });
});

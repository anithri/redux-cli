import { getEnvironment } from 'cli/environment';
import UI from 'models/ui';
import FileCollection from 'models/file-collection';

jest.mock('models/ui');
jest.mock('models/project-settings');

describe('(CLI) Environment', () => {
  describe('#getEnvironment', () => {
    it('returns { ui, settings }', () => {
      const env = getEnvironment({});
      expect(Object.keys(env).sort()).toEqual(['rcFiles', 'ui']);
    });
    it('returns { ui: UI, rcFiles: FileCollection }', () => {
      const env = getEnvironment();
      expect(env.ui).toBeInstanceOf(UI);
      expect(env.rcFiles).toBeInstanceOf(FileCollection);
    });
  });
});

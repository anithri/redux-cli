import getEnvironment from 'cli/environment';
import UI from 'models/ui';
import ProjectSettings from 'models/project-settings';

jest.mock('models/ui');
jest.mock('models/project-settings');

describe('(CLI) Environment', () => {
  describe('#getEnvironment', () => {
    it('returns instance of ProjectSettings', () => {
      const env = getEnvironment();
      expect(env).to.be.an.instanceOf(ProjectSettings);
    });
    it('returns a singleton', () => {
      const env1 = getEnvironment();
      const env2 = getEnvironment();
      expect(env2).toBe(env1);
    });
  });
});

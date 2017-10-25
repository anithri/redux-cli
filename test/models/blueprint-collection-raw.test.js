import path from 'path';
import BlueprintCollectionRaw from  'models/blueprint-collection-raw';

describe('(Model) BlueprintCollectionRaw', () => {
  describe('#fromConfigs(files)', () => {
    test('it returns a blueprint and .blueprint subdir per path', () => {
      const testPaths = ['/Batman/.blueprintrc','/Robin/.blueprintrc'];
      const testRaw = new BlueprintCollectionRaw([],testPaths);
      const expected = [
        '/Batman/blueprints','/Batman/.blueprints',
        '/Robin/blueprints','/Robin/.blueprints'
      ];
      expect(testRaw.fromConfig(testPaths)).toEqual(expected);
    });
  });

  describe('fromPaths(paths)', () => {
    test('it returns processed paths', () => {

    });
  });
});
2
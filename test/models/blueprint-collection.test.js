import path from 'path';
import BlueprintCollection, {
  expandPath,
  parseBlueprintSetting
} from 'models/blueprint-collection';
import Blueprint from 'models/blueprint';

const fakeRc = { withBp: () => ({}) };

const bpPath = path.resolve(__dirname, '..', 'fixtures', 'blueprints');

// should change these to use something in fixtures
describe('(Model) BlueprintCollection', () => {
  describe('#all()', () => {
    it('should return an array of all blueprints in searchPaths', () => {
      const blueprints = new BlueprintCollection([bpPath], fakeRc);
      const result = blueprints.all();

      expect(result).to.be.an('Array');
      expect(result).toHaveLength(2);
    });
  });

  describe('#lookupAll(name)', () => {
    test('returns empty array if blueprint for name', () => {
      const blueprints = new BlueprintCollection([bpPath], fakeRc);
      const result = blueprints.lookupAll('JusticeLeague');

      expect(result).to.be.an('Array');
      expect(result).toHaveLength(0);
    });
    test('returns an array of blueprints matching name', () => {
      const blueprints = new BlueprintCollection([bpPath], fakeRc);
      const result = blueprints.lookupAll('basic');

      expect(result).to.be.an('Array');
      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual('basic');
    });
  });

  describe('#lookup(name)', () => {
    test('returns falsy if no blueprint for name', () => {
      const blueprints = new BlueprintCollection([bpPath], fakeRc);
      const result = blueprints.lookup('flyingGraysons');

      expect(result).toBeFalsy();
    });

    test('returns a blueprint matching name', () => {
      const blueprints = new BlueprintCollection([bpPath], fakeRc);

      const result = blueprints.lookup('basic');
      expect(result).toBeInstanceOf(Blueprint);

      expect(result.name).toEqual('basic');
    });
  });
});

import DirCollection from 'models/dir-collection';

const cwd = process.cwd();

const fakeFs = {
  existsSync: () => true,
  statSync: dir => {
    if (dir.includes('.')) {
      return { isDirectory: () => false };
    } else {
      return { isDirectory: () => true };
    }
  }
};

describe('(Models) DirCollection', () => {
  describe('new FileCollection(cliFiles, {name})', () => {
    test('it sets files and name', () => {
      const testCollection = new DirCollection([], [], { name: 'Wally' });

      expect(testCollection).toHaveProperty('name', 'Wally');
      expect(testCollection).toHaveProperty('bpDir', 'Wallies');
      expect(testCollection).toHaveProperty('dotBp', '.Wallies');
      expect(testCollection).toHaveProperty('rcFiles', []);
      expect(testCollection).toHaveProperty('rcDirs', []);
      expect(testCollection).toHaveProperty('defaults', []);
      expect(testCollection).toHaveProperty('all', []);
      expect(testCollection).toHaveProperty('present', []);
    });
  });

  describe('#fromRc(files, {path = pathEx})', () => {
    test('It converts blueprintrc file paths into blueprint paths', () => {
      const currentRc = cwd + '/.Dianarc';
      const currentBpDir = cwd + '/Dianas';
      const currentDotBpDir = cwd + '/.Dianas';

      const testCollection = new DirCollection([], [], { name: 'Diana' });

      const result = testCollection.fromRc([currentRc]);

      expect(result).toEqual([currentBpDir, currentDotBpDir]);
    });
  });

  describe('#findPath(targets, {fs= fsEx})', () => {
    test('It converts blueprintrc file paths into blueprint paths', () => {
      const currentRc = cwd + '/.Victorrc';
      const currentBpDir = cwd + '/Victors';
      const currentDotBpDir = cwd + '/.Victors';

      const testCollection = new DirCollection([], [], { name: 'Victor' });

      const result = testCollection.findPaths([currentBpDir, currentDotBpDir], {
        fs: fakeFs
      });

      expect(result).toEqual([currentBpDir]);
    });
  });
});

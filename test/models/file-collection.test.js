import FileCollection from 'models/file-collection';
const cwd = process.cwd();
const fakePath = {
  resolve() {
    return [...arguments].join('/');
  }
};
const fakeFindUp = path => `findUp/${path}`;

describe('(Models) FileCollection', () => {
  describe('new FileCollection(cliFiles, {name})', () => {
    test('it sets files and name', () => {
      const testCollection = new FileCollection('Flash', {name: 'Wally'});
      expect(testCollection).to.have.property('cliFiles', 'Flash');
      expect(testCollection).to.have.property('name', 'Wally');
      expect(testCollection).to.have.property('rcFile', 'wallyrc');
      expect(testCollection).to.have.property('dotRc', '.wallyrc');
    });
  });
  describe('#byOs(platform, {path, home, env})', () => {
    test('returns an empty array if platform not found', () => {
      const testPlatform = 'FakeOs';
      const testCollection = new FileCollection([]);
      const result = testCollection.byOS(testPlatform);
      expect(result).toEqual([]);
    });
    test('returns an array of paths when platform is linux', () => {
      const testPlatform = 'linux';
      const env = {};
      const testCollection = new FileCollection([]);
      const result = testCollection.byOS(testPlatform, {env, home: '/a/home'});
      const expected = [
        '/a/home/.blueprintrc',
        '/a/home/.config/.blueprintrc',
        '/a/home/.config/blueprintrc',
        '/a/home/.config/blueprint/blueprintrc',
        '/a/home/.config/blueprint/config'
      ];
      expect(result).toEqual(expected);
    });

    test('returns an array of paths when platform is darwin', () => {
      const testPlatform = 'darwin';
      const env = {};
      const testCollection = new FileCollection([]);
      const result = testCollection.byOS(testPlatform, {env, home: '/a/home'});
      const expected = [
        '/a/home/.blueprintrc',
        '/a/home/Library/Preferences/blueprint/.blueprintrc',
        '/a/home/Library/Preferences/blueprint/blueprintrc',
        '/a/home/Library/Preferences/blueprint/config'
      ];
      expect(result).toEqual(expected);
    });

    test('returns an array of paths when platform is win32', () => {
      const testPlatform = 'win32';
      const env = {
        LOCALAPPDATA: '/a/home/LOCALAPPDATA',
        APPDATA: '/a/home/APPDATA'
      };
      const testCollection = new FileCollection([]);
      const result = testCollection.byOS(testPlatform, {env, home: '/a/home'});
      const expected = [
        '/a/home/.blueprintrc',
        '/a/home/LOCALAPPDATA/blueprint/blueprintrc',
        '/a/home/LOCALAPPDATA/blueprint/config',
        '/a/home/APPDATA/blueprint/blueprintrc',
        '/a/home/APPDATA/blueprint/config'
      ];
      expect(result).toEqual(expected);
    });

  });

  describe('allFiles(morePaths, {findUp, path})', () => {
    test('it returns files found', () => {
      const testFiles = [];
      const testCollection = new FileCollection(testFiles);
      const result = testCollection.allFiles(['/some/file'], {platform: 'NoPlatform'});
      console.log('result',result);
      const expected = [
        '/some/file',
        cwd + '/.blueprintrc'
      ];
      expect(result).toEqual(expected);
    });
  });
});

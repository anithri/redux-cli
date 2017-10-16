import fs from 'fs';
import RcCollectionRaw from 'models/rc-collection-raw';
import RcCollection from 'models/rc-collection';

const fakePath = {
  resolve() {
    return [...arguments].join('/');
  }
};
const fakeFindUp = path => `findUp/${path}`;

const allFakeOpts = {
  env: 'fake',
  fs: 'fake',
  rc: 'fake',
  cwd: 'fake',
  home: 'fake',
  path: 'fake',
  dotRc: 'fake',
  appData: 'fake',
  cliFiles: 'fake',
  envFiles: 'fake',
  platform: 'fake',
  userFiles: 'fake',
  systemFiles: 'fake',
  localAppData: 'fake',
  projectFiles: 'fake',
  xdgConfigDirs: 'fake',
  xdgConfigHome: 'fake'
};

describe('(Models) RcCollection', () => {
  let rawRcs, fakeRcs;

  beforeEach(() => {
  });

  describe('#collectFile(file)', () => {
    test('it parse contents of file as JSON', () => {
      const fakeFs = {
        existsSync: () => true,
        statSync: () => ({ isFile: () => true }),
        readFileSync: (path) => (`{"path":"${path}"}`)
      };
      const testArgs = {
        fs: fakeFs,
        collector: () => {},
        files: [],
      };
      const testCollection = new RcCollection(testArgs);
      const testData = testCollection.collectFile('fakeFile');
      expect(testData).toEqual({path: 'fakeFile'});
    });
    test('it removes comments from file before parsing as JSON', () => {
      const fakeFs = {
        existsSync: () => true,
        statSync: () => ({ isFile: () => true }),
        readFileSync: (path) => (`{\n//test one\n/* test \n two \n */\n"path":"${path}"}`)
      };
      const testArgs = {
        fs: fakeFs,
        collector: () => {},
        files: [],
      };
      const testCollection = new RcCollection(testArgs);
      const testData = testCollection.collectFile('fakeFile');
      expect(testData).toEqual({path: 'fakeFile'});
    });
    test('it reads file as json from path', () => {
      const testArgs = {
        collector: () => {},
        files: [],
      };
      const testCollection = new RcCollection(testArgs);
      const testData = testCollection.collectFile('test/fixtures/collectFileTest.json');
      expect(testData.path).toEqual('test/fixtures/collectFileTest.json');
      expect(testData.batman[1]).toEqual('Dark Knight');
    });
    xtest('it copes with errors', () => {
      // TODO after strategy figured out
    });
  });

  describe('#collect(files)', () => {
    test('', () => {
    });
  });
});

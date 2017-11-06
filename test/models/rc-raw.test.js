import RcRaw from 'models/rc-raw';
import path from 'path';
import os from 'os';
const cwd = process.cwd();
const homePath = os.homedir();
const fakePath = {
  resolve() {
    return [...arguments].join('/');
  }
};
const fakeFindUp = path => `findUp/${path}`;

describe('(Models) RcRaw', () => {
  describe('new RcRag(options)', () => {
    test('It assigns options', () => {
      const args = {
        rcFiles: ['FileName'],
        args: { cli: 'Args' },
        defaults: { some: 'defaults' }
      };
      const testRc = new RcRaw(args);
      expect(testRc).to.have.property('rcFiles', args.rcFiles);
      expect(testRc).to.have.property('args', args.args);
      expect(testRc).to.have.property('defaults', args.defaults);
    });
  });

  describe('#data()', () => {
    test('it returns assembled_data if it exists', () => {
      const testData = {Aquaman: 'becomes cool?'};
      const testRcRaw = new RcRaw();


      testRcRaw.assembledData = testData;
      expect(testRcRaw.data()).toEqual(testData);
    });
    test('it calls assembleAll when no assembledData exists', () => {
      const testPaths = [];
      const testRcRaw = new RcRaw(testPaths);

      expect(testRcRaw.assembledData).to.be.undefined;

      expect(testRcRaw.data()).toHaveProperty('assembly', {rcFiles: []});
    });

  });

  // TODO coverage not happy with _reduce
  describe('#collectFile(file, {fs})', () => {
    test('it parse contents of file as JSON', () => {
      const fakeFs = {
        readFileSync: path => `{"path":"${path}"}`
      };
      const testArgs = { fs: fakeFs };
      const testRc = new RcRaw({});
      const testData = testRc.collectFile('fakeFile', testArgs);
      expect(testData).toEqual({ path: 'fakeFile' });
    });
    test('it removes comments from file before parsing as JSON', () => {
      const fakeFs = {
        readFileSync: path =>
          `{\n//test one\n/* test \n two \n */\n"path":"${path}"}`
      };
      const testArgs = { fs: fakeFs };
      const testCollection = new RcRaw({});
      const testData = testCollection.collectFile('fakeFile', testArgs);
      expect(testData).toEqual({ path: 'fakeFile' });
    });
    test('it reads file as json from path', () => {
      const testFixture = path.resolve(
        cwd,
        'test/fixtures/collectFileTest.json'
      );
      const testCollection = new RcRaw({});
      const testData = testCollection.collectFile(testFixture);
      expect(testData.path).toEqual('test/fixtures/collectFileTest.json');
      expect(testData.batman[1]).toEqual('Dark Knight');
    });
    xtest('it copes with errors', () => {
      // TODO after strategy figured out
    });
  });

  describe('#collectAll(files)', () => {
    test('it returns a empty object if called with no files ', () => {
      const testCollection = new RcRaw({});
      const data = testCollection.collectAll([]);
      expect(data).toEqual({});
    });

    test('it returns an an array of each file read', () => {
      const fakeFs = {
        readFileSync: path => `{"path":"${path}"}`
      };
      const testRc = new RcRaw({});
      const testData = testRc.collectAll(['Batmobile', 'UtilityBelt'], {
        fs: fakeFs
      });
      const testCollection = testRc.collection;
      expect(testData).toEqual([
        { path: 'Batmobile' },
        { path: 'UtilityBelt' }
      ]);

      expect(testCollection).toEqual({
        Batmobile: { path: 'Batmobile' },
        UtilityBelt: { path: 'UtilityBelt' }
      });
    });
  });

  describe('#assembleAll(rcFiles, {fs})', () => {
    test('it creates an assembly object on returned data ', () => {
      const defaults = { alfred: 'Pennyworth' };
      const testCollection = new RcRaw({ defaults });
      const data = testCollection.assembleAll([]);

      expect(data.alfred).toEqual('Pennyworth');
      expect(data.assembly.rcFiles).toEqual([]);
    });

    test('it creates an assembly object on returned data ', () => {
      const collection = {
        alfred: {
          name: 'Alfred Pennyworth',
          jobs: ['Butler', 'Medic']
        },
        lucius: {
          name: 'Lucius Fox',
          jobs: ['Industrialist', 'Gadgeteer'],
          location: 'Wayne Tower'
        }
      };

      const fakeFs = {
        readFileSync: path => JSON.stringify(collection[path])
      };

      const defaults = {
        position: 'Ally',
        name: 'Ace'
      };

      const testCollection = new RcRaw({ defaults });

      const data = testCollection.assembleAll(['alfred', 'lucius'], {
        fs: fakeFs
      });

      const expectedData = {
        position: 'Ally',
        name: 'Alfred Pennyworth',
        location: 'Wayne Tower',
        jobs: ['Butler', 'Medic', 'Industrialist', 'Gadgeteer'],
        assembly: {
          rcFiles: ['alfred', 'lucius']
        }
      };

      expect(data).toEqual(expectedData);
    });
  });

  describe('adjustPaths(obj, file, {path})', () => {
    test('it resolves path for all paths found in obj.paths', () => {
      const testObj = {
        paths: {
          testOne: '/abs/dir',
          testTwo: '~/homedir',
          testThree: 'to/file'
        }
      };
      const srcFile = '/dir/path/file';
      const testRc = new RcRaw({});
      const expected = {
        testOne: '/abs/dir',
        testTwo: homePath + '/homedir',
        testThree: '/dir/path/to/file'
      };

      const testResult = testRc.adjustPaths(testObj, srcFile);

      expect(testResult.paths).toEqual(expected);
    });
  });
});

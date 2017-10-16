import fs from 'fs';
import RcCollectionRaw from 'models/rc-collection-raw';
import RcCollection from 'models/rc-collection';

const fakePath = {
  resolve() {
    return [...arguments].join('/');
  }
};
const fakeFindUp = path => `findUp/${path}`;

describe('(Models) RcCollection', () => {
  describe('Completely fakeable traits', () => {
    test('', () => {
      const fakeArgs = {
        fs: 'fake',
        collector: 'fake',
        rawCollection: 'fake',
        files: 'fake',
        collected: 'fake',
        merge: 'fake',
        collection: 'fake',
        assembler: 'fake'
      };

      const testCollection = new RcCollection(fakeArgs);
      expect(testCollection.fs).toEqual('fake');
      expect(testCollection.merge).toEqual('fake');
      expect(testCollection.collector).toEqual('fake');
      expect(testCollection.rawCollection).toEqual('fake');
      expect(testCollection.files).toEqual('fake');
      expect(testCollection.collection).toEqual('fake');
      expect(testCollection.assembler).toEqual('fake');
    });
  });

  describe('#collectFile(file)', () => {
    test('it parse contents of file as JSON', () => {
      const fakeFs = {
        readFileSync: path => `{"path":"${path}"}`
      };
      const testArgs = {
        fs: fakeFs,
        collector: () => {},
        files: []
      };
      const testCollection = new RcCollection(testArgs);
      const testData = testCollection.collectFile('fakeFile');
      expect(testData).toEqual({ path: 'fakeFile' });
    });
    test('it removes comments from file before parsing as JSON', () => {
      const fakeFs = {
        readFileSync: path =>
          `{\n//test one\n/* test \n two \n */\n"path":"${path}"}`
      };
      const testArgs = {
        fs: fakeFs,
        collector: () => {},
        files: []
      };
      const testCollection = new RcCollection(testArgs);
      const testData = testCollection.collectFile('fakeFile');
      expect(testData).toEqual({ path: 'fakeFile' });
    });
    test('it reads file as json from path', () => {
      const testArgs = {
        collector: () => {},
        files: []
      };
      const testCollection = new RcCollection(testArgs);
      const testData = testCollection.collectFile(
        'test/fixtures/collectFileTest.json'
      );
      expect(testData.path).toEqual('test/fixtures/collectFileTest.json');
      expect(testData.batman[1]).toEqual('Dark Knight');
    });
    xtest('it copes with errors', () => {
      // TODO after strategy figured out
    });
  });

  describe('#collector', () => {
    test('it defaults to #collectAll()', () => {
      const testArgs = {
        files: []
      };
      const testCollection = new RcCollection(testArgs);
      expect(testCollection).to.respondTo('collector');
    });
  });

  describe('#assembler', () => {
    test('it defaults to #assembleAll()', () => {
      const testArgs = {
        files: []
      };
      const testCollection = new RcCollection(testArgs);
      expect(testCollection).to.respondTo('assembler');
    });
  });

  describe('#collectAll(files)', () => {
    test('it returns a empty object if called with no files ', () => {
      const testArgs = {
        files: [],
        collector: files => files
      };
      const testCollection = new RcCollection(testArgs);
      const data = testCollection.collectAll([]);
      expect(data).toEqual({});
    });

    test('it returns an object with files as keys', () => {
      const fakeFs = {
        readFileSync: path => `{"path":"${path}"}`
      };
      const testArgs = {
        fs: fakeFs,
        files: ['Batmobile', 'UtilityBelt']
      };
      const testCollection = new RcCollection(testArgs);
      const data = testCollection.collection;
      expect(data).toEqual({
        Batmobile: { path: 'Batmobile' },
        UtilityBelt: { path: 'UtilityBelt' }
      });
    });
  });

  describe('#assembleAll(order, collection, defaults = {})', () => {
    test('it creates an assembly object on returned data ', () => {
      const testArgs = {
        files: []
      };
      const defaults = { alfred: 'Pennyworth' };
      const testCollection = new RcCollection(testArgs);
      const data = testCollection.assembleAll([], {}, defaults);

      expect(data.alfred).toEqual('Pennyworth');
      expect(data.assembly.configFiles).toEqual([]);
    });

    test('it creates an assembly object on returned data ', () => {
      const testArgs = {
        files: []
      };
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
      const defaults = {
        position: 'Ally',
        name: 'Ace'
      };
      const testCollection = new RcCollection(testArgs);
      const data = testCollection.assembleAll(
        ['alfred', 'lucius'],
        collection,
        defaults
      );
      const expectedData = {
        position: 'Ally',
        name: 'Alfred Pennyworth',
        location: 'Wayne Tower',
        jobs: ['Butler', 'Medic', 'Industrialist', 'Gadgeteer'],
        assembly: {
          configFiles: ['alfred', 'lucius']
        }
      };

      expect(data).toEqual(expectedData);
    });
  });
});

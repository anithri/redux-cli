import RcData from 'models/rc-data';

describe('RcData', () => {
  describe('constructor(data, merger = mergeData)', () => {
    test('it sets data and merger', () => {
      const data = new RcData('Catwoman', 'Poison Ivy');
      expect(data.data).toEqual('Catwoman');
      expect(data.merger).toEqual('Poison Ivy');
    });
  });

  describe('#atBp(name)', () => {
    test('it returns the data at bp.name', () => {
      const testData = {
        bp: {
          batman: { hero: 'always' }
        }
      };

      const data = new RcData(testData);
      expect(data.atBp('batman')).toEqual({ hero: 'always' });
    });
  });

  describe('#atCommon()', () => {
    test('it returns the data at bp.common', () => {
      const testData = {
        bp: {
          common: { hero: 'unknown' }
        }
      };
      const data = new RcData(testData);

      expect(data.atCommon()).toEqual({ hero: 'unknown' });
    });
  });

  describe('#for(key,defaultVal)', () => {
    test('it returns defaultVal if key is not found', () => {
      const data = new RcData('', {});
      expect(data.for('no.key.here')).to.be.undefined;
      expect(data.for('no.key.here', 'useThis')).toEqual('useThis');
    });

    test('it returns the key at locations using lodash.get', () => {
      const fakeRcData = {
        testOne: 'good',
        deeper: {
          testTwo: 'better',
          testArr: ['yep', 'nope']
        },
        testArr: ['not really', 'got it']
      };
      const data = new RcData(fakeRcData);
      expect(data.for('testOne')).toEqual('good');
      expect(data.for('deeper.testTwo')).toEqual('better');
      expect(data.for('testArr[1]')).toEqual('got it');
      expect(data.for('deeper.testArr[0]')).toEqual('yep');
    });
  });

  describe('#forBp(name, key, defaultVal)', () => {
    test('it returns undefined when bpName is not found', () => {
      const data = new RcData({});
      expect(data.forBp('noBp', 'noKey')).to.be.undefined;
    });

    test('it returns default when key at bpName is not found', () => {
      const expected = 'Selina Kyle';
      const testData = { bp: { tweener: { name: expected } } };
      const data = new RcData(testData);
      expect(data.forBp('tweener', 'name', 'Selina Kyle')).toEqual(expected);
    });

    test('it returns data for key at bpName', () => {
      const fakeData = {
        bp: {
          WayneManor: {
            stately: 'WayneManor'
          }
        }
      };
      const data = new RcData(fakeData);
      const expectedData = 'WayneManor';

      expect(data.forBp('WayneManor', 'stately')).toEqual(expectedData);
    });
  });

  describe('#with({defaults, common, data, priority})', () => {
    test('it returns a RcData obj', () => {
      const fakeData = {};
      const data = new RcData(fakeData);
      const testData = data.with({});

      expect(testData).to.be.an.instanceOf(RcData);
    });

    test('it returns a merged data', () => {
      const fakeDefaults = {
        defaults: 'fakeDefaults',
        common: 'fakeDefaults',
        data: 'fakeDefaults',
        priority: 'fakeDefaults',
        parts: ['fakeDefaults']
      };
      const fakeCommon = {
        common: 'fakeCommon',
        data: 'fakeCommon',
        priority: 'fakeCommon',
        parts: ['fakeCommon']
      };
      const fakeData = {
        data: 'fakeData',
        priority: 'fakeData',
        parts: ['fakeData']
      };
      const fakePriority = {
        priority: 'fakePriority',
        parts: ['fakePriority']
      };
      const expected = {
        defaults: 'fakeDefaults',
        common: 'fakeCommon',
        data: 'fakeData',
        priority: 'fakePriority',
        parts: ['fakePriority', 'fakeData', 'fakeCommon', 'fakeDefaults']
      };
      const data = new RcData({});
      const testRc = data.with({
        defaults: fakeDefaults,
        priority: fakePriority,
        data: fakeData,
        common: fakeCommon
      });

      expect(testRc.data).toEqual(expected);
    });

    test('it defaults to using this.data', () => {
      const fakeData = {
        fakeData: 'tru dat'
      };
      const data = new RcData(fakeData);
      const next = data.with({});
      expect(next.data).toEqual(data.data);
    });
  });

  describe('#withBp(name, defaults = {})', () => {
    test('it returns a RcData obj', () => {
      const fakeData = {};
      const fakeDefaults = {};
      const data = new RcData(fakeData);
      const bpData = data.withBp('no.data', { defaults: fakeDefaults });

      expect(bpData).to.be.an.instanceOf(RcData);
    });

    test('it returns merged data', () => {
      const fakeData = {
        bp: {
          batman: {
            gadget: 'batmobile',
            sidekick: 'alfred'
          }
        }
      };
      const fakeDefaults = {
        symbol: 'duh, a bat',
        gadget: 'utilityBelt'
      };
      const expected = {
        gadget: 'batmobile',
        sidekick: 'alfred',
        symbol: 'duh, a bat'
      };
      const data = new RcData(fakeData);
      const testData = data.withBp('batman', { defaults: fakeDefaults });

      expect(testData.data).toEqual(expected);
    });

    test('it defaults to using this.common', () => {
      const fakeData = {
        bp: {
          common: {
            common: 'Yes sir',
            data: 'common'
          },
          myBp: {
            myBp: 'Yeah',
            data: 'bp'
          }
        }
      };
      const expected = {
        common: 'Yes sir',
        myBp: 'Yeah',
        data: 'bp'
      };
      const data = new RcData(fakeData);
      expect(data.withBp('myBp', {}).data).toEqual(expected);
    });
  });
});

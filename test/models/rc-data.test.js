import RcData from 'models/rc-data';

describe('RcData', () => {
  describe('constructor(data, merger = mergeData)', () => {
    test('it sets data and merger', () => {
      const data = new RcData('Catwoman', 'Poison Ivy');
      expect(data.data).toEqual('Catwoman');
      expect(data.merger).toEqual('Poison Ivy');
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

  describe('#forBp(bpName,bpDefaults)', () => {
    test('it returns an {} when bpName is not found', () => {
      const data = new RcData({});
      expect(data.forBp('no.bp')).toEqual({});
    });

    test('it returns an defaults when bpName is not found', () => {
      const testData = { name: 'Selina Kyle' };
      const data = new RcData({});
      expect(data.forBp('no.bp', testData)).toEqual(testData);
    });

    test('it returns data at bp[name]', () => {
      const fakeData = {
        bp: {
          WayneManor: {
            stately: 'WayneManor'
          }
        }
      };
      const data = new RcData(fakeData);
      const expectedData = { stately: 'WayneManor' };

      expect(data.forBp('WayneManor')).toEqual(expectedData);
    });
    test('it returns data at bp[name] merged with defaults', () => {
      const fakeData = {
        bp: {
          WayneManor: {
            stately: 'WayneManor'
          }
        }
      };
      const fakeDefaults = { target: 'often' };

      const data = new RcData(fakeData);
      const expectedData = { stately: 'WayneManor', target: 'often' };

      expect(data.forBp('WayneManor', fakeDefaults)).toEqual(expectedData);
    });
  });

  describe('#withDefaults(defaults)', () => {
    test('it returns a RcData obj', () => {
      const fakeData = {};
      const fakeDefaults = {};
      const data = new RcData(fakeData);
      const testData = data.withDefaults(fakeDefaults);

      expect(testData).to.be.an.instanceOf(RcData);
    });

    test('it returns a merged data', () => {
      const fakeData = {
        src: 'fakeData',
        data: 'is Good'
      };
      const fakeDefaults = {
        src: 'fakeDefaults',
        defaults: 'is Good'
      };
      const expected = {
        src: 'fakeData',
        data: 'is Good',
        defaults: 'is Good'
      };
      const data = new RcData(fakeData);
      const testData = data.withDefaults(fakeDefaults);

      expect(testData.data).toEqual(expected);
    });
  });

  describe('#withPriority(priority)', () => {
    test('it returns a RcData obj', () => {
      const fakeData = {};
      const fakePriority = {};
      const data = new RcData(fakeData);

      const testData = data.withPriority(fakePriority);
      expect(testData).to.be.an.instanceOf(RcData);
    });

    test('it returns merged data', () => {
      const fakeData = {
        src: 'fakeData',
        data: 'is Good'
      };
      const fakePriority = {
        src: 'fakePriority',
        priority: 'is Good'
      };
      const expected = {
        src: 'fakePriority',
        data: 'is Good',
        priority: 'is Good'
      };
      const data = new RcData(fakeData);
      const testData = data.withPriority(fakePriority);

      expect(testData.data).toEqual(expected);
    });
  });

  describe('#withBp(name, defaults = {})', () => {
    test('it returns a RcData obj', () => {
      const fakeData = {};
      const fakeDefaults = {};
      const data = new RcData(fakeData);
      const bpData = data.withBp('no.data', fakeDefaults);

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
      const fakeBp = {
        symbol: 'duh, a bat',
        gadget: 'utilityBelt'
      };
      const expected = {
        gadget: 'batmobile',
        sidekick: 'alfred',
        symbol: 'duh, a bat'
      };
      const data = new RcData(fakeData);
      const testData = data.withBp('batman', fakeBp);

      expect(testData.data).toEqual(expected);
    });
  });
});

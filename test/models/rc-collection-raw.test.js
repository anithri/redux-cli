import fs from 'fs';
import RcCollectionRaw from 'models/rc-collection-raw';

const CWD = process.cwd();
const ENV = process.env;
delete ENV.BLUEPRINT_RC;

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

describe('(Models) RcCollectionRaw', () => {
  let rawRcs, fakeRcs;

  beforeEach(() => {
    delete ENV.BLUEPRINT_RC;
    rawRcs = new RcCollectionRaw();
    fakeRcs = new RcCollectionRaw(allFakeOpts);
  });

  describe('Completely fakeable traits', () => {
    test('', () => {
      expect(fakeRcs.env).toEqual('fake');
      expect(fakeRcs.fs).toEqual('fake');
      expect(fakeRcs.rc).toEqual('fake');
      expect(fakeRcs.cwd).toEqual('fake');
      expect(fakeRcs.home).toEqual('fake');
      expect(fakeRcs.path).toEqual('fake');
      expect(fakeRcs.dotRc).toEqual('fake');
      expect(fakeRcs.appData).toEqual('fake');
      expect(fakeRcs.cliFiles).toEqual('fake');
      expect(fakeRcs.envFiles).toEqual('fake');
      expect(fakeRcs.platform).toEqual('fake');
      expect(fakeRcs.userFiles).toEqual('fake');
      expect(fakeRcs.systemFiles).toEqual('fake');
      expect(fakeRcs.localAppData).toEqual('fake');
      expect(fakeRcs.projectFiles).toEqual('fake');
      expect(fakeRcs.xdgConfigDirs).toEqual('fake');
      expect(fakeRcs.xdgConfigHome).toEqual('fake');
    });
  });

  describe('fs', () => {
    test('it defaults to system fs', () => {
      expect(rawRcs.fs).toEqual(fs);
    });
  });

  describe('rc', () => {
    test('it has a default value of blueprintrc', () => {
      expect(rawRcs.rc).toEqual('blueprintrc');
    });
    test('it uses ENV.BLUEPRINT_RC if present', () => {
      ENV.BLUEPRINT_RC = 'bprc';
      const testRcs = new RcCollectionRaw();
      expect(testRcs.rc).toEqual('bprc');
    });
  });

  describe('cwd', () => {
    test('it defaults to process.cwd()', () => {
      const cwd = process.cwd();
      expect(rawRcs.cwd).toEqual(cwd);
    });
  });

  describe('env', () => {
    test('it defaults to process.env', () => {
      expect(rawRcs.env).toEqual(process.env);
    });
  });

  describe('home', () => {
    test('it defaults value to HOME', () => {
      const testEnv = {
        HOME: 'wootHOME',
        HOMEPATH: 'wootHOMEPATH',
        USERPROFILE: 'wootUSERPROFILE'
      };
      const testRcs = new RcCollectionRaw({ env: testEnv });
      expect(testRcs.home).toEqual('wootHOME');
    });
    test('it defaults value to HOMEPATH', () => {
      const testEnv = {
        HOMEPATH: 'wootHOMEPATH',
        USERPROFILE: 'wootUSERPROFILE'
      };
      const testRcs = new RcCollectionRaw({ env: testEnv });
      expect(testRcs.home).toEqual('wootHOMEPATH');
    });
    test('it defaults value to USERPROFILE', () => {
      const testEnv = {
        USERPROFILE: 'wootUSERPROFILE'
      };
      const testRcs = new RcCollectionRaw({ env: testEnv });
      expect(testRcs.home).toEqual('wootUSERPROFILE');
    });
  });

  describe('dot_rc', () => {
    test('', () => {
      expect(rawRcs.dotRc).toEqual('.blueprintrc');
    });
  });

  describe('cliFiles', () => {
    test('it defaults to empty array', () => {
      const testOpts = {
        env: {},
        home: '/HOME'
        // path: fakePath,
      };
      const expectedPaths = [];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.cliFiles).toEqual(expectedPaths);
    });
  });

  describe('envFiles', () => {
    test('it defaults to empty array', () => {
      const testOpts = {
        env: {},
        home: '/HOME'
        // path: fakePath,
      };
      const expectedPaths = [];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.envFiles).toEqual(expectedPaths);
    });
  });

  describe('userFiles', () => {
    test('it returns a set of paths on linux', () => {
      const testOpts = {
        home: 'userHome',
        xdgConfigHome: 'xdgConfigHome',
        path: fakePath,
        platform: 'linux'
      };
      const expectedPaths = [
        'userHome/.blueprintrc',
        'userHome/xdgConfigHome/.blueprintrc',
        'userHome/xdgConfigHome/blueprintrc',
        'userHome/xdgConfigHome/blueprint/blueprintrc',
        'userHome/xdgConfigHome/blueprint/config'
      ];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.userFiles).toEqual(expectedPaths);
    });

    test('it returns a set of paths on darwin', () => {
      const testOpts = {
        home: 'userHome',
        path: fakePath,
        platform: 'darwin'
      };
      const expectedPaths = [
        'userHome/.blueprintrc',
        'userHome/Library/Preferences/blueprint/.blueprintrc',
        'userHome/Library/Preferences/blueprint/blueprintrc',
        'userHome/Library/Preferences/blueprint/config'
      ];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.userFiles).toEqual(expectedPaths);
    });

    test('it returns a set of paths on win32', () => {
      const testOpts = {
        home: 'userHome',
        path: fakePath,
        platform: 'win32',
        appData: 'appData',
        localAppData: 'localAppData'
      };
      const expectedPaths = [
        'userHome/.blueprintrc',
        'localAppData/blueprint/blueprintrc',
        'localAppData/blueprint/config',
        'appData/blueprint/blueprintrc',
        'appData/blueprint/config'
      ];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.userFiles).toEqual(expectedPaths);
    });
  });

  describe('projectFiles', () => {
    test('', () => {
      const testOpts = { findUp: fakeFindUp };
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.projectFiles).toEqual(['./.blueprintrc','findUp/.blueprintrc']);
    });
  });

  describe('systemFiles', () => {
    test('it returns a set of paths on linux', () => {
      const testOpts = {
        env: { XDG_CONFIG_DIRS: 'Joker:Riddler' },
        home: 'userHome',
        path: fakePath,
        platform: 'linux'
      };
      const expectedPaths = ['Joker/blueprintrc', 'Riddler/blueprintrc'];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.systemFiles).toEqual(expectedPaths);
    });

    test('it returns a set of paths on darwin', () => {
      const testOpts = {
        path: fakePath,
        platform: 'darwin'
      };
      const expectedPaths = [
        '/Library/Preferences/blueprint/blueprintrc',
        '/Library/Preferences/blueprint/config'
      ];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.systemFiles).toEqual(expectedPaths);
    });

    test('it returns a set of paths on win32', () => {
      const testOpts = {
        path: fakePath,
        platform: 'win32'
      };
      const expectedPaths = [];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.systemFiles).toEqual(expectedPaths);
    });
  });

  describe('rawPaths', () => {
    test('', () => {
      const testOpts = {
        env: { BLUEPRINT_CONFIG: 'Batman:Robin' },
        cwd: 'TEST',
        path: fakePath,
        findUp: fakeFindUp,
        home: 'userHome',
        xdgConfigHome: 'xdgConfigHome',
        path: fakePath,
        platform: 'linux'
      };
      const expectedPaths = [
        'TEST/Batman',
        'TEST/Robin',
        'findUp/.blueprintrc',
        'userHome/.blueprintrc',
        'userHome/xdgConfigHome/.blueprintrc',
        'userHome/xdgConfigHome/blueprintrc',
        'userHome/xdgConfigHome/blueprint/blueprintrc',
        'userHome/xdgConfigHome/blueprint/config',
        'Joker/blueprintrc',
        'Riddler/blueprintrc',
        'Joker/blueprintrc',
        'Riddler/blueprintrc'
      ];
    });
  });

  describe('paths', () => {
    test('returns rawPaths that exist', () => {
      let flipper = 0;
      const fakeFs = {
        existsSync: () => true,
        statSync: f => ({ isFile: () => !!(++flipper % 2) })
      };
      const testOpts = {
        env: {
          BLUEPRINT_CONFIG: 'Batman:Robin',
          XDG_CONFIG_DIRS: 'Joker:Riddler'
        },
        cwd: 'TEST',
        findUp: fakeFindUp,
        home: 'userHome',
        xdgConfigHome: 'xdgConfigHome',
        path: fakePath,
        platform: 'linux',
        fs: fakeFs
      };
      const expectedFiles = [
        'TEST/Batman',
        // 'TEST/Robin',
        './.blueprintrc',
        // 'findUp/.blueprintrc',
        'userHome/.blueprintrc',
        // 'userHome/xdgConfigHome/.blueprintrc',
        'userHome/xdgConfigHome/blueprintrc',
        // 'userHome/xdgConfigHome/blueprint/blueprintrc',
        'userHome/xdgConfigHome/blueprint/config',
        // 'Joker/blueprintrc'
        'Riddler/blueprintrc'
      ];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.files()).toEqual(expectedFiles);
    });
  });

  describe('fileExists', () => {
    test('is true when file exists and is file', () => {
      const fakeFs = {
        existsSync: () => true,
        statSync: () => ({ isFile: () => true })
      };

      const testOpts = { fs: fakeFs };
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.fileExists('JimGordon')).to.be.truthy;
    });
    test('is false when file exists and is not file', () => {
      const fakeFs = {
        existsSync: () => true,
        statSync: () => ({ isFile: () => false })
      };

      const testOpts = { fs: fakeFs };
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.fileExists('JimGordon')).to.be.falsy;
    });

    test('is false when file does not exist', () => {
      const fakeFs = {
        existsSync: () => false,
        statSync: () => ({ isFile: () => false })
      };

      const testOpts = { fs: fakeFs };
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.fileExists('JimGordon')).to.be.falsy;
    });
  });

  describe('#normalizePaths(orig)', () => {
    test('returns [] if passed undefined', () => {
      const testOpts = {
        cwd: '/Batcave',
        path: fakePath
      };
      let paths;
      const expectedPaths = [];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.adjustPaths()).toEqual(expectedPaths);
      expect(testRcs.adjustPaths(paths)).toEqual(expectedPaths);
    });
    test('returns original array if passed an array', () => {
      const testOpts = {
        cwd: '/Arkham',
        path: fakePath
      };
      const paths = ['Asylum'];
      const expectedPaths = ['/Arkham/Asylum'];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.adjustPaths(paths)).toEqual(expectedPaths);
    });
    test('returns an array containing string without a ":"', () => {
      const testOpts = {
        cwd: '/GothamCity',
        path: fakePath
      };
      const paths = 'PoliceDepartment';
      const expectedPaths = ['/GothamCity/PoliceDepartment'];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.adjustPaths(paths)).toEqual(expectedPaths);
    });
    test('returns an array containing strings separated by ":"', () => {
      const testOpts = {
        cwd: '/WayneManor',
        path: fakePath
      };
      const paths = 'Batcave:Stately';
      const expectedPaths = ['/WayneManor/Batcave', '/WayneManor/Stately'];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.adjustPaths(paths)).toEqual(expectedPaths);
    });
    test('returns [] if passed anything else', () => {
      const testOpts = {
        cwd: '/TEST',
        path: fakePath
      };
      const paths = 2;
      const expectedPaths = [];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.adjustPaths(paths)).toEqual(expectedPaths);
    });
  });

  describe('#adjustPaths', () => {
    test('it returns files unchanged without leading ~', () => {
      const testOpts = {
        cwd: '/TEST',
        path: fakePath
      };
      const origPaths = 'Batman:Robin';
      const expectedPaths = ['/TEST/Batman', '/TEST/Robin'];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.adjustPaths(origPaths)).toEqual(expectedPaths);
    });

    test('it returns files with leading ~ with home path', () => {
      const testOpts = {
        home: '/HOME',
        cwd: '/TEST',
        path: fakePath
      };
      const origPaths = '~Batman:Robin';
      const expectedPaths = ['/HOME/Batman', '/TEST/Robin'];
      const testRcs = new RcCollectionRaw(testOpts);
      expect(testRcs.adjustPaths(origPaths)).toEqual(expectedPaths);
    });
  });

  describe('handleOS', () => {
    test('it exists', () => {
      // all output is tested via .userFiles and .systemFiles
      expect(fakeRcs.handleOS).to.exist;
    });
  });
});

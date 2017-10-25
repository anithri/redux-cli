import merge from 'deepmerge';
import _map from 'lodash/map';

function arrayMerger(destArr, srcArr, options) {
  destArr.unshift(...srcArr);
  return destArr;
}

function mergeData(datum, arrayMerge = arrayMerger) {
  return merge.all(datum, {arrayMerge});
}

function normalizePaths(orig) {
  if (Array.isArray(orig)) return orig;
  if (typeof orig === 'string') return orig.split(':');
  return [];
}

function resolvePath(rawPaths, home, cwd, pathEx) {
  const paths = normalizePaths(rawPaths);
  return _map(paths, p => {
    if (p[0] === '~') {
      return pathEx.resolve(home, p.slice(1));
    } else {
      return pathEx.resolve(cwd, p);
    }
  });
}

export { resolvePath, normalizePaths };

export default mergeData;

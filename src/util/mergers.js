import merge from 'deepmerge';

function arrayMerge(destArr, srcArr, options) {
  destArr.unshift(...srcArr);
  return destArr;
}

function mergeData(orig, fresh, merger = arrayMerge) {
  return merge(orig, fresh, { arrayMerge: merger });
}

export default mergeData;

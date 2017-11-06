module.exports = {
  description() {
    return 'Basic blueprint for testing';
  },
  fileMapTokens() {
    return {
      __duck__: options => {
        return 'redux/modules';
      }
    };
  }
};

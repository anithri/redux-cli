module.exports = {
  description() {
    return 'Generates a package for blueprints';
  },

  command: {
    aliases: [],
    options: {},
    examples: ['$0 generate cabinet redux-auto'],
    epilogue:
      'Documentation: https://github.com/SpencerCDixon/redux-cli#creating-cabinets',
    sanitize: argv => {
      return argv;
    }
  },

  locals({ entity: { options } }) {
    return options;
  }
};

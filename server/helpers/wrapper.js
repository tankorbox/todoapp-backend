

const wrapper = promise => (...args) => promise(...args).catch(args[args.length - 1]);

module.exports = wrapper;
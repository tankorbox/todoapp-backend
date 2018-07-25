

const wrapper = promise => (...args) => {
	return promise(...args).catch(args[args.length - 1]);
};

module.exports = wrapper;
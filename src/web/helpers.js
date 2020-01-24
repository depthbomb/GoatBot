module.exports = {
	xif: (v1, op, v2, options) => {
		const c = {
			'eq': (v1, v2) => v1 === v2,
			'ne': (v1, v2) => v1 !== v2,
			'gt': (v1, v2) => v1 > v2,
			'lt': (v1, v2) => v1 < v2,
			'gte': (v1, v2) => v1 >= v2,
			'lte': (v1, v2) => v1 <= v2,
		}

		if (Object.prototype.hasOwnProperty.call(c, op))
			return c[op].call(this, v1, v2) ? options.fn(this) : options.inverse(this);

		return options.inverse(this);
	},
	title: (context) => {
		const title = context.data.root.title;
		if (title) {
			return `${title} - GoatBot!`;
		} else {
			return 'GoatBot!';
		}
	}
};
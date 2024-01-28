const crypto = require('crypto');

exports.randomData = (props) => {
	const data = {};
	for (let i of props) {
		const randomBytes = crypto.randomBytes(8).toString('hex');
		data[i] = randomBytes;
	}
	return { ...data };
};
